import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Upload, X, Image, Eye } from "lucide-react";
import LoadingBar from "../../Components/LoadingBar";
import { toast } from "react-toastify";


const AcrylicLove = () => {
  const [photoData, setPhotoData] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileUpload = async (file) => {
    if (!file.type.match("image.*")) {
      alert("Please select a valid image");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post(
        "/api/acryliccustomize/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        }
      );
      const imageUrl = res.data.imageUrl || res.data.uploadedImageUrl;

      setPhotoData({
        url: imageUrl,
        name: file.name,
        size: file.size,
        type: file.type,
      });
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Image upload failed. Please try again.");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
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
                 onDragOver={(e) => {
                   if (isUploading) return;
                   handleDragOver(e);
                 }}
                 onDragLeave={handleDragLeave}
                 onDrop={(e) => {
                   if (isUploading) return;
                   handleDrop(e);
                 }}
                 className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                   isUploading
                     ? "border-gray-200 bg-gray-50 cursor-not-allowed"
                     : isDragging
                     ? "border-pink-500 bg-pink-50"
                     : "border-gray-300 hover:border-gray-400"
                 }`}
               >
                                 <div className="flex flex-col items-center justify-center space-y-4">
                   {isUploading ? (
                     <>
                       <div className="bg-gray-100 p-3 rounded-full">
                         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
                       </div>
                       <p className="text-base text-gray-700">
                         Uploading your image...
                       </p>
                       <div className="w-full max-w-xs">
                         <div className="flex justify-between text-sm text-gray-600 mb-2">
                           <span>Progress</span>
                           <span>{uploadProgress}%</span>
                         </div>
                         <div className="w-full bg-gray-200 rounded-full h-2">
                           <div
                             className="bg-pink-500 h-2 rounded-full transition-all duration-300 ease-out"
                             style={{ width: `${uploadProgress}%` }}
                           ></div>
                         </div>
                       </div>
                     </>
                   ) : (
                     <>
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
                         PNG, JPG, JPEG up to 10MB
                       </p>
                     </>
                   )}
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
                   {isUploading ? (
                     <LoadingBar progress={uploadProgress} isUploading={isUploading} />
                   ) : (
                     <img
                       src={photoData.url}
                       alt="Uploaded preview"
                       className="w-full h-full object-contain"
                     />
                   )}
                 </div>
                <div className="mt-3">
                                     <button
                     onClick={handleReplaceClick}
                     disabled={isUploading}
                     className={`w-full py-2 px-4 text-sm font-medium rounded-md flex items-center justify-center ${
                       isUploading
                         ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                         : "bg-gray-800 text-white hover:bg-gray-700"
                     }`}
                   >
                     {isUploading ? (
                       <>
                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                         Uploading...
                       </>
                     ) : (
                       <>
                         <Upload className="w-4 h-4 mr-2" />
                         Replace Photo
                       </>
                     )}
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
