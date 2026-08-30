import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/Login.css";
import api from "../services/api";
import { toast } from "react-toastify";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // Clear previous error when user starts typing
    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      setLoading(true);

      const response = await api.post(
        "/auth/login",
        formData
      );

      // Save login information
      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      // Success toast
      toast.success("Login successful! 🎉");

      // Go to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);

      const errorMessage =
        error.response?.data?.message ||
        "Login failed. Please check your email and password.";

      // Toast error
      toast.error(errorMessage);

      // Show error on page
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="login">
        <h2>Login to TripVault</h2>

        {/* ERROR MESSAGE */}

        {error && (
          <div className="error-message">
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* EMAIL */}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
          />

          <br />
          <br />

          {/* PASSWORD */}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={loading}
          />

          <br />
          <br />

          {/* LOGIN BUTTON */}

          <button
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="button-spinner"></span>
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </>
  );
}

export default Login;