import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/Register.css";
import api from "../services/api";
import { toast } from "react-toastify";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // Clear messages when user starts typing
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
      setLoading(true);

      const response = await api.post(
        "/auth/register",
        formData
      );

      const successMessage =
        response.data.message ||
        "Registration successful! Redirecting to login...";

      // Show success message on page
      setSuccess(successMessage);

      // Show success toast
      toast.success("Registration successful! 🎉");

      // Redirect to login
      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      console.error("Registration error:", error);

      const errorMessage =
        error.response?.data?.message ||
        "Registration failed. Please try again.";

      // Show error on page
      setError(errorMessage);

      // Show error toast
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="register">
        <h2>Create Your TripVault Account ✈️</h2>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="error-message">
            ❌ {error}
          </div>
        )}

        {/* SUCCESS MESSAGE */}
        {success && (
          <div className="success-message">
            ✅ {success}
          </div>
        )}

        <form
          className="register-form"
          onSubmit={handleSubmit}
        >
          {/* NAME */}
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={loading}
          />

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

          {/* REGISTER BUTTON */}
          <button
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="button-spinner"></span>
                Creating Account...
              </>
            ) : (
              "Register"
            )}
          </button>
        </form>
      </div>
    </>
  );
}

export default Register;