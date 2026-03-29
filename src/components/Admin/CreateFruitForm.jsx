import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config";
import "./CreateFruitForm.css";

function CreateFruitForm({ onFruitAdded, refreshCategoriesSignal }) {
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
    async function fetchCategories() {
      try {
        const token = localStorage.getItem("token");

        const { data } = await axios.get(`${API_BASE_URL}/api/categories`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCategories(Array.isArray(data) ? data : []);
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

      const { data } = await axios.post(`${API_BASE_URL}/api/fruits`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage({ type: "success", text: "🎉 Fruit added successfully!" });

      setFormData({
        name: "",
        description: "",
        price: "",
        stockQuantity: "",
        supplier: "",
        expiryDate: "",
        imageUrl: "",
        categoryId: "",
      });

      if (onFruitAdded) {
        onFruitAdded(data);
      }
    } catch (error) {
      console.error("Failed to add fruit:", error);

      setMessage({
        type: "error",
        text: error.response?.data?.error || "Failed to add fruit",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="create-fruit-form">
      <h2 className="create-fruit-title">🌱 Add New Fruit to Inventory</h2>
      <p className="create-fruit-subtitle">
        Create a new fruit item for the inventory database
      </p>

      {message.text && (
        <p className={`form-message ${message.type}`}>{message.text}</p>
      )}

      <form onSubmit={handleSubmit} className="create-fruit-form-fields">
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
            placeholder="Price in pounds (e.g. 2.50)"
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
          {Array.isArray(categories) &&
            categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
        </select>

        <button type="submit" disabled={loading} className="add-fruit-btn">
          {loading ? "Adding fruit..." : "🌟 Add to Inventory"}
        </button>
      </form>
    </div>
  );
}

export default CreateFruitForm;
