import React, { useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { useChatStore } from "../store/useChatStore";
import { BotMessageSquare, Send, X, Image, Smile } from "lucide-react";
import toast from "react-hot-toast";
import AiPanel from "./AiPanel";

function MessageInput() {
  const [text, setText] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isAiPanelOpen, setAiPanelOpen] = useState(false);

  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file type. Please select an image file.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_SIZE) {
      toast.error("File is too large. Please select an image under 5MB.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.onerror = () => {
      toast.error("Error reading file. Please try again.");
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setPreviewImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleEmojiClick = (emojiObject) => {
    setText((prev) => prev + emojiObject.emoji);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!text.trim() && !previewImage) return;

    try {
      await sendMessage({ text: text.trim(), image: previewImage });

      setText("");
      setPreviewImage(null);
      setShowEmojiPicker(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message. Please try again.");
    }
  };

  const handleKeyDown = (e) => {
    // If Enter key is pressed and input is empty, open the AI panel
    if (e.key === "Enter" && !text.trim() && !previewImage) {
      e.preventDefault(); // Prevent the default form submission
      setAiPanelOpen(true);
    }
  };

  const handleAiPanelOpen = () => {
    setAiPanelOpen(true);
  };

  return (
    <div className="p-4 w-full relative">
      {previewImage && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={previewImage}
              alt="Preview"
              className="size-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-base-300 flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 relative flex items-center">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md pr-16"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown} // Handle key down events
          />
          <div className="absolute right-2 flex items-center gap-1">
            <button
              type="button"
              className="btn btn-ghost btn-xs btn-circle"
              onClick={() => setShowEmojiPicker((prev) => !prev)}
            >
              <Smile size={16} className="text-zinc-400" />
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-xs btn-circle"
              onClick={() => fileInputRef.current?.click()}
            >
              <Image size={16} className="text-zinc-400" />
            </button>
          </div>
        </div>

        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageChange}
        />

        <button
          type="submit"
          className="btn btn-primary btn-circle size-10 sm:size-12"
          disabled={!text.trim() && !previewImage}
        >
          <Send size={18} />
        </button>

        <button
          type="button" // Keep as button to avoid form submission
          className="btn btn-primary btn-circle size-10 sm:size-12"
          onClick={handleAiPanelOpen} // Opens AiPanel
        >
          <BotMessageSquare size={20} />
        </button>
        {/* AiPanel Component */}
        <AiPanel isOpen={isAiPanelOpen} onClose={() => setAiPanelOpen(false)} />
      </form>

      {showEmojiPicker && (
        <div className="absolute bottom-16 right-20 bg-base-200 rounded-lg shadow-lg z-10">
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            width={350}
            height={300}
            theme="dark"
          />
        </div>
      )}
    </div>
  );
}

export default MessageInput;
