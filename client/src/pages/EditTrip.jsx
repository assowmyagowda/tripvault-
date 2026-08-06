import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/EditTrip.css";
import api from "../services/api";

function EditTrip() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    notes: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadTrip();
  }, [id]);

  const loadTrip = async () => {
    try {
      const token = localStorage.getItem("token");

      // Get all trips first
      const response = await api.get("/trips", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const trips = response.data.trips || [];

      // Find the selected trip
      const trip = trips.find(
        (item) => item._id === id
      );

      if (!trip) {
        alert("Trip not found");
        navigate("/dashboard");
        return;
      }

      setFormData({
        destination: trip.destination || "",
        startDate: trip.startDate
          ? trip.startDate.substring(0, 10)
          : "",
        endDate: trip.endDate
          ? trip.endDate.substring(0, 10)
          : "",
        notes: trip.notes || "",
      });
    } catch (error) {
      console.error("Load trip error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to load trip"
      );

      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      await api.put(`/trips/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Trip updated successfully! 🎉");

      navigate("/dashboard");
    } catch (error) {
      console.error("Update trip error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to update trip"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="edit-loading">
          Loading trip...
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="edit-trip-page">
        <div className="edit-trip-card">
          <h1>Edit Trip ✏️</h1>

          <p>Update your travel details.</p>

          <form onSubmit={handleSubmit}>
            <label htmlFor="destination">
              Destination
            </label>

            <input
              id="destination"
              type="text"
              name="destination"
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

            <label htmlFor="notes">
              Notes
            </label>

            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="5"
              placeholder="Add notes about your trip..."
            />

            <div className="edit-buttons">
              <button
                type="button"
                className="cancel-edit-btn"
                onClick={() => navigate("/dashboard")}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="save-edit-btn"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}

export default EditTrip;