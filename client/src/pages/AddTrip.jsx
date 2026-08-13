import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/AddTrip.css";
import api from "../services/api";

function AddTrip() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    destination: "",
    startDate: "",
    endDate: "",
    description: "",
    rating: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      await api.post(
        "/trips",
        {
          ...formData,
          rating: formData.rating
            ? Number(formData.rating)
            : undefined,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Trip created successfully! 🎉");

      navigate("/dashboard");
    } catch (error) {
      console.error("Create trip error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to create trip"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="add-trip-page">
        <div className="add-trip-card">
          <h1>Plan Your Trip ✈️</h1>

          <p>Add details about your next adventure.</p>

          <form onSubmit={handleSubmit}>
            <label htmlFor="title">Trip Title</label>

            <input
              id="title"
              type="text"
              name="title"
              placeholder="Example: Goa Beach Vacation"
              value={formData.title}
              onChange={handleChange}
              required
            />

            <label htmlFor="destination">
              Destination
            </label>

            <input
              id="destination"
              type="text"
              name="destination"
              placeholder="Example: Goa"
              value={formData.destination}
              onChange={handleChange}
              required
            />

            <label htmlFor="startDate">
              Start Date
            </label>

            <input
              id="startDate"
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />

            <label htmlFor="endDate">
              End Date
            </label>

            <input
              id="endDate"
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
            />

            <label htmlFor="description">
              Description
            </label>

            <textarea
              id="description"
              name="description"
              placeholder="Add notes or memories about your trip..."
              value={formData.description}
              onChange={handleChange}
              rows="5"
            />

            <label htmlFor="rating">
              Rating (1–5)
            </label>

            <select
              id="rating"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
            >
              <option value="">Select rating</option>
              <option value="1">⭐ 1</option>
              <option value="2">⭐⭐ 2</option>
              <option value="3">⭐⭐⭐ 3</option>
              <option value="4">⭐⭐⭐⭐ 4</option>
              <option value="5">⭐⭐⭐⭐⭐ 5</option>
            </select>

            <div className="add-trip-buttons">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
              >
                {loading
                  ? "Creating..."
                  : "Create Trip ✈️"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default AddTrip;