import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const CommonCheckout = () => {
  const { id: cartItemId } = useParams();
  console.log("🟡 Checkout param ID:", cartItemId);

  const [cartItem, setCartItem] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const handleOrderSubmit = async () => {
    const { name, email, phone, address, pincode } = form;

    // Basic required validation
    if (!name || !email || !phone || !address || !pincode) {
      alert("Please fill out all required fields");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return alert("User not logged in");

    try {
      await axiosInstance.post(
        "/orders",
        {
          cartItemId: cartItem._id,
          productType: cartItem.productType,
          deliveryDetails: form,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      alert("✅ Order placed successfully!");
      // navigate("/thankyou"); // Optional redirect
    } catch (err) {
      console.error("❌ Order failed:", err);
      alert("Failed to place order");
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
          onClick={handleOrderSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white w-full py-3 rounded text-lg font-bold"
        >
          Confirm Order
        </button>
      </div>
    </div>
  );
};

export default CommonCheckout;
