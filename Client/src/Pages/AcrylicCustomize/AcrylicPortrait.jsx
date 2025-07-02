
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Upload, X, Image, Eye, RotateCw, ZoomIn, ZoomOut } from "lucide-react";

const AcrylicPortrait = () => {
  const [photoData, setPhotoData] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startDrag, setStartDrag] = useState(null);
  const [scale, setScale] = useState(1);
  const [lastTouchDistance, setLastTouchDistance] = useState(null);
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
      setPosition({ x: 0, y: 0 });
      setScale(1);
      alert("Image upload successful!");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Image upload failed. Please try again.");
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    setStartDrag({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!startDrag) return;
    const deltaX = e.clientX - startDrag.x;
    const deltaY = e.clientY - startDrag.y;
    setStartDrag({ x: e.clientX, y: e.clientY });
    setPosition((prev) => ({
      x: prev.x + deltaX,
      y: prev.y + deltaY,
    }));
  };

  const handleMouseUp = () => setStartDrag(null);

  const getTouchDistance = (touches) => {
    const [a, b] = touches;
    const dx = a.clientX - b.clientX;
    const dy = a.clientY - b.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setStartDrag({ x: touch.clientX, y: touch.clientY });
    } else if (e.touches.length === 2) {
      setLastTouchDistance(getTouchDistance(e.touches));
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 1 && startDrag) {
      const touch = e.touches[0];
      const deltaX = touch.clientX - startDrag.x;
      const deltaY = touch.clientY - startDrag.y;
      setStartDrag({ x: touch.clientX, y: touch.clientY });
      setPosition((prev) => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY,
      }));
    } else if (e.touches.length === 2) {
      const newDistance = getTouchDistance(e.touches);
      if (lastTouchDistance) {
        const delta = newDistance - lastTouchDistance;
        setScale((prev) => {
          const newScale = Math.min(3, Math.max(0.5, prev + delta * 0.005));
          return parseFloat(newScale.toFixed(2));
        });
      }
      setLastTouchDistance(newDistance);
    }
  };

  const handleTouchEnd = () => {
    setStartDrag(null);
    setLastTouchDistance(null);
  };

  const handleWheelZoom = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale((prev) => {
      const newScale = Math.min(3, Math.max(0.5, prev + delta));
      return parseFloat(newScale.toFixed(2));
    });
  };

  const handleDoubleClick = () => {
    setPosition({ x: 0, y: 0 });
    setScale(1);
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(3, parseFloat((prev + 0.1).toFixed(2))));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(0.5, parseFloat((prev - 0.1).toFixed(2))));
  };

  const handleReplaceClick = () => fileInputRef.current.click();

  const handleRemovePhoto = () => {
    setPhotoData(null);
    setPosition({ x: 0, y: 0 });
    setScale(1);
  };

  const handlePreviewClick = () => {
    if (!photoData) {
      alert("Please upload a photo first.");
      return;
    }
    navigate("/AcrylicPortraitOrder", {
      state: {
        photoData,
        position,
        scale,
      },
    });
  };

  const resetPosition = () => {
    setPosition({ x: 0, y: 0 });
    setScale(1);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 overflow-x-hidden">
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) =>
          e.target.files.length > 0 && handleFileUpload(e.target.files[0])
        }
        accept="image/*"
        className="hidden"
      />

      <div className="bg-white rounded-lg shadow-xl overflow-hidden p-6 sm:p-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Upload Section */}
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Upload Your Photo (Portrait)
            </h2>
            {!photoData ? (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  e.dataTransfer.files.length > 0 &&
                    handleFileUpload(e.dataTransfer.files[0]);
                }}
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
                    className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm font-medium"
                  >
                    Browse Image
                  </button>
                  <p className="text-sm text-gray-500">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>
              </div>
            ) : (
              <div className="border rounded-lg p-4 bg-white">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-1.5 rounded-md">
                      <Image className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="ml-3 break-words max-w-[180px]">
                      <p className="text-sm font-medium text-gray-900">
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

                <div className="relative w-full max-h-[400px] flex justify-center items-center bg-gray-50 rounded-md overflow-hidden border border-gray-200">
                  <img
                    src={photoData.url}
                    alt="Uploaded preview"
                    className="max-w-full max-h-[380px] object-contain"
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

          {/* Frame Preview */}
          <div className="flex-1 min-w-0 mt-8 md:mt-0">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Acrylic Preview (Portrait)
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
                <Eye size={18} className="mr-2" />
                Preview
              </button>
            </div>

            <div
              className="relative w-full max-w-[300px] aspect-[3/4] mx-auto rounded-xl border-[6px] border-gray-300 shadow-inner bg-white overflow-hidden cursor-grab"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onWheel={handleWheelZoom}
              onDoubleClick={handleDoubleClick}
            >
              {photoData ? (
                <>
                  <img
                    src={photoData.url}
                    alt="Portrait Preview"
                    style={{
                      transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                      transition: startDrag ? "none" : "transform 0.3s ease",
                      transformOrigin: "center center",
                    }}
                    className="absolute top-0 left-0 w-full h-full object-cover select-none"
                    draggable={false}
                  />
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                    Drag & Zoom
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 text-center px-4">
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

            {photoData && (
              <div className="flex justify-center gap-3 mt-4">
                <button
                  onClick={handleZoomOut}
                  className="flex items-center px-3 py-1.5 text-sm border rounded-md border-gray-300 hover:border-black hover:text-black text-gray-600"
                >
                  <ZoomOut className="w-4 h-4 mr-1" />
                  Zoom Out
                </button>
                <button
                  onClick={handleZoomIn}
                  className="flex items-center px-3 py-1.5 text-sm border rounded-md border-gray-300 hover:border-black hover:text-black text-gray-600"
                >
                  <ZoomIn className="w-4 h-4 mr-1" />
                  Zoom In
                </button>
                <button
                  onClick={resetPosition}
                  className="flex items-center px-3 py-1.5 text-sm border rounded-md border-gray-300 hover:border-black hover:text-black text-gray-600"
                >
                  <RotateCw className="w-4 h-4 mr-1" />
                  Reset
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcrylicPortrait;
