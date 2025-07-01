
// Updated with extra-ordinary UI styles
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Frames = () => {
  const [frames, setFrames] = useState([]);
  const [selectedShape, setSelectedShape] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedFrameImage, setSelectedFrameImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [userImage, setUserImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/framecustomize")
      .then((res) => {
        setFrames(res.data.map((f) => f.shapeData));
      })
      .catch((err) => console.error("Error loading frames:", err));
  }, []);

  const handleAddToCart = async () => {
    if (!userImage || !selectedShape || !selectedColor || !selectedSize || !selectedFrameImage) {
      alert("Please complete all selections and upload image.");
      return;
    }

    const formData = new FormData();
    formData.append("productType", "FrameCustomizedata");
    formData.append("title", selectedFrameImage.title);
    formData.append("size", selectedSize.label);
    formData.append("price", selectedSize.amount);
    formData.append("quantity", quantity);
    formData.append("totalAmount", selectedSize.amount * quantity);
    formData.append("uploadedImageUrl", userImage);

    try {
      await axios.post("http://localhost:5000/api/cart/add", formData);
      alert("Added to cart");
    } catch (err) {
      console.error("Add to cart failed", err);
    }
  };

  const handleBuyNow = () => {
    if (!userImage || !selectedShape || !selectedColor || !selectedSize || !selectedFrameImage) {
      alert("Please complete all selections and upload image.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result;

      const frameData = {
        shape: selectedShape.shape,
        color: selectedColor,
        size: selectedSize.label,
        price: selectedSize.amount,
        quantity,
        title: selectedFrameImage.title,
        frameImageUrl: `http://localhost:5000/${selectedFrameImage.imageUrl}`,
        userImageUrl: base64Image,
      };

      sessionStorage.setItem("checkoutFrameData", JSON.stringify(frameData));
      navigate("/frameCheckout");
    };

    reader.readAsDataURL(userImage);
  };

  const renderShape = () => {
    if (!userImage) return <p className="text-gray-500">Upload image</p>;

    const shapeName = selectedShape?.shape;
    const imageUrl = URL.createObjectURL(userImage);
    const borderColor = selectedColor || "#ccc";

    const shapeClasses = {
      Hexagon: "mask-hexagon",
      Portrait: "mask-portrait",
      Landscape: "mask-landscape",
      Square: "mask-square",
    };

    return (
      <div className="mx-auto w-80 h-80 flex items-center justify-center">
        <div
          className={`w-full h-full p-2 rounded-2xl border-[10px] shadow-2xl bg-white flex items-center justify-center transition-transform duration-300 hover:scale-105 ${shapeClasses[shapeName]}`}
          style={{ borderColor: borderColor, borderStyle: "solid" }}
        >
          <img
            src={imageUrl}
            alt="Uploaded"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-pink-100 p-6">
      <div className="text-4xl font-extrabold text-center mb-12 text-purple-800 drop-shadow-xl">
        🎨 Frame Customizer
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-7xl mx-auto">
        {/* Preview */}
        <div className="bg-white p-8 rounded-3xl shadow-2xl border border-purple-200">
          <h2 className="text-2xl font-bold text-center text-purple-700 mb-6">
            🖼️ Live Frame Preview
          </h2>
          {renderShape()}

          <div className="mt-6">
            <label className="block text-lg font-medium mb-2 text-gray-800">
              📤 Upload or Replace Your Photo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setUserImage(e.target.files[0])}
              className="w-full px-4 py-2 border rounded-lg"
            />
            {userImage && (
              <div className="mt-2 text-sm text-gray-600">
                ✅ Image uploaded successfully.
                <br />
                <button
                  onClick={() => setUserImage(null)}
                  className="text-red-600 underline text-sm mt-1"
                >
                  ❌ Remove
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white p-6 rounded-3xl shadow-xl border border-blue-200">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">
            🛠 Customize Options
          </h2>

          {/* Shape */}
          <label className="font-medium">Select Shape</label>
          <select
            value={selectedShape?.shape || ""}
            onChange={(e) => {
              const shape = frames.find((f) => f.shape === e.target.value);
              setSelectedShape(shape);
              setSelectedColor("");
              setSelectedSize("");
              setSelectedFrameImage(null);
            }}
            className="block border w-full p-2 mb-4 rounded-lg"
          >
            <option value="">-- Choose Shape --</option>
            {frames.map((f, i) => (
              <option key={i} value={f.shape}>
                {f.shape}
              </option>
            ))}
          </select>

          {/* Color */}
          {selectedShape && (
            <>
              <label className="font-medium">Select Color</label>
              <select
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="block border w-full p-2 mb-4 rounded-lg"
              >
                <option value="">-- Choose Color --</option>
                {selectedShape.colorOptions.map((c, i) => (
                  <option key={i} value={c.color}>
                    {c.color}
                  </option>
                ))}
              </select>
            </>
          )}

          {/* Frame and Size */}
          {selectedColor &&
            selectedShape.colorOptions
              .find((c) => c.color === selectedColor)
              ?.frameImages.map((frame, i) => (
                <div key={i} className="border p-3 mb-3 rounded-lg bg-gray-50">
                  <p className="font-semibold text-lg">{frame.title}</p>
                  <img
                    src={`http://localhost:5000/${frame.imageUrl}`}
                    alt={frame.title}
                    className="w-full h-32 object-cover rounded mb-2 border"
                  />
                  <label>Choose Size:</label>
                  <select
                    className="w-full border p-2 rounded"
                    onChange={(e) => {
                      const selected = frame.sizes.find(
                        (s) => s.label === e.target.value
                      );
                      setSelectedSize(selected);
                      setSelectedFrameImage(frame);
                    }}
                  >
                    <option value="">-- Select --</option>
                    {frame.sizes.map((size, j) => (
                      <option key={j} value={size.label}>
                        {size.label} - ₹{size.amount}
                      </option>
                    ))}
                  </select>
                </div>
              ))}

          {/* Quantity */}
          {selectedSize && (
            <div className="mt-4">
              <label className="font-medium">Quantity:</label>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="border mt-2 p-2 w-full rounded-lg"
              />
            </div>
          )}

          {/* Summary */}
          {selectedShape && selectedColor && selectedFrameImage && selectedSize && (
            <div className="mt-8 p-5 bg-yellow-50 rounded-xl border shadow text-lg space-y-2">
              <h3 className="text-xl font-bold text-center text-yellow-800">
                🧾 Order Summary
              </h3>
              <p><strong>Shape:</strong> {selectedShape.shape}</p>
              <p><strong>Color:</strong> {selectedColor}</p>
              <p><strong>Frame:</strong> {selectedFrameImage.title}</p>
              <p><strong>Size:</strong> {selectedSize.label}</p>
              <p><strong>Price:</strong> ₹{selectedSize.amount}</p>
              <p><strong>Quantity:</strong> {quantity}</p>
              <p className="text-green-700 font-bold">
                Total: ₹{selectedSize.amount * quantity}
              </p>
            </div>
          )}

          {/* Actions */}
          {selectedSize && (
            <div className="flex gap-4 mt-6 justify-center">
              <button
                onClick={handleAddToCart}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700"
              >
                🛒 Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700"
              >
                💳 Buy Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Frames;
