import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";

const CommonOrder = () => {
  const [orders, setOrders] = useState([]);
  const [filterName, setFilterName] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axiosInstance.get("/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axiosInstance.put(`/orders/${orderId}`, { status: newStatus });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      alert("✅ Order status updated!");
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("❌ Failed to update order status");
    }
  };

  const handleDownload = (url, name = "user_uploaded_image.jpg") => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = url;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/jpeg");
      link.download = name;
      link.click();
    };

    img.onerror = () => {
      alert("❌ Failed to download image. Check image URL or CORS settings.");
    };
  };

  const filteredOrders = orders.filter((order) =>
    (order.deliveryDetails?.name || "")
      .toLowerCase()
      .includes(filterName.toLowerCase())
  );

  return (
    <div className="p-6 min-h-screen bg-gray-50 font-[Poppins]">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Common Orders
      </h2>

      {/* 🔍 Filter by Name */}
      <div className="mb-6 max-w-md mx-auto">
        <input
          type="text"
          placeholder="Search by customer name..."
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center text-gray-500 text-lg mt-10">
          No orders found.
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredOrders.map((order) => {
            const imageUrl =
              order.cartItemId?.uploadedImageUrl || order.cartItemId?.image;

            return (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-md p-4 flex flex-col items-start"
              >
                {/* 📷 Image with Download */}
                <div className="w-full flex flex-col items-center mb-4">
                  {imageUrl ? (
                    <>
                      <img
                        src={imageUrl}
                        alt="Uploaded"
                        className="w-40 h-40 object-cover rounded border"
                      />
                      <button
                        onClick={() => handleDownload(imageUrl)}
                        className="mt-2 text-sm text-blue-600 hover:underline"
                      >
                        📥 Download Image
                      </button>
                    </>
                  ) : (
                    <div className="w-40 h-40 bg-gray-200 flex items-center justify-center rounded text-gray-500 text-sm">
                      No Image
                    </div>
                  )}
                </div>

                {/* ℹ️ Order Info */}
                <p>
                  <strong>User:</strong>{" "}
                  {order.deliveryDetails?.name || order.userId?.name || "N/A"} (
                  {order.userId?.email || "N/A"})
                </p>
                <p>
                  <strong>Product:</strong> {order.cartItemId?.title || "N/A"}
                </p>
                <p>
                  <strong>Size:</strong> {order.cartItemId?.size || "N/A"}
                </p>
                <p>
                  <strong>Price:</strong> ₹
                  {order.cartItemId?.totalAmount ?? "0"}
                </p>
                <p>
                  <strong>Phone:</strong>{" "}
                  {order.deliveryDetails?.phone || "N/A"}
                </p>
                <p>
                  <strong>Pincode:</strong>{" "}
                  {order.deliveryDetails?.pincode || "N/A"}
                </p>
                <p>
                  <strong>Address:</strong>{" "}
                  {order.deliveryDetails?.address || "N/A"}
                </p>

                {/* 📦 Status Dropdown */}
                <div className="mt-4 w-full">
                  <label className="block font-medium text-gray-700 mb-1">
                    Order Status
                  </label>
                  <select
                    value={order.status || "Pending"}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                    className="w-full px-3 py-2 border rounded bg-gray-50 disabled:cursor-not-allowed disabled:bg-gray-200"
                    disabled={order.status === "Delivered"}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                  {order.status === "Delivered" && (
                    <p className="text-green-600 text-sm mt-1">
                      ✅ Delivered (locked)
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CommonOrder;
