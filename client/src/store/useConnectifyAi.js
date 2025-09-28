import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const useConnectifyAi = create((set) => ({
  response: "",
  loading: false,
  error: "",
  generateResponse: async (prompt) => {
    set({ loading: true });
    try {
      const { data } = await axiosInstance.post("ai/connectifyAi", {
        prompt,
      });
      set({ response: data.response, loading: false });
      toast.success(data.message);
    } catch (error) {
      set({ error: error.message, loading: false });
      if (error.response.status === 500) {
        toast.error("Quota exhausted. Please try again later.");
      } else {
        toast.error("Failed to generate response.");
      }
    }
  },
  clearResponse: () => {
    set({ response: "", loading: false, error: "" });
  },
}));
