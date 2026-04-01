import { useState } from "react";
import axios from "axios";
import "./LoginPage.css";

function LoginPage({ onLogin, onSwitchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          email,
          password,
        },
      );

      localStorage.setItem("token", data.token);
      onLogin(data.token);
    } catch (err) {
      console.error("Login failed:", err);
      setError(
        err.response?.data?.error ||
          "Login failed. Please check your email and password.",
      );
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-fruit-row">🍎 🍊 🍌 🍇 🍓</div>
        <h1 className="login-title">Login</h1>
        <p className="login-subtitle">Welcome back to your fruit shop</p>

        <form onSubmit={handleSubmit} className="login-form">
          <input
            className="login-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <input
            className="login-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          <button className="login-button" type="submit">
            Login
          </button>
        </form>

        {error && <p className="login-error">{error}</p>}
      </div>

      <p onClick={onSwitchToRegister} className="switch-link">
        Don’t have an account? Register
      </p>
    </div>
  );
}

export default LoginPage;
