import { useEffect, useState } from "react";
import axios from "axios";
import CreateFruitForm from "../components/Admin/CreateFruitForm";
import CreateCategoryForm from "../components/Admin/CreateCategoryForm";
import EditFruitForm from "../components/Admin/EditFruitForm";
import { API_BASE_URL } from "../config";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [fruits, setFruits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshCategoriesSignal, setRefreshCategoriesSignal] = useState(0);
  const [editingFruit, setEditingFruit] = useState(null);

  async function fetchFruits() {
    try {
      const token = localStorage.getItem("token");

      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/fruits`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setFruits(data);
    } catch (error) {
      console.error("Failed to fetch fruits:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchFruits();
  }, []);

  function handleFruitAdded(newFruit) {
    setFruits((prevFruits) => [newFruit, ...prevFruits]);
  }

  function handleCategoryAdded() {
    setRefreshCategoriesSignal((prev) => prev + 1);
  }

  function handleFruitUpdated(updatedFruit) {
    setFruits((prevFruits) =>
      prevFruits.map((fruit) =>
        fruit.id === updatedFruit.id ? updatedFruit : fruit,
      ),
    );
    setEditingFruit(null);
  }

  async function handleDeleteFruit(fruitId) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this fruit?",
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`${API_BASE_URL}/api/fruits/${fruitId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFruits((prevFruits) =>
        prevFruits.filter((fruit) => fruit.id !== fruitId),
      );
    } catch (error) {
      console.error("Failed to delete fruit:", error);
    }
  }

  return (
    <div className="admin-dashboard">
      <h1 className="admin-dashboard-title">
        🍓 Admin Dashboard - Inventory Management
      </h1>

      <CreateCategoryForm onCategoryAdded={handleCategoryAdded} />

      <CreateFruitForm
        onFruitAdded={handleFruitAdded}
        refreshCategoriesSignal={refreshCategoriesSignal}
      />

      {editingFruit && (
        <EditFruitForm
          fruit={editingFruit}
          onFruitUpdated={handleFruitUpdated}
          onCancel={() => setEditingFruit(null)}
          refreshCategoriesSignal={refreshCategoriesSignal}
        />
      )}

      <div className="inventory-section">
        <h2>Current Inventory ({fruits.length} fruits)</h2>

        {loading ? (
          <p>Loading inventory...</p>
        ) : (
          <div className="inventory-grid">
            {fruits.map((fruit) => (
              <div className="inventory-item" key={fruit.id}>
                <strong>{fruit.name}</strong> — £
                {(fruit.price / 100).toFixed(2)}
                {" — "}
                Stock: {fruit.stockQuantity}
                {" — "}
                Category: {fruit.category?.name || "No category"}
                <div className="inventory-actions">
                  <button
                    className="edit-btn"
                    onClick={() => setEditingFruit(fruit)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteFruit(fruit.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
