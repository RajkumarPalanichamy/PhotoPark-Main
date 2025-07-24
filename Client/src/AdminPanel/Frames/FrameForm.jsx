
// 📁 src/components/admin/FrameForm.jsx
import React, { useState } from "react";
import axios from "axios";

const FrameForm = ({ initialData, onSuccess, onClose }) => {
  const [shape, setShape] = useState(initialData?.shape || "");
  const [colorOptions, setColorOptions] = useState(
    initialData?.colorOptions || [
      {
        color: "",
        frameImages: [
          {
            title: "",
            file: null,
            imageUrl: "",
            sizes: [{ label: "", amount: "" }],
          },
        ],
      },
    ]
  );
  const [userUploadedImage, setUserUploadedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleColorChange = (idx, field, value) => {
    const updated = [...colorOptions];
    updated[idx][field] = value;
    setColorOptions(updated);
  };

  const handleFrameImageChange = (colorIdx, imgIdx, field, value) => {
    const updated = [...colorOptions];
    updated[colorIdx].frameImages[imgIdx][field] = value;
    setColorOptions(updated);
  };

  const handleFileChange = (colorIdx, imgIdx, file) => {
    const updated = [...colorOptions];
    updated[colorIdx].frameImages[imgIdx].file = file;
    setColorOptions(updated);
  };

  const handleSizeChange = (colorIdx, imgIdx, sizeIdx, field, value) => {
    const updated = [...colorOptions];
    updated[colorIdx].frameImages[imgIdx].sizes[sizeIdx][field] = value;
    setColorOptions(updated);
  };

  const addSize = (colorIdx, imgIdx) => {
    const updated = [...colorOptions];
    updated[colorIdx].frameImages[imgIdx].sizes.push({ label: "", amount: "" });
    setColorOptions(updated);
  };

  const removeSize = (colorIdx, imgIdx, sizeIdx) => {
    const updated = [...colorOptions];
    if (updated[colorIdx].frameImages[imgIdx].sizes.length === 1) return; // Prevent removing last size
    updated[colorIdx].frameImages[imgIdx].sizes.splice(sizeIdx, 1);
    setColorOptions(updated);
  };

  const addColor = () => {
    setColorOptions([
      ...colorOptions,
      {
        color: "",
        frameImages: [
          {
            title: "",
            file: null,
            imageUrl: "",
            sizes: [{ label: "", amount: "" }],
          },
        ],
      },
    ]);
  };

  const removeColor = (colorIdx) => {
    const updated = [...colorOptions];
    updated.splice(colorIdx, 1);
    setColorOptions(updated);
  };

  const addFrameImage = (colorIdx) => {
    const updated = [...colorOptions];
    updated[colorIdx].frameImages.push({
      title: "",
      file: null,
      imageUrl: "",
      sizes: [{ label: "", amount: "" }],
    });
    setColorOptions(updated);
  };

  const removeFrameImage = (colorIdx, imgIdx) => {
    const updated = [...colorOptions];
    updated[colorIdx].frameImages.splice(imgIdx, 1);
    setColorOptions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("selectedShape", shape);
      formData.append("selectedColor", "Dummy");
      formData.append("selectedSize", "Dummy");
      formData.append("selectedFrameImage", "Dummy");
      formData.append("quantity", 1);

      if (userUploadedImage) {
        formData.append("userUploadedImage", userUploadedImage);
      } else {
        alert("Please upload a dummy user image");
        setLoading(false);
        return;
      }

      const shapeData = {
        shape,
        colorOptions: await Promise.all(
          colorOptions.map(async (color) => {
            const uploadedImages = await Promise.all(
              color.frameImages.map(async (img) => {
                if (img.file) {
                  const imageForm = new FormData();
                  imageForm.append("frameImage", img.file);
                  const res = await axios.post(
                    "https://api.photoparkk.com/api/framecustomize/upload-frame-image",
                    imageForm
                  );
                  return {
                    title: img.title,
                    imageUrl: res.data.url,
                    sizes: img.sizes,
                  };
                } else if (img.imageUrl) {
                  return {
                    title: img.title,
                    imageUrl: img.imageUrl,
                    sizes: img.sizes,
                  };
                } else {
                  throw new Error("All frame images must have a file or existing imageUrl");
                }
              })
            );
            return {
              color: color.color,
              frameImages: uploadedImages,
            };
          })
        ),
      };

      formData.append("shapeData", JSON.stringify(shapeData));

      if (initialData?._id) {
        await axios.put(
          `https://api.photoparkk.com/api/framecustomize/${initialData._id}`,
          formData
        );
      } else {
        await axios.post("https://api.photoparkk.com/api/framecustomize", formData);
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Submit error:", err);
      alert("Something went wrong. See console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="font-semibold">Shape</label>
        <input
          type="text"
          value={shape}
          onChange={(e) => setShape(e.target.value)}
          className="block w-full border px-3 py-2 rounded"
          required
        />
      </div>

      <div>
        <label className="font-semibold">Upload dummy user image (required)</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setUserUploadedImage(e.target.files[0])}
          required={!initialData}
        />
      </div>

      {colorOptions.map((color, colorIdx) => (
        <div key={colorIdx} className="border rounded p-4 bg-gray-50 relative">
          <input
            type="text"
            placeholder="Color name"
            value={color.color}
            onChange={(e) => handleColorChange(colorIdx, "color", e.target.value)}
            className="w-full border px-2 py-1 mb-2"
            required
          />
          <button
            type="button"
            onClick={() => removeColor(colorIdx)}
            className="absolute top-1 right-2 text-red-600 text-sm"
          >
            ✕ Remove Color
          </button>

          {color.frameImages.map((img, imgIdx) => (
            <div key={imgIdx} className="border p-2 rounded mb-2 bg-white">
              <input
                type="text"
                placeholder="Title"
                value={img.title}
                onChange={(e) =>
                  handleFrameImageChange(colorIdx, imgIdx, "title", e.target.value)
                }
                className="w-full border px-2 py-1 mb-2"
                required
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleFileChange(colorIdx, imgIdx, e.target.files[0])
                }
                required={!img.imageUrl && !img.file}
              />
              <div className="mt-2">
                {img.sizes.map((size, sizeIdx) => (
                  <div key={sizeIdx} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Size label (e.g. 8x10)"
                      value={size.label}
                      onChange={(e) =>
                        handleSizeChange(colorIdx, imgIdx, sizeIdx, "label", e.target.value)
                      }
                      className="border px-2 py-1 w-1/3"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Amount"
                      value={size.amount}
                      onChange={(e) =>
                        handleSizeChange(colorIdx, imgIdx, sizeIdx, "amount", e.target.value)
                      }
                      className="border px-2 py-1 w-1/3"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => removeSize(colorIdx, imgIdx, sizeIdx)}
                      className="text-red-600 text-xs"
                      title="Remove Size"
                    >
                      ❌
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addSize(colorIdx, imgIdx)}
                  className="text-xs text-blue-600 ml-1"
                >
                  + Add Size
                </button>
              </div>

              <button
                type="button"
                onClick={() => removeFrameImage(colorIdx, imgIdx)}
                className="text-xs text-red-600 mt-2"
              >
                ✕ Remove Frame Image
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() => addFrameImage(colorIdx)}
            className="text-sm text-green-600 mt-2"
          >
            + Add Frame Image
          </button>
        </div>
      ))}

      <button type="button" onClick={addColor} className="text-blue-700 underline">
        + Add Color Option
      </button>

      <br />
      <button
        type="submit"
        disabled={loading}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        {loading ? "Saving..." : initialData ? "Update" : "Create"}
      </button>
    </form>
  );
};

export default FrameForm;
