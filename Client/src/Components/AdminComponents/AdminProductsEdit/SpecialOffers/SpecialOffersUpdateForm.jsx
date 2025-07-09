import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const SpecialoffersUpdateForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    rating: 1,
    thickness: "",
    stock: "",
    image: "",
    sizes: [{ label: "", price: "", original: "" }],
  });

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/specialoffers/${id}`
        );
        setFormData({
          ...res.data,
          sizes: res.data.sizes?.length
            ? res.data.sizes
            : [{ label: "", price: "", original: "" }],
        });
      } catch (error) {
        console.error("Failed to fetch product:", error);
        alert("Error loading product.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rating" ? parseInt(value) : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setFormData((prev) => ({
        ...prev,
        image: URL.createObjectURL(file),
      }));
    }
  };

  const handleSizeChange = (index, field, value) => {
    const updated = [...formData.sizes];
    updated[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      sizes: updated,
    }));
  };

  const addSizeField = () => {
    setFormData((prev) => ({
      ...prev,
      sizes: [...prev.sizes, { label: "", price: "", original: "" }],
    }));
  };

  const removeSizeField = (indexToRemove) => {
    if (formData.sizes.length === 1) return; // Prevent removing the last one
    const updated = formData.sizes.filter(
      (_, index) => index !== indexToRemove
    );
    setFormData((prev) => ({
      ...prev,
      sizes: updated,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const cleanedSizes = formData.sizes.map((size) => ({
        label: size.label.trim(),
        price: Number(size.price),
        original: Number(size.original),
      }));

      const data = new FormData();
      data.append("title", formData.title.trim());
      data.append("content", formData.content.trim());
      data.append("rating", Number(formData.rating));
      data.append("thickness", formData.thickness.trim());
      data.append("stock", formData.stock.trim());
      data.append("sizes", JSON.stringify(cleanedSizes));

      if (imageFile) {
        data.append("image", imageFile);
      }

      await axios.put(`http://localhost:5000/api/specialoffers/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Product updated successfully!");
      navigate("/adminproducts");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update product.");
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-xl">Loading...</div>;
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Update Special Offer
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Product Title"
          className="w-full border p-2 rounded"
          required
        />

        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder="Product Description"
          className="w-full border p-2 rounded"
          required
        />

        {/* Image Upload */}
        <div>
          <label className="block font-medium mb-1">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border p-2 rounded"
          />
          {formData.image && (
            <img
              src={formData.image}
              alt="Uploaded Preview"
              className="w-32 h-32 object-cover mt-2 rounded border"
            />
          )}
        </div>

        <select
          name="rating"
          value={formData.rating}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          {[1, 2, 3, 4, 5].map((r) => (
            <option key={r} value={r}>
              {`${r} Star${r > 1 ? "s" : ""}`}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="thickness"
          value={formData.thickness}
          onChange={handleChange}
          placeholder="Thickness"
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          placeholder="Stock Info"
          className="w-full border p-2 rounded"
        />

        {/* Sizes Section */}
        <div>
          <label className="font-semibold block mb-2">Sizes</label>
          {formData.sizes.map((size, index) => (
            <div
              key={index}
              className="grid grid-cols-4 gap-2 mb-2 items-center"
            >
              <input
                type="text"
                placeholder="Label"
                value={size.label}
                onChange={(e) =>
                  handleSizeChange(index, "label", e.target.value)
                }
                className="p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Price"
                value={size.price}
                onChange={(e) =>
                  handleSizeChange(index, "price", e.target.value)
                }
                className="p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Original"
                value={size.original}
                onChange={(e) =>
                  handleSizeChange(index, "original", e.target.value)
                }
                className="p-2 border rounded"
              />
              <button
                type="button"
                onClick={() => removeSizeField(index)}
                className="text-red-500 hover:underline text-sm"
                disabled={formData.sizes.length === 1}
                title="Remove"
              >
                ❌
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addSizeField}
            className="text-sm text-blue-600 mt-2 underline"
          >
            + Add Another Size
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Update Product
        </button>
      </form>
    </div>
  );
};

export default SpecialoffersUpdateForm;
