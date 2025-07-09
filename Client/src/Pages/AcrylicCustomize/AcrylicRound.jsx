import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Upload, X, Image, Eye } from "lucide-react";

const AcrylicRound = () => {
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
    navigate("/AcrylicRoundOrder", { state: { photoData } });
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleChange}
        accept="image/*"
        className="hidden"
      />

      <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Upload Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Upload Your Photo (Round)
            </h2>
            {!photoData ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragging
                    ? "border-blue-500 bg-blue-50"
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
                    className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm font-medium"
                  >
                    Browse Image
                  </button>
                  <p className="text-sm text-gray-500">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>
              </div>
            ) : (
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-1.5 rounded-md">
                      <Image className="w-5 h-5 text-blue-600" />
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

          {/* Round Frame Preview */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Acrylic Preview (Round)
              </h2>
              <button
                onClick={handlePreviewClick}
                disabled={!photoData}
                className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  photoData
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                <Eye size={18} className="mr-2" /> Preview
              </button>
            </div>

            <div className="flex justify-center">
              <div className="rounded-full border-4 border-gray-300 w-60 h-60 sm:w-72 sm:h-72 md:w-80 md:h-80 overflow-hidden shadow-inner bg-white">
                {photoData ? (
                  <img
                    src={photoData.url}
                    alt="Round Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                    <p className="mb-2">No image selected</p>
                    <button
                      onClick={handleReplaceClick}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                      Upload Photo
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcrylicRound;
