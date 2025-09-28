import React, { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils.js";
import ImagePreviewModal from "./ImagePreviewModal";

function ChatContainer() {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();

  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [previewVideo, setPreviewVideo] = useState(null);

  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
      subscribeToMessages();
    }

    return () => unsubscribeFromMessages();
  }, [
    selectedUser?._id,
    subscribeToMessages,
    unsubscribeFromMessages,
    getMessages,
  ]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleImagePreview = (imageUrl, messageText) => {
    setPreviewImage({ url: imageUrl, text: messageText });
  };

  const handleVideoPreview = (videoUrl, messageText) => {
    setPreviewVideo({ url: videoUrl, text: messageText });
  };

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId === authUser._id ? "chat-end" : "chat-start"
            }`}
            ref={messageEndRef}
          >
            <div className="chat-image avatar">
              <div className="w-10 h-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic ||
                        `https://avatar.iran.liara.run/username?username=${authUser?.fullName}`
                      : selectedUser.profilePic ||
                        `https://avatar.iran.liara.run/username?username=${selectedUser?.fullName}`
                  }
                  alt="Profile Image"
                />
              </div>
            </div>
            <div className="chat-footer mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div
              className={`chat-bubble flex flex-col p-4 max-w-[80%] break-words`}
            >
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2 cursor-pointer"
                  onClick={() =>
                    handleImagePreview(message.image, message.text)
                  }
                />
              )}
              {message.video && (
                <video
                  src={message.video}
                  alt="Video"
                  className="sm:max-w-[200px] rounded-md mb-2 cursor-pointer"
                  onClick={() =>
                    handleVideoPreview(message.video, message.text)
                  }
                />
              )}
              {message.text && <p className="break-words">{message.text}</p>}
            </div>
          </div>
        ))}
      </div>
      <MessageInput />

      {previewImage && (
        <ImagePreviewModal
          imageUrl={previewImage.url}
          message={previewImage.text}
          onClose={() => setPreviewImage(null)}
        />
      )}

      {previewVideo && (
        <VideoPreviewModal
          videoUrl={previewVideo.url}
          message={previewVideo.text}
          onClose={() => setPreviewVideo(null)}
        />
      )}
    </div>
  );
}

export default ChatContainer;
