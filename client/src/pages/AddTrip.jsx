import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/AddTrip.css";
import api from "../services/api";

function AddTrip() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    notes: "",
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

      await api.post("/trips", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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
            <label>Destination</label>

            <input
              type="text"
              name="destination"
              placeholder="Example: Goa"
              value={formData.destination}
              onChange={handleChange}
              required
            />

            <label>Start Date</label>

            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />

            <label>End Date</label>

            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
            />

            <label>Notes</label>

            <textarea
              name="notes"
              placeholder="Add notes about your trip..."
              value={formData.notes}
              onChange={handleChange}
              rows="5"
            />

            <div className="add-trip-buttons">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
              >
                Cancel
              </button>

              <button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Trip ✈️"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default AddTrip;