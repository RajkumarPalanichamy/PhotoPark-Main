import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Upload, X, Image, Eye } from "lucide-react";


const AcrylicLove = () => {
  const [photoData, setPhotoData] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileUpload = async (file) => {
    if (!file.type.match("image.*")) {
      alert("Please select a valid image");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/acryliccustomize/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      const imageUrl = res.data.imageUrl || res.data.uploadedImageUrl;

      setPhotoData({
        url: imageUrl,
        name: file.name,
        size: file.size,
        type: file.type,
      });

      alert("Image upload successful!");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Image upload failed. Please try again.");
    }
  };

  const handleChange = (e) => {
    if (e.target.files.length > 0) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleReplaceClick = () => {
    fileInputRef.current.click();
  };

  const handleRemovePhoto = () => {
    setPhotoData(null);
  };

  const handlePreviewClick = () => {
    if (!photoData) {
      alert("Please upload a photo first.");
      return;
    }
    navigate("/AcrylicLoveOrder", { state: { photoData } });
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleChange}
        accept="image/*"
        className="hidden"
      />

      <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Upload Area */}
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Upload Your Photo (Love)
            </h2>
            {!photoData ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragging
                    ? "border-pink-500 bg-pink-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="bg-gray-100 p-3 rounded-full">
                    <Image className="w-8 h-8 text-gray-500" />
                  </div>
                  <p className="text-base text-gray-700">
                    Drag and drop your photo here, or
                  </p>
                  <button
                    onClick={handleReplaceClick}
                    className="inline-flex items-center px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 text-sm font-medium"
                  >
                    Browse Image
                  </button>
                  <p className="text-sm text-gray-500">
                    PNG, JPG, JPEG up to 5MB
                  </p>
                </div>
              </div>
            ) : (
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center">
                    <div className="bg-pink-100 p-1.5 rounded-md">
                      <Image className="w-5 h-5 text-pink-600" />
                    </div>
                    <div className="ml-3 truncate">
                      <p className="text-sm font-medium text-gray-900 truncate w-60">
                        {photoData.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(photoData.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleRemovePhoto}
                    className="p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="relative aspect-square bg-gray-50 rounded-md overflow-hidden border border-gray-200">
                  <img
                    src={photoData.url}
                    alt="Uploaded preview"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="mt-3">
                  <button
                    onClick={handleReplaceClick}
                    className="w-full py-2 px-4 bg-gray-800 text-white text-sm font-medium rounded-md hover:bg-gray-700 flex items-center justify-center"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Replace Photo
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Heart Preview */}
          <div className="flex-1 flex flex-col items-center">
            <div className="flex justify-between w-full mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Acrylic Preview (Love)
              </h2>
              <button
                onClick={handlePreviewClick}
                disabled={!photoData}
                className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  photoData
                    ? "bg-pink-500 text-white hover:bg-pink-600"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                <Eye size={22} className="mr-2" />
                Preview
              </button>
            </div>
            <div className="heart-frame-container">
              <div className="heart-border"></div>
              <div className="heart-frame">
                {photoData && (
                  <img
                    src={photoData.url}
                    alt="Heart Preview"
                    className="heart-photo"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcrylicLove;
