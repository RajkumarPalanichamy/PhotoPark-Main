// 📁 src/pages/admin/FrameCustomizeAdmin.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2, Plus } from "lucide-react";
import FrameForm from "./FrameForm";

const FrameCustomizeAdmin = () => {
  const [frames, setFrames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editFrame, setEditFrame] = useState(null);

  useEffect(() => {
    fetchFrames();
  }, []);

  const fetchFrames = async () => {
    try {
      const res = await axios.get("https://api.photoparkk.com/api/framecustomize");
      const onlyShapeData = res.data.map((item) => ({
        _id: item._id,
        shapeData: item.shapeData,
      }));
      setFrames(onlyShapeData);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteFrame = async (id) => {
    if (!window.confirm("Are you sure you want to delete this frame?")) return;
    try {
      await axios.delete(`https://api.photoparkk.com/api/framecustomize/${id}`);
      fetchFrames();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const ShapeGroup = ({ shapeData, id }) => (
    <div className="mb-10">
      <h2 className="text-xl font-bold mb-4">🧩 {shapeData.shape}</h2>
      {shapeData.colorOptions.map((color, colorIdx) => (
        <div key={colorIdx} className="border rounded-lg p-4 mb-4 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            🎨 Color: {color.color}
          </h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {color.frameImages.map((frame, idx) => (
              <div key={idx} className="bg-white rounded p-3 shadow">
                <img
                  src={`https://api.photoparkk.com/${frame.imageUrl}`}
                  alt={frame.title}
                  className="w-full h-32 object-cover rounded mb-2"
                />
                <p className="text-sm">
                  <strong>Title:</strong> {frame.title}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Sizes & Amounts:</strong>{" "}
                  {frame.sizes
                    .map((s) => `${s.label} - ₹${s.amount}`)
                    .join(", ")}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => {
            setEditFrame({ _id: id, shapeData });
            setShowForm(true);
          }}
          className="flex items-center px-3 py-1 border border-gray-400 text-sm rounded hover:bg-gray-100"
        >
          <Pencil className="w-4 h-4 mr-1" /> Edit
        </button>
        <button
          onClick={() => deleteFrame(id)}
          className="flex items-center px-3 py-1 border border-red-500 text-red-600 text-sm rounded hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4 mr-1" /> Delete
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-center underline">🖼️ FrameCustomize Admin</h1>
        <button
          onClick={() => {
            setEditFrame(null);
            setShowForm(true);
          }}
          className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-1" /> Add New
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        frames.map((item) => (
          <ShapeGroup key={item._id} id={item._id} shapeData={item.shapeData} />
        ))
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-3xl shadow-xl overflow-y-auto max-h-[90vh]">
            <p className="text-lg font-bold mb-4">
              {editFrame ? "Edit ShapeData" : "Add New ShapeData"}
            </p>
            <FrameForm
              initialData={
                editFrame
                  ? { ...editFrame.shapeData, _id: editFrame._id }
                  : null
              }
              onSuccess={fetchFrames}
              onClose={() => setShowForm(false)}
            />
            <button
              onClick={() => setShowForm(false)}
              className="mt-4 px-4 py-2 border border-gray-400 rounded hover:bg-gray-100"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FrameCustomizeAdmin;
