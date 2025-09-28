import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { useConnectifyAi } from "./useConnectifyAi";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:8000" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,
  isResettingPassword: false,

  checkAuth: async () => {
    try {
      const response = await axiosInstance.get("/auth/check");
      set({ authUser: response.data });
      get.connectSocket();
    } catch (error) {
      console.log("Error checking auth", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (formData) => {
    set({ isSigningUp: true });
    try {
      const response = await axiosInstance.post("/auth/signup", formData);
      set({ authUser: response.data });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
      console.log("Error signing up", error);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (formData) => {
    set({ isLoggingIn: true });
    try {
      const response = await axiosInstance.post("/auth/login", formData);
      set({ authUser: response.data });
      toast.success("Logged in successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
      console.log("Error logging in", error);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    const { clearResponse } = useConnectifyAi.getState(); // Get clearResponse method

    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();

      // Clear AI responses on logout
      clearResponse();
    } catch (error) {
      toast.error("Error logging out");
      console.log("Error logging out", error.response.data);
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const response = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: response.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Error updating profile");
      console.log("Error updating profile", error);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  sendForgotPasswordEmail: async (email) => {
    set({ isSendingForgotPasswordEmail: true });
    try {
      await axiosInstance.post("auth/send-forgot-password-email", { email });
      toast.success("Password reset link sent to your email.");
    } catch (error) {
      toast.error("Failed to send password reset link.");
      console.log("Error sending forgot password email", error);
    } finally {
      set({ isSendingForgotPasswordEmail: false });
    }
  },

  resetPassword: async (token, password) => {
    set({ isResettingPassword: true });

    try {
      const response = await axiosInstance.put(
        `/auth/reset-password/${token}`,
        {
          password,
        }
      );

      toast.success(response.message || "Password reset successfully!");
    } catch (error) {
      toast.error(error.message);
    } finally {
      set({ isResettingPassword: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();
    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },
  disconnectSocket: () => {
    if (get().socket?.connected) {
      get().socket.disconnect();
    }
  },
}));
