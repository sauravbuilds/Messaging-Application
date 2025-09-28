import React, { useState, useEffect, useRef } from "react";
import { X, Send, Loader } from "lucide-react";
import { useConnectifyAi } from "../store/useConnectifyAi";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast"; 

function AiPanel({ isOpen, onClose }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const { authUser } = useAuthStore();
  const { response, loading, generateResponse } = useConnectifyAi();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Only add AI message if response is not empty
    if (response) {
      const aiMessage = { role: "ai", content: response };
      setMessages((prev) => [...prev, aiMessage]);
    }
  }, [response]);

  useEffect(() => {
    // Send a greeting message when the panel opens
    if (isOpen && authUser) {
      const greetingMessage = `Hello ${authUser.fullName}! How can I assist you today?`;
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: greetingMessage, isGreeting: true },
      ]);
    }
  }, [isOpen, authUser]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);

    // Generate response and clear input
    await generateResponse(input.trim());
    setInput("");
  };

  return (
    <div
      className={`fixed inset-y-0 right-0 w-full max-w-sm bg-base-200 shadow-xl transform transition-transform duration-300 z-50 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-base-300">
        <h2 className="text-lg font-semibold">Connectify Assistant</h2>
        <button
          onClick={onClose}
          className="btn btn-ghost btn-circle rounded-full size-8 flex items-center justify-center"
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages Section */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[70vh]">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            } items-start gap-2`}
          >
            {message.role === "ai" && (
              <img
                src="https://img.freepik.com/free-vector/graident-ai-robot-vectorart_78370-4114.jpg?semt=ais_hybrid"
                alt="AI Avatar"
                className="w-8 h-8 rounded-full"
              />
            )}
            <div className="relative max-w-[75%]">
              <div
                className={`px-4 py-2 rounded-lg text-sm ${
                  message.role === "user"
                    ? "bg-primary text-white rounded-br-none"
                    : "bg-base-300 text-base-content rounded-bl-none"
                }`}
              >
                {message.content}
              </div>
            </div>
            {message.role === "user" && (
              <img
                src={
                  authUser.profilePic ||
                  `https://avatar.iran.liara.run/username?username=${authUser?.fullName}`
                }
                alt="User Avatar"
                className="w-8 h-8 rounded-full"
              />
            )}
          </div>
        ))}
        {loading && (
          <div className="flex justify-start items-center gap-2">
            <img
              src="https://img.freepik.com/free-vector/graident-ai-robot-vectorart_78370-4114.jpg?semt=ais_hybrid"
              alt="Assistant Avatar"
              className="w-8 h-8 rounded-full"
            />
            <div className="max-w-[75%] px-4 py-2 rounded-lg text-sm bg-base-300 text-base-content flex items-center gap-2">
              <Loader size={16} className="animate-spin" />
              Thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Section */}
      <div className="p-4 border-t border-base-300 bg-base-200">
        <div className="flex items-center gap-2">
          <input
            type="text"
            className="input input-bordered flex-1 rounded-lg"
            placeholder="Ask me anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            onClick={handleSendMessage}
            className="btn btn-primary btn-circle size-10 flex items-center justify-center"
            disabled={!input.trim() || loading}
          >
            {loading ? (
              <Loader size={18} className="animate-spin" />
            ) : (
              <Send size={18} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AiPanel;
