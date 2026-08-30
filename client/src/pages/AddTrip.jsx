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

  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

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

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first.");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      // ==========================================
      // STEP 1: CREATE TRIP
      // ==========================================

      const tripResponse = await api.post(
        "/trips",
        {
          title: formData.title,
          destination: formData.destination,
          startDate: formData.startDate,
          endDate: formData.endDate,
          description: formData.description,
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

      console.log("Trip created:", tripResponse.data);

      const tripId = tripResponse.data.trip._id;

      // ==========================================
      // STEP 2: UPLOAD PHOTO
      // ==========================================

      if (photo) {
        try {
          const imageData = new FormData();

          imageData.append("photo", photo);

          console.log("Uploading photo:", photo.name);

          const uploadResponse = await api.post(
            `/trips/${tripId}/upload`,
            imageData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          console.log(
            "Photo uploaded:",
            uploadResponse.data
          );

          alert("Trip and photo created successfully! 🎉");

        } catch (uploadError) {
          console.error(
            "Photo upload error:",
            uploadError
          );

          // Trip was already created
          alert(
            "Trip created successfully, but photo upload failed."
          );
        }
      } else {
        alert("Trip created successfully! 🎉");
      }

      // ==========================================
      // STEP 3: GO TO DASHBOARD
      // ==========================================

      navigate("/dashboard");

    } catch (error) {
      console.error(
        "Create trip error:",
        error
      );

      console.error(
        "Server response:",
        error.response?.data
      );

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

      <main className="add-trip-page">
        <div className="add-trip-card">

          <h1>Plan Your Trip ✈️</h1>

          <p>
            Add details about your next adventure.
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
              placeholder="Example: Goa Vacation"
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
              placeholder="Example: Goa"
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
              placeholder="Tell us about your trip..."
              value={formData.description}
              onChange={handleChange}
              rows="5"
            />

            {/* RATING */}
            <label htmlFor="rating">
              Rating
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

            {/* PHOTO */}
            <label htmlFor="photo">
              Trip Photo
            </label>

            <input
              id="photo"
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={handlePhotoChange}
            />

            {photo && (
              <p>
                Selected:{" "}
                <strong>{photo.name}</strong>
              </p>
            )}

            {/* BUTTONS */}
            <div className="add-trip-buttons">

              <button
                type="button"
                onClick={() =>
                  navigate("/dashboard")
                }
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
      </main>
    </>
  );
}

export default AddTrip;