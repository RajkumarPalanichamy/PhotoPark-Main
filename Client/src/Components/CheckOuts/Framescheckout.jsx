import React, { useEffect, useState } from "react";
import axios from "axios";

const Framescheckout = () => {
  const [checkoutData, setCheckoutData] = useState(null);
  const [userId, setUserId] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");

  useEffect(() => {
    const stored = sessionStorage.getItem("checkoutFrameData");
    if (stored) {
      setCheckoutData(JSON.parse(stored));
    }

    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user._id) {
      setUserId(user._id);
    }
  }, []);

  if (!userId) {
    return (
      <div className="text-center text-red-600 p-10 text-xl">
        ⚠️ Please log in to proceed with checkout.
      </div>
    );
  }

  if (!checkoutData)
    return <div className="text-center p-10 text-xl">No data found.</div>;

  const {
    shape,
    color,
    size,
    price,
    quantity,
    title,
    frameImageUrl,
    userImageUrl,
  } = checkoutData;

  const validateForm = () => {
    const phoneRegex = /^[6-9]\d{9}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    const pincodeRegex = /^\d{6}$/;

    if (!phoneRegex.test(phone)) {
      alert("📱 Enter a valid 10-digit Indian mobile number.");
      return false;
    }

    if (!emailRegex.test(email)) {
      alert("📧 Only Gmail addresses are accepted (e.g., example@gmail.com).");
      return false;
    }

    if (!pincodeRegex.test(pincode)) {
      alert("📍 Enter a valid 6-digit area pincode.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const orderPayload = {
      userId,
      items: [
        {
          title,
          frameImageUrl,
          userImageUrl,
          shape,
          color,
          size,
          price,
          quantity,
          total: price * quantity,
        },
      ],
      shippingDetails: {
        fullName,
        phone,
        email,
        address,
        pincode,
      },
    };

    try {
      await axios.post(
        "http://localhost:5000/api/frameorders/create",
        orderPayload
      );
      alert("✅ Order Placed!");
      sessionStorage.removeItem("checkoutFrameData");
      setFullName("");
      setPhone("");
      setEmail("");
      setAddress("");
      setPincode("");
    } catch (error) {
      console.error("Order placement failed", error);
      alert("❌ Failed to place order");
    }
  };

  return (
    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Left: Frame Preview */}
      <div className="bg-gray-100 p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">
          🖼️ Frame Preview
        </h2>
        <div className="mb-6 text-center">
          <div className="inline-block border-[10px] rounded-2xl border-gray-400 p-1">
            <img
              src={userImageUrl}
              alt="User"
              className="w-64 h-64 object-cover rounded-lg shadow"
            />
          </div>
        </div>

        <div className="space-y-2 text-lg">
          <p>
            <strong>Shape:</strong> {shape}
          </p>
          <p>
            <strong>Color:</strong> {color}
          </p>
          <p>
            <strong>Title:</strong> {title}
          </p>
          <p>
            <strong>Size:</strong> {size}
          </p>
          <p>
            <strong>Quantity:</strong> {quantity}
          </p>
          <p>
            <strong>Price per Unit:</strong> ₹{price}
          </p>
          <p className="text-xl font-semibold">
            <strong>Total:</strong> ₹{price * quantity}
          </p>
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">🖼️ Frame Design</h3>
          <img
            src={frameImageUrl}
            alt="Frame"
            className="w-full h-auto rounded border shadow"
          />
        </div>
      </div>

      {/* Right: Shipping Form */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          📝 Shipping Details
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Full Name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border p-2 rounded"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Phone Number</label>
            <div className="flex gap-2 items-center">
              <span className="px-3 py-2 bg-gray-200 border rounded text-sm">
                +91
              </span>
              <input
                type="tel"
                required
                pattern="[6-9]{1}[0-9]{9}"
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="flex-1 border p-2 rounded"
                placeholder="10-digit mobile number"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
              className="w-full border p-2 rounded"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Address</label>
            <textarea
              required
              rows={4}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border p-2 rounded"
              placeholder="Enter your full address"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Your Area Pincode</label>
            <input
              type="text"
              required
              pattern="\d{6}"
              maxLength={6}
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              className="w-full border p-2 rounded"
              placeholder="6-digit pincode"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            🛒 Place Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default Framescheckout;
