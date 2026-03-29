import { useEffect, useState } from "react";
import axios from "axios";
import "./EditFruitForm.css";

function EditFruitForm({
  fruit,
  onFruitUpdated,
  onCancel,
  refreshCategoriesSignal,
}) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stockQuantity: "",
    supplier: "",
    expiryDate: "",
    imageUrl: "",
    categoryId: "",
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (fruit) {
      setFormData({
        name: fruit.name || "",
        description: fruit.description || "",
        price: fruit.price ? (fruit.price / 100).toFixed(2) : "",
        stockQuantity: fruit.stockQuantity ?? "",
        supplier: fruit.supplier || "",
        expiryDate: fruit.expiryDate
          ? new Date(fruit.expiryDate).toISOString().split("T")[0]
          : "",
        imageUrl: fruit.imageUrl || "",
        categoryId: fruit.categoryId || "",
      });
    }
  }, [fruit]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const token = localStorage.getItem("token");

        const { data } = await axios.get(
          "http://localhost:5000/api/categories",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    }

    fetchCategories();
  }, [refreshCategoriesSignal]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const token = localStorage.getItem("token");

      const payload = {
        name: formData.name,
        description: formData.description || null,
        price: Math.round(Number(formData.price) * 100),
        stockQuantity: Number(formData.stockQuantity),
        supplier: formData.supplier || null,
        expiryDate: formData.expiryDate || null,
        imageUrl: formData.imageUrl || null,
        categoryId: Number(formData.categoryId),
      };

      const { data } = await axios.put(
        `http://localhost:5000/api/fruits/${fruit.id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setMessage({ type: "success", text: "Fruit updated successfully" });

      if (onFruitUpdated) {
        onFruitUpdated(data);
      }
    } catch (error) {
      console.error("Failed to update fruit:", error);
      setMessage({
        type: "error",
        text: error.response?.data?.error || "Failed to update fruit",
      });
    } finally {
      setLoading(false);
    }
  }

  if (!fruit) return null;

  return (
    <div className="edit-fruit-form">
      <h2 className="edit-fruit-title">✏️ Edit Fruit</h2>
      <p className="edit-fruit-subtitle">Update this fruit in the inventory</p>

      {message.text && (
        <p className={`edit-message ${message.type}`}>{message.text}</p>
      )}

      <form onSubmit={handleSubmit} className="edit-fruit-fields">
        <input
          type="text"
          name="name"
          placeholder="Fruit name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Description (optional)"
          value={formData.description}
          onChange={handleChange}
          rows="3"
        />

        <div className="form-row">
          <input
            type="number"
            name="price"
            placeholder="Price in pounds"
            value={formData.price}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
          />

          <input
            type="number"
            name="stockQuantity"
            placeholder="Stock quantity"
            value={formData.stockQuantity}
            onChange={handleChange}
            min="0"
            required
          />
        </div>

        <input
          type="text"
          name="supplier"
          placeholder="Supplier (optional)"
          value={formData.supplier}
          onChange={handleChange}
        />

        <input
          type="date"
          name="expiryDate"
          value={formData.expiryDate}
          onChange={handleChange}
        />

        <input
          type="text"
          name="imageUrl"
          placeholder="Image URL (optional)"
          value={formData.imageUrl}
          onChange={handleChange}
        />

        <select
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          required
        >
          <option value="">Select category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <div className="edit-actions">
          <button type="submit" disabled={loading} className="save-btn">
            {loading ? "Saving..." : "Save Changes"}
          </button>

          <button type="button" onClick={onCancel} className="cancel-btn">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditFruitForm;
