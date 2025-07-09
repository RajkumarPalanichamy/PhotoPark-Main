import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import {
  createPaymentOrder,
  initializePayment,
} from "../../utils/paymentUtils";

const Framescheckout = () => {
  const [checkoutData, setCheckoutData] = useState(null);
  const [userId, setUserId] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("checkoutFrameData");

    if (stored) {
      const parsedData = JSON.parse(stored);
      console.log("✅ checkoutFrameData from sessionStorage:", parsedData);
      setCheckoutData(parsedData);
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
    shape = "",
    color = "",
    size = "",
    price = 0,
    quantity = 1,
    title = "",
    frameImageUrl = "",
    userImageUrl = "",
  } = checkoutData || {};

  const validateForm = () => {
    const phoneRegex = /^[6-9]\d{9}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    const pincodeRegex = /^\d{6}$/;

    if (!fullName.trim()) {
      alert("👤 Full name is required.");
      return false;
    }

    if (!phoneRegex.test(phone)) {
      alert("📱 Enter a valid 10-digit Indian mobile number.");
      return false;
    }

    if (!emailRegex.test(email)) {
      alert("📧 Only Gmail addresses are accepted (e.g., example@gmail.com).");
      return false;
    }

    if (!address.trim()) {
      alert("📦 Address is required.");
      return false;
    }

    if (!pincodeRegex.test(pincode)) {
      alert("📍 Enter a valid 6-digit area pincode.");
      return false;
    }

    return true;
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setPaymentLoading(true);
    const totalAmount = price * quantity;

    try {
      const paymentData = {
        amount: totalAmount,
        cartItemId: null,
        productType: "frame",
        deliveryDetails: {
          name: fullName,
          email,
          phone: `+91${phone}`,
          address,
          pincode,
        },
      };

      const orderPayload = {
        userId,
        shippingDetails: {
          fullName,
          phone: `+91${phone}`,
          email,
          address,
        },
        items: [
          {
            title,
            shape,
            color,
            size,
            quantity,
            price,
            total: quantity * price,
            frameImageUrl,
            userImageUrl,
          },
        ],
        status: "Pending",
      };

      console.log("📝 Creating payment with order:", orderPayload);

      const orderData = await createPaymentOrder(paymentData);
      
      // Pass orderPayload to initializePayment
      orderData.orderPayload = orderPayload;
      
      await initializePayment(orderData, {
        name: fullName,
        email,
        phone: `+91${phone}`,
        address,
      });

      // Order will be created in payment success handler
      alert("✅ Payment successful! Your frame order has been placed.");
      sessionStorage.removeItem("checkoutFrameData");
      setFullName("");
      setPhone("");
      setEmail("");
      setAddress("");
      setPincode("");
    } catch (error) {
      console.error("❌ Payment or Order saving failed:", error);
      alert("❌ Payment failed. Please try again.");
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Frame Preview */}
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

      {/* Shipping Form */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          📝 Shipping Details
        </h2>

        <form onSubmit={handlePayment} className="space-y-4">
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Full Name"
            className="w-full border p-2 rounded"
          />
          <div className="flex">
            <span className="px-4 py-2 bg-gray-100 border border-r-0 rounded-l">
              +91
            </span>
            <input
              type="tel"
              required
              pattern="[6-9]{1}[0-9]{9}"
              maxLength={10}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="10-digit Mobile Number"
              className="w-full px-4 py-2 border border-l-0 rounded-r"
            />
          </div>
          <input
            type="email"
            required
            pattern="^[a-zA-Z0-9._%+\-]+@gmail\.com$"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email (Gmail only)"
            className="w-full border p-2 rounded"
          />

          <textarea
            required
            rows={3}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Address"
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            required
            pattern="\d{6}"
            maxLength={6}
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            placeholder="Pincode"
            className="w-full border p-2 rounded"
          />

          <button
            type="submit"
            disabled={paymentLoading}
            className={`w-full py-2 rounded ${
              paymentLoading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            } text-white`}
          >
            {paymentLoading ? "Processing..." : "🛒 Pay Now"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Framescheckout;
