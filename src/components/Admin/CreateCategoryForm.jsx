import { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config";
import "./CreateCategoryForm.css";

function CreateCategoryForm({ onCategoryAdded }) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const token = localStorage.getItem("token");

      const { data } = await axios.post(
        `${API_BASE_URL}/api/categories`,
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setMessage({ type: "success", text: "Category added successfully" });
      setName("");

      if (onCategoryAdded) {
        onCategoryAdded(data);
      }
    } catch (error) {
      console.error("Failed to add category:", error);
      setMessage({
        type: "error",
        text: error.response?.data?.error || "Failed to add category",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="create-category-form">
      <h2 className="create-category-title">🗂 Add New Category</h2>
      <p className="create-category-subtitle">
        Create a category before assigning fruits to it
      </p>

      {message.text && (
        <p className={`category-message ${message.type}`}>{message.text}</p>
      )}

      <form onSubmit={handleSubmit} className="create-category-fields">
        <input
          type="text"
          placeholder="Category name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />

        <button type="submit" disabled={loading} className="add-category-btn">
          {loading ? "Adding category..." : "Add Category"}
        </button>
      </form>
    </div>
  );
}

export default CreateCategoryForm;
