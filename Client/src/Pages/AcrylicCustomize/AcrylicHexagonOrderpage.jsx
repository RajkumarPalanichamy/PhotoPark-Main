import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import axios from "axios";

const AcrylicHexagonOrderPage = () => {
  const location = useLocation();
  const { photoData } = location.state || {};

  const [product, setProduct] = useState({
    title: "Hexagon Acrylic Customize",
    sizes: [
      { label: "8x8", price: 499, original: 699 },
      { label: "12x12", price: 699, original: 899 },
      { label: "16x16", price: 899, original: 1199 },
      { label: "17x17", price: 999, original: 1199 },
    ],
    thickness: ["3mm", "5mm", "8mm"],
    highlights: [
      "Premium quality acrylic",
      "Edge-to-edge printing",
      "Glossy finish",
      "Perfect for gifts & decor",
    ],
  });

  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedThickness, setSelectedThickness] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [userId, setUserId] = useState(null);
  const [pincode, setPincode] = useState("");
  const [deliveryStatus, setDeliveryStatus] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserId(parsedUser._id);
      } catch (err) {
        console.error("Failed to parse user:", err);
      }
    }

    if (product.sizes?.length > 0) setSelectedSize(product.sizes[0]);
    if (product.thickness?.length > 0)
      setSelectedThickness(product.thickness[0]);
  }, [product]);

  const checkDelivery = () => {
    if (!/^\d{6}$/.test(pincode)) {
      setError("Please enter a valid 6-digit pincode.");
      setDeliveryStatus(null);
      return;
    }

    setError("");
    const serviceablePincodes = [
      "600001",
      "110001",
      "560001",
      "994077",
      "638459",
    ];
    setDeliveryStatus(
      serviceablePincodes.includes(pincode) ? "Available" : "Unavailable"
    );
  };

  const handleAddToCart = async () => {
    if (!selectedSize || !selectedThickness) {
      alert("Please select size and thickness.");
      return;
    }

    if (quantity < 1) {
      alert("Quantity must be at least 1.");
      return;
    }

    if (!userId) {
      alert("You must be logged in.");
      return;
    }

    setLoading(true);

    try {
      const cartData = {
        userId,
        productType: "AcrylicCustomizedata",
        title: product.title,
        image: photoData?.url,
        size: selectedSize.label,
        thickness: selectedThickness,
        price: selectedSize.price,
        quantity,
        totalAmount: selectedSize.price * quantity,
        uploadedImageUrl: photoData?.url,
      };

      // ✅ Include productId only if it exists
      if (photoData?.productId) {
        cartData.productId = photoData.productId;
      }
      console.log("Cart Payload:", cartData);
      await axios.post("http://localhost:5000/api/cart", cartData);

      alert("✅ Item added to cart successfully!");
    } catch (error) {
      console.error("Add to cart failed", error);
      alert("❌ Failed to add to cart.");
    } finally {
      setLoading(false);
    }
  };

  if (!photoData) {
    return (
      <div className="p-8 text-center text-lg text-red-600">
        ❌ No image found. Please upload again.
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
        {/* Image Preview */}
        <div className="space-y-6">
          <label className="block text-2xl border font-semibold text-gray-700 text-center mb-3">
            <p>Your Custom Photo</p>
            <p>Preview from Uploaded Design</p>
          </label>
          <div className="hexagon-frame rounded-lg shadow-md overflow-hidden border border-gray-200  ">
            <img
              src={photoData?.url}
              alt={photoData?.name || "Uploaded"}
              className="w-full h-auto object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/fallback.jpg";
              }}
            />
          </div>
        </div>

        {/* Size, Thickness, Quantity */}
        <div className="space-y-6 border p-5 h-130">
          <h2 className="text-3xl font-extrabold tracking-tight">
            {product.title}
          </h2>

          <p className="text-3xl font-bold text-red-600">
            ₹{selectedSize?.price || "0"}
            {selectedSize?.original && (
              <>
                <span className="line-through text-gray-400 ml-3 text-lg">
                  ₹{selectedSize.original}
                </span>
                <span className="ml-3 text-green-600 font-semibold">
                  Free Shipping
                </span>
              </>
            )}
          </p>

          {/* Size Selection */}
          <div>
            <label className="block text-xl font-semibold mb-2">
              Select Size
            </label>
            <div className="flex flex-wrap gap-3">
              {product.sizes.map((size, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 rounded-md border text-sm font-semibold ${
                    selectedSize?.label === size.label
                      ? "bg-black text-white border-black"
                      : "bg-white text-black border-gray-300 hover:border-black"
                  }`}
                >
                  <div>{size.label}</div>
                  <div className="text-xs text-gray-500">₹{size.price}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Thickness Selection */}
          <div>
            <label className="block text-xl font-semibold mb-2">
              Select Thickness
            </label>
            <div className="flex flex-wrap gap-3">
              {product.thickness.map((thick, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedThickness(thick)}
                  className={`border px-5 py-2 rounded-md text-sm font-medium ${
                    selectedThickness === thick
                      ? "bg-black text-white border-black"
                      : "bg-white text-black border-gray-300 hover:border-black"
                  }`}
                >
                  {thick}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity + Add to Cart */}
          <div className="flex items-center gap-5 mt-6">
            <label className="font-semibold text-lg">Qty:</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-20 border px-3 py-2 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <button
              onClick={handleAddToCart}
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-md flex items-center gap-2 font-semibold disabled:opacity-50"
            >
              <FaShoppingCart size={20} />
              {loading ? "Adding..." : "Add to Cart"}
            </button>
          </div>
        </div>

        {/* Highlights + Delivery Check */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-lg space-y-6">
          <div>
            <h4 className="text-lg font-semibold text-center mb-3">
              HIGHLIGHTS
            </h4>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              {product.highlights.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="bg-gray-100 border border-gray-300 p-4 rounded-lg mt-6">
            <p className="font-semibold mb-3 text-gray-900">
              Check Delivery At Your Location
            </p>
            <div className="flex">
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Enter Pincode"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={checkDelivery}
                className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-r-md font-semibold"
              >
                Check
              </button>
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            {deliveryStatus === "Available" && (
              <p className="text-green-600 font-semibold mt-2">
                🎉 Delivery is available in your area!
              </p>
            )}
            {deliveryStatus === "Unavailable" && (
              <p className="text-red-600 font-semibold mt-2">
                ❌ Sorry, delivery is not available in this pincode.
              </p>
            )}
            <p className="text-xs mt-3 text-gray-600 italic">
              *Delivery available across India
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcrylicHexagonOrderPage;
