import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { createPaymentOrder, initializePayment } from "../../utils/paymentUtils";

const CommonCheckout = () => {
  const { id: cartItemId } = useParams();
  const navigate = useNavigate(); // ✅ Initialize navigate
  console.log("🟡 Checkout param ID:", cartItemId);

  const [cartItem, setCartItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    pincode: "",
  });

  useEffect(() => {
    const fetchCartItem = async () => {
      try {
        const { data } = await axiosInstance.get(`/cart/${cartItemId}`);
        setCartItem(data);
      } catch (error) {
        console.error("Error fetching cart item:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCartItem();
  }, [cartItemId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const phoneRegex = /^[6-9]\d{9}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const pincodeRegex = /^\d{6}$/;

    if (!form.name.trim()) {
      alert("Please enter your full name");
      return false;
    }

    if (!phoneRegex.test(form.phone)) {
      alert("Please enter a valid 10-digit Indian mobile number");
      return false;
    }

    if (!emailRegex.test(form.email)) {
      alert("Please enter a valid email address");
      return false;
    }

    if (!form.address.trim()) {
      alert("Please enter your delivery address");
      return false;
    }

    if (!pincodeRegex.test(form.pincode)) {
      alert("Please enter a valid 6-digit pincode");
      return false;
    }

    return true;
  };

  const handlePayment = async () => {
    if (!validateForm()) return;

    setPaymentLoading(true);
    
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        alert("Please log in to proceed");
        navigate("/login");
        return;
      }

      // Calculate total amount
      const totalAmount = cartItem.totalAmount || cartItem.price || 0;

      // Create payment order
      const paymentData = {
        amount: totalAmount,
        cartItemId: cartItem._id,
        productType: cartItem.productType || "custom",
        deliveryDetails: form,
      };

      const orderData = await createPaymentOrder(paymentData);

      // Initialize Razorpay payment
      await initializePayment(orderData, form);

      // Payment successful - redirect to success page
      alert("✅ Payment successful! Your order has been placed.");
      navigate("/orders"); // or wherever you want to redirect after successful payment
      
    } catch (error) {
      console.error("Payment failed:", error);
      alert("❌ Payment failed. Please try again.");
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!cartItem) return <div className="p-8 text-center">Item not found</div>;

  const product = cartItem.productId || {};

  return (
    <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-2 gap-10">
      {/* Left: Product Details */}
      <div className="bg-white p-6 rounded shadow space-y-4">
        <img
          src={cartItem.uploadedImageUrl || cartItem.image || product.image}
          alt="Product"
          className="w-full h-80 object-contain border rounded"
        />
        <h2 className="text-2xl font-bold">{cartItem.title}</h2>
        <p>Size: {cartItem.size}</p>
        <p>Thickness: {cartItem.thickness}</p>
        <p>Quantity: {cartItem.quantity}</p>
        <p className="text-xl font-semibold text-green-600">
          Total: ₹{cartItem.totalAmount}
        </p>
      </div>

      {/* Right: User Form */}
      <div className="bg-white p-6 rounded shadow space-y-4">
        <h3 className="text-xl font-semibold mb-2">Delivery Information</h3>

        <input
          name="name"
          placeholder="Full Name *"
          value={form.name}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border rounded"
          required
        />

        <input
          name="email"
          placeholder="Email *"
          type="email"
          value={form.email}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border rounded"
          required
        />

        <div className="flex">
          <span className="px-4 py-2 bg-gray-100 border border-r-0 rounded-l">
            +91
          </span>
          <input
            name="phone"
            placeholder="Phone Number *"
            type="tel"
            value={form.phone}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-l-0 rounded-r"
            required
          />
        </div>

        <textarea
          name="address"
          placeholder="Delivery Address *"
          rows={3}
          value={form.address}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border rounded"
          required
        />

        <input
          name="pincode"
          placeholder="Pincode *"
          value={form.pincode}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border rounded"
          required
        />

        <button
          onClick={handlePayment}
          disabled={paymentLoading}
          className={`w-full py-3 rounded text-lg font-bold ${
            paymentLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          } text-white`}
        >
          {paymentLoading ? "Processing Payment..." : "Pay Now"}
        </button>
      </div>
    </div>
  );
};

export default CommonCheckout;
