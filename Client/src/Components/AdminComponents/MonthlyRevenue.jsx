// MonthlyRevenueDashboard.jsx
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const revenueData = [
  { month: "Jan", revenue: 12000 },
  { month: "Feb", revenue: 15000 },
  { month: "Mar", revenue: 17000 },
  { month: "Apr", revenue: 14000 },
  { month: "May", revenue: 19000 },
  { month: "Jun", revenue: 22000 },
  { month: "Jul", revenue: 25000 },
  { month: "Aug", revenue: 21000 },
  { month: "Sep", revenue: 23000 },
  { month: "Oct", revenue: 24000 },
  { month: "Nov", revenue: 26000 },
  { month: "Dec", revenue: 28000 },
];

const MonthlyRevenueDashboard = () => {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Monthly Revenue Overview</h2>

      {/* Line Chart */}
      <div className="bg-white shadow-md rounded-xl p-4 mb-8">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueData}>
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#4f46e5"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Table */}
      <div className="bg-white shadow-md rounded-xl p-4">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border-b p-2">Month</th>
              <th className="border-b p-2">Revenue ($)</th>
            </tr>
          </thead>
          <tbody>
            {revenueData.map((item) => (
              <tr key={item.month}>
                <td className="p-2">{item.month}</td>
                <td className="p-2">${item.revenue.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MonthlyRevenueDashboard;
