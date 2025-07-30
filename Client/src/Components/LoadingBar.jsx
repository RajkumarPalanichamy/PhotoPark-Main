import React from "react";

const LoadingBar = ({ progress, isUploading, message = "Uploading..." }) => {
  if (!isUploading) return null;

  return (
    <div className="w-full p-4">
      <div className="mb-3">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>{message}</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      <div className="text-center text-gray-500 text-sm">
        Please wait while your image is being uploaded...
      </div>
    </div>
  );
};

export default LoadingBar; 