import React from "react";
import { Download, X } from "lucide-react";

const ImagePreviewModal = ({ imageUrl, message, onClose }) => {
  const handleDownload = () => {
    fetch(imageUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "connectify_messenger_image.jpg";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => console.error("Download failed:", error));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="relative max-w-[90%] max-h-[90%] flex flex-col">
        <div className="absolute -top-8 right-0 flex items-center space-x-2">
          <button
            onClick={handleDownload}
            className="text-white hover:text-gray-300 bg-white/20 hover:bg-white/30 p-1 rounded-full"
          >
            <Download size={20} />
          </button>
          <button onClick={onClose} className="text-white hover:text-gray-300">
            <X size={24} />
          </button>
        </div>

        <div className="relative">
          <img
            src={imageUrl}
            alt="Preview"
            className="max-w-full max-h-[70vh] object-contain rounded-lg"
          />
        </div>

        {message && (
          <div className="bg-black/50 text-white text-center p-4 mt-2 rounded-b-lg">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImagePreviewModal;
