import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const Cart = () => {
  const [cartItemsByDate, setCartItemsByDate] = useState({});
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login");
      return;
    }

    let parsedUser;
    try {
      parsedUser = JSON.parse(user);
    } catch (err) {
      navigate("/login");
      return;
    }

    const fetchCart = async () => {
      try {
        const { data } = await axiosInstance.get(
          `/cart/user/${parsedUser._id}`
        );
        const items = (data || []).map((item) => {
          const product = item.productId || {};
          const unitPrice = item.price || 0;
          const quantity = item.quantity || 1;
          const totalPrice = unitPrice * quantity;

          return {
            _id: item._id,
            productId: product?._id || null,
            name: product?.title || item.title || "Custom Product",
            image: item.uploadedImageUrl || item.image || product?.image || "",
            size: item.size || "N/A",
            thickness: item.thickness || "N/A",
            price: unitPrice,
            quantity,
            totalPrice,
            productType: item.productType || "Unknown",
            createdAt: item.createdAt || new Date().toISOString(),
          };
        });

        const sortedItems = items.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        const grouped = {};
        sortedItems.forEach((item) => {
          const dateKey = new Date(item.createdAt).toISOString().split("T")[0];
          if (!grouped[dateKey]) grouped[dateKey] = [];
          grouped[dateKey].push(item);
        });

        setCartItemsByDate(grouped);
        setTotal(sortedItems.reduce((sum, item) => sum + item.totalPrice, 0));
      } catch (err) {
        console.error("Error fetching cart:", err);
        if (err.response?.status === 401) {
          localStorage.clear();
          navigate("/login");
        }
      }
    };

    fetchCart();
  }, [navigate]);

  const handleRemove = async (itemId) => {
    try {
      await axiosInstance.delete(`/cart/${itemId}`);
      const updated = { ...cartItemsByDate };
      for (const date in updated) {
        updated[date] = updated[date].filter((item) => item._id !== itemId);
        if (updated[date].length === 0) delete updated[date];
      }
      setCartItemsByDate(updated);
      const allItems = Object.values(updated).flat();
      setTotal(allItems.reduce((sum, i) => sum + i.totalPrice, 0));
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  const clearCart = async () => {
    try {
      const allItems = Object.values(cartItemsByDate).flat();
      await Promise.all(
        allItems.map((item) => axiosInstance.delete(`/cart/${item._id}`))
      );
      setCartItemsByDate({});
      setTotal(0);
    } catch (err) {
      console.error("Error clearing cart:", err);
    }
  };

  const getCheckoutLink = (item) => `/checkout/${item._id}`;
  const formatDate = (isoDate) =>
    new Date(isoDate).toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold mb-6">Your Cart</h2>

        {Object.keys(cartItemsByDate).length === 0 ? (
          <p className="text-xl text-gray-600">Your cart is empty</p>
        ) : (
          <>
            {Object.entries(cartItemsByDate).map(([dateKey, items]) => (
              <div key={dateKey} className="mb-10">
                <h3 className="text-2xl font-bold mb-4">
                  {formatDate(dateKey)}
                </h3>

                <div className="space-y-6">
                  {items.map((item) => (
                    <div
                      key={item._id}
                      className="flex flex-col sm:flex-row sm:items-start bg-white p-4 rounded-lg shadow relative"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full sm:w-32 sm:h-32 h-48 object-cover rounded-md mb-4 sm:mb-0 sm:mr-6"
                      />

                      <div className="flex-1 text-left">
                        <h4 className="text-lg sm:text-xl font-semibold text-gray-800">
                          {item.name}
                        </h4>
                        <p className="text-sm sm:text-base text-gray-600 mt-1">
                          Size: {item.size}
                        </p>
                        <p className="text-sm sm:text-base text-gray-600">
                          Thickness: {item.thickness}
                        </p>
                        <p className="text-sm sm:text-base text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                        <p className="text-sm sm:text-base text-gray-600">
                          Unit Price: ₹{item.price}
                        </p>
                        <p className="text-base sm:text-lg font-bold text-green-700 mt-1">
                          ₹{item.totalPrice}
                        </p>
                      </div>

                      {/* Buttons on right side */}
                      <div className="mt-4 sm:mt-10 sm:ml-6 flex flex-col gap-2 items-end">
                        <Link to={getCheckoutLink(item)}>
                          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm w-28">
                            Buy Now
                          </button>
                        </Link>
                        <button
                          onClick={() => handleRemove(item._id)}
                          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm w-28"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="mt-8 text-right border-t pt-6">
              <h3 className="text-2xl font-semibold">Total: ₹{total}</h3>
              <button
                onClick={clearCart}
                className="mt-4 bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-900"
              >
                Clear Cart
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
