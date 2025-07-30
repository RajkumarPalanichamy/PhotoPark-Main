import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, loading, removeFromCart, clearCart, fetchCartData } = useCart();

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

    fetchCartData();
  }, [navigate, fetchCartData]);

  const handleRemove = async (itemId) => {
    const result = await removeFromCart(itemId);
    if (!result.success) {
      console.error("Error removing item:", result.error);
    }
  };

  const handleClearCart = async () => {
    const result = await clearCart();
    if (!result.success) {
      console.error("Error clearing cart:", result.error);
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

  // Process cart items for display
  const processedItems = (cartItems || []).map((item) => {
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

  const sortedItems = processedItems.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const grouped = {};
  sortedItems.forEach((item) => {
    const dateKey = new Date(item.createdAt).toISOString().split("T")[0];
    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push(item);
  });

  const total = sortedItems.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold mb-6">Your Cart</h2>

        {Object.keys(grouped).length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-2xl font-semibold text-gray-600 mb-4">
              Your cart is empty
            </h3>
            <p className="text-gray-500 mb-8">
              Start shopping to add items to your cart
            </p>
            <Link
              to="/shop/acrylic"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            {Object.entries(grouped).map(([date, items]) => (
              <div key={date} className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  {formatDate(date)}
                </h3>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item._id}
                      className="bg-white rounded-lg shadow-md p-4 sm:p-6"
                    >
                      <div className="flex flex-col sm:flex-row gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg"
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
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="mt-8 text-right border-t pt-6">
              <h3 className="text-2xl font-semibold">Total: ₹{total}</h3>
              <button
                onClick={handleClearCart}
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
