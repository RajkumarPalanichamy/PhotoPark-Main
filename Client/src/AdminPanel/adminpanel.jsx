import React from "react";
import { FaBox } from "react-icons/fa";
import { Link } from "react-router-dom";

const AdminPanel = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-700">
        Admin Dashboard
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/adminorderPage">
          <div className="flex flex-col items-center bg-blue-500 text-white p-6 sm:p-8 rounded-lg shadow-md hover:shadow-xl transition-transform transform hover:scale-105">
            <FaBox className="text-4xl mb-3" />
            <p className="text-lg font-semibold text-center">ORDERS</p>
          </div>
        </Link>

        <Link to="/adminproducts">
          <div className="flex flex-col items-center bg-green-500 text-white p-6 sm:p-8 rounded-lg shadow-md hover:shadow-xl transition-transform transform hover:scale-105">
            <FaBox className="text-4xl mb-3" />
            <p className="text-lg font-semibold text-center">PRODUCTS</p>
          </div>
        </Link>

        <Link to="/framecustomizeadmin">
          <div className="flex flex-col items-center bg-red-500 text-white p-6 sm:p-8 rounded-lg shadow-md hover:shadow-xl transition-transform transform hover:scale-105">
            <FaBox className="text-4xl mb-3" />
            <p className="text-lg font-semibold text-center">FRAMES</p>
          </div>
        </Link>

        <Link to="/monthlyrevenue">
          <div className="flex flex-col items-center bg-purple-500 text-white p-6 sm:p-8 rounded-lg shadow-md hover:shadow-xl transition-transform transform hover:scale-105">
            <FaBox className="text-4xl mb-3" />
            <p className="text-lg font-semibold text-center">REVENUES</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AdminPanel;
