import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/EditTrip.css";
import api from "../services/api";

function EditTrip() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    destination: "",
    startDate: "",
    endDate: "",
    description: "",
    rating: "",
  });

  const [photo, setPhoto] = useState(null);
  const [currentPhoto, setCurrentPhoto] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadTrip();
  }, [id]);

  const loadTrip = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get(`/trips/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const trip = response.data.trip;

      if (!trip) {
        alert("Trip not found");
        navigate("/dashboard");
        return;
      }

      setFormData({
        title: trip.title || "",
        destination: trip.destination || "",
        startDate: trip.startDate
          ? trip.startDate.substring(0, 10)
          : "",
        endDate: trip.endDate
          ? trip.endDate.substring(0, 10)
          : "",
        description: trip.description || "",
        rating: trip.rating || "",
      });

      setCurrentPhoto(trip.coverImage || "");
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

  const handlePhotoChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      setPhoto(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      // ==========================================
      // STEP 1: UPDATE TRIP DETAILS
      // ==========================================

      await api.put(
        `/trips/${id}`,
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

      // ==========================================
      // STEP 2: UPLOAD NEW PHOTO IF SELECTED
      // ==========================================

      if (photo) {
        const imageData = new FormData();

        imageData.append("photo", photo);

        await api.post(
          `/trips/${id}/upload`,
          imageData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

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

          <p>
            Update your travel details.
          </p>

          <form onSubmit={handleSubmit}>

            {/* TITLE */}
            <label htmlFor="title">
              Trip Title
            </label>

            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />

            {/* DESTINATION */}
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

            {/* START DATE */}
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

            {/* END DATE */}
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

            {/* DESCRIPTION */}
            <label htmlFor="description">
              Description
            </label>

            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              placeholder="Add notes or memories about your trip..."
            />

            {/* RATING */}
            <label htmlFor="rating">
              Rating (1–5)
            </label>

            <select
              id="rating"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
            >
              <option value="">
                Select rating
              </option>

              <option value="1">
                ⭐ 1
              </option>

              <option value="2">
                ⭐⭐ 2
              </option>

              <option value="3">
                ⭐⭐⭐ 3
              </option>

              <option value="4">
                ⭐⭐⭐⭐ 4
              </option>

              <option value="5">
                ⭐⭐⭐⭐⭐ 5
              </option>
            </select>

            {/* CURRENT PHOTO */}
            {currentPhoto && (
              <div className="current-photo">
                <label>
                  Current Trip Photo
                </label>

                <img
                  src={currentPhoto}
                  alt="Current trip"
                  style={{
                    width: "200px",
                    height: "130px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    display: "block",
                    marginTop: "8px",
                  }}
                />
              </div>
            )}

            {/* NEW PHOTO */}
            <label htmlFor="photo">
              Change Trip Photo
            </label>

            <input
              id="photo"
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={handlePhotoChange}
            />

            {photo && (
              <p>
                New photo selected:{" "}
                <strong>{photo.name}</strong>
              </p>
            )}

            {/* BUTTONS */}
            <div className="edit-buttons">

              <button
                type="button"
                className="cancel-edit-btn"
                onClick={() =>
                  navigate("/dashboard")
                }
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