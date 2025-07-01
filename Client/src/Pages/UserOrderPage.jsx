import React, { useEffect, useState } from "react";
import axios from "axios";

const UserOrderPage = () => {
  const [frameOrders, setFrameOrders] = useState([]);
  const [commonOrders, setCommonOrders] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?._id) return;

    // Fetch Frame Orders
    axios
      .get(`http://localhost:5000/api/frameorders/user/${user._id}`)
      .then((res) => setFrameOrders(res.data))
      .catch((err) => console.error("Failed to fetch frame orders:", err));

    // Fetch Common Orders
    axios
      .get(`http://localhost:5000/api/orders/user/${user._id}`)
      .then((res) => setCommonOrders(res.data))
      .catch((err) => console.error("Failed to fetch common orders:", err));
  }, []);

  const getStatusClasses = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Shipped":
        return "bg-blue-100 text-blue-800";
      case "Out for Delivery":
        return "bg-orange-100 text-orange-800";
      case "Delivered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6 text-center">My Orders</h1>

      {/* FRAME ORDERS */}
      {frameOrders.length === 0 ? (
        <p className="text-center text-gray-500">
          You haven’t placed any Frame orders yet.
        </p>
      ) : (
        frameOrders.map((order) => (
          <div
            key={order._id}
            className="mb-8 p-5 rounded-xl border shadow-sm bg-white"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
              <span className="text-sm text-gray-500">
                Ordered on: {new Date(order.createdAt).toLocaleDateString()}
              </span>
              <span
                className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusClasses(
                  order.status
                )}`}
              >
                {order.status}
              </span>
            </div>

            <div className="mb-4 text-sm text-gray-700 leading-relaxed">
              <strong>Ship To:</strong> {order.shippingDetails.fullName},{" "}
              {order.shippingDetails.phone} <br />
              {order.shippingDetails.email} <br />
              {order.shippingDetails.address}
            </div>

            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col md:flex-row gap-4 border-t pt-4 mt-4"
              >
                <div className="flex flex-col items-center md:w-28 w-full">
                  <p className="text-xs text-gray-500 mb-1">
                    Your UploadedImage
                  </p>
                  <img
                    src={item.userImageUrl}
                    alt="User Upload"
                    className="w-24 h-24 object-cover rounded border"
                  />
                </div>

                <div className="flex flex-col items-center md:w-28 w-full">
                  <p className="text-xs text-gray-500 mb-1">Selected Frame</p>
                  <img
                    src={item.frameImageUrl}
                    alt="Frame"
                    className="w-24 h-24 object-cover rounded border"
                  />
                </div>

                <div className="flex-1">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-gray-600">
                    Shape: {item.shape} | Color: {item.color} | Size:{" "}
                    {item.size}
                  </p>
                  <p className="text-sm text-gray-600">
                    Quantity: {item.quantity} × ₹{item.price}
                  </p>
                </div>

                <div className="text-right font-semibold text-green-600 min-w-[70px]">
                  ₹{item.total}
                </div>
              </div>
            ))}
          </div>
        ))
      )}

      {/* COMMON ORDERS */}
      {commonOrders.length > 0 && (
        <>

          {commonOrders.map((order) => (
            <div
              key={order._id}
              className="mb-8 p-5 rounded-xl border shadow-sm bg-white"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
                <span className="text-sm text-gray-500">
                  Ordered on: {new Date(order.createdAt).toLocaleDateString()}
                </span>
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusClasses(
                    order.status
                  )}`}
                >
                  {order.status || "Pending"}
                </span>
              </div>

              <div className="mb-4 text-sm text-gray-700 leading-relaxed">
                <strong>Ship To:</strong> {order.deliveryDetails?.name},{" "}
                {order.deliveryDetails?.phone} <br />
                {order.deliveryDetails?.email} <br />
                {order.deliveryDetails?.address} <br />
                <strong>Pincode:</strong>{" "}
                {order.deliveryDetails?.pincode || "N/A"}
              </div>

              <div className="flex gap-6 items-center">
                <div className="w-24 h-24">
                  {order.cartItemId?.uploadedImageUrl ||
                  order.cartItemId?.image ? (
                    <img
                      src={
                        order.cartItemId?.uploadedImageUrl ||
                        order.cartItemId?.image
                      }
                      alt="Product"
                      className="w-24 h-24 object-cover border rounded"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gray-100 text-sm text-gray-500 flex items-center justify-center border rounded">
                      No Image
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <p className="font-medium">
                    {order.cartItemId?.title || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Size: {order.cartItemId?.size || "N/A"} | Quantity:{" "}
                    {order.cartItemId?.quantity || 1}
                  </p>
                  <p className="font-semibold text-green-600">
                    ₹{order.cartItemId?.totalAmount ?? 0}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default UserOrderPage;
