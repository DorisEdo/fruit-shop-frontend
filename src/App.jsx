import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import FruitCounter from "./components/FruitCounter";
import CartPage from "./components/CartPage";
import HeartsPage from "./components/HeartsPage";
import LoginPage from "./components/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import { API_BASE_URL } from "./config";
import "./App.css";

function App() {
  const [fruitArray, setFruitArray] = useState([]);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  async function fetchFruitData(authToken) {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/fruits`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      const newData = data.map((fruit) => {
        return {
          id: fruit.id,
          name: fruit.name,
          count: 0,
          price: fruit.price,
          availability: fruit.stockQuantity,
          stars: Math.floor(Math.random() * 6),
          isFavourite: false,
          imageUrl: fruit.imageUrl,
          category: fruit.category?.name || "No category",
        };
      });

      setFruitArray(newData);
    } catch (error) {
      console.error("Failed to fetch fruits:", error);
      setError(error);
    }
  }

  useEffect(() => {
    if (token) {
      fetchFruitData(token);
    }
  }, [token]);

  const addFruit = (fruitName) => {
    setFruitArray((prevArray) => {
      return prevArray.map((fruit) => {
        if (fruitName === fruit.name) {
          return { ...fruit, count: fruit.count + 1 };
        }
        return fruit;
      });
    });
  };

  const subTractFruit = (fruitName) => {
    setFruitArray((prevArray) => {
      return prevArray.map((fruit) => {
        if (fruitName === fruit.name) {
          return { ...fruit, count: Math.max(0, fruit.count - 1) };
        }
        return fruit;
      });
    });
  };

  const removeFruit = (fruitName) => {
    setFruitArray((prevArray) => {
      return prevArray.map((fruit) => {
        if (fruitName === fruit.name) {
          return { ...fruit, count: 0 };
        }
        return fruit;
      });
    });
  };

  const clearCart = () => {
    setFruitArray((prevArray) => {
      return prevArray.map((fruit) => {
        return { ...fruit, count: 0 };
      });
    });
  };

  const chooseFavouriteFruit = (fruitId) => {
    setFruitArray((prevArray) => {
      return prevArray.map((fruit) => {
        if (fruitId === fruit.id) {
          return { ...fruit, isFavourite: !fruit.isFavourite };
        }
        return fruit;
      });
    });
  };

  const handleLogin = (newToken) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    setFruitArray([]);
  };

  if (!token) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="logout-bar">
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
      {error && <p className="error-message">Failed to load fruits</p>}

      <Routes>
        <Route
          path="/"
          element={
            <FruitCounter
              fruitArray={fruitArray}
              addFruit={addFruit}
              subTractFruit={subTractFruit}
              removeFruit={removeFruit}
              chooseFavouriteFruit={chooseFavouriteFruit}
            />
          }
        />
        <Route
          path="/cart"
          element={
            <CartPage
              fruitArray={fruitArray}
              addFruit={addFruit}
              subTractFruit={subTractFruit}
              removeFruit={removeFruit}
              clearCart={clearCart}
              chooseFavouriteFruit={chooseFavouriteFruit}
            />
          }
        />
        <Route
          path="/hearts"
          element={
            <HeartsPage
              fruitArray={fruitArray}
              addFruit={addFruit}
              subTractFruit={subTractFruit}
              removeFruit={removeFruit}
              chooseFavouriteFruit={chooseFavouriteFruit}
            />
          }
        />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
