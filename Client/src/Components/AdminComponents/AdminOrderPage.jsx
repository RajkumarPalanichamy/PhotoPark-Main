
import React from "react";
import { Link } from "react-router-dom";

const AdminOrderPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Admin Order Panel
        </h1>

        <div className="flex flex-col gap-4">
          <Link
            to="/frameorder"
            className="w-full py-4 px-6 text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg text-center transition"
          >
            🖼️ Frame Orders
          </Link>

          <Link
            to="/CommonOrder"
            className="w-full py-4 px-6 text-lg font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg text-center transition"
          >
            🧾 Acrylic, Canvas, Backlight Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderPage;
