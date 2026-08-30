import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/AddTrip.css";
import api from "../services/api";
import { toast } from "react-toastify";

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

  // Week 4 messages
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
    setSuccess("");
  };

  const handlePhotoChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) {
      setPhoto(null);
      return;
    }

    // Allowed image types
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      const message =
        "Please select a JPG, JPEG, PNG, or WEBP image.";

      setError(message);
      toast.error(message);

      setPhoto(null);
      e.target.value = "";

      return;
    }

    // Maximum 5 MB
    if (selectedFile.size > 5 * 1024 * 1024) {
      const message =
        "Photo size must be less than 5 MB.";

      setError(message);
      toast.error(message);

      setPhoto(null);
      e.target.value = "";

      return;
    }

    setError("");
    setSuccess("");
    setPhoto(selectedFile);

    toast.success("Photo selected successfully! 📸");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const token = localStorage.getItem("token");

    // Check login
    if (!token) {
      const message = "Please login first.";

      setError(message);
      toast.error(message);

      setTimeout(() => {
        navigate("/login");
      }, 1000);

      return;
    }

    // Validate dates
    if (
      formData.startDate &&
      formData.endDate &&
      formData.endDate < formData.startDate
    ) {
      const message =
        "End date cannot be before start date.";

      setError(message);
      toast.error(message);

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

      console.log(
        "Trip created:",
        tripResponse.data
      );

      const tripId = tripResponse.data.trip._id;

      // ==========================================
      // STEP 2: UPLOAD PHOTO
      // ==========================================

      if (photo) {
        try {
          const imageData = new FormData();

          imageData.append("photo", photo);

          console.log(
            "Uploading photo:",
            photo.name
          );

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

          setSuccess(
            "Trip and photo created successfully! 🎉"
          );

          toast.success(
            "Trip and photo created successfully! 🎉"
          );
        } catch (uploadError) {
          console.error(
            "Photo upload error:",
            uploadError
          );

          const uploadMessage =
            "Trip was created, but photo upload failed. You can try adding the photo again from Edit.";

          setError(uploadMessage);

          toast.error(
            "Trip created, but photo upload failed."
          );

          setTimeout(() => {
            navigate("/dashboard");
          }, 2500);

          return;
        }
      } else {
        setSuccess(
          "Trip created successfully! 🎉"
        );

        toast.success(
          "Trip created successfully! 🎉"
        );
      }

      // ==========================================
      // STEP 3: GO TO DASHBOARD
      // ==========================================

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      console.error(
        "Create trip error:",
        error
      );

      console.error(
        "Server response:",
        error.response?.data
      );

      const errorMessage =
        error.response?.data?.message ||
        "Unable to create trip. Please try again.";

      setError(errorMessage);

      toast.error(errorMessage);
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

          {/* ERROR MESSAGE */}

          {error && (
            <div className="form-error">
              ❌ {error}
            </div>
          )}

          {/* SUCCESS MESSAGE */}

          {success && (
            <div className="form-success">
              ✅ {success}
            </div>
          )}

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
              disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
            />

            {photo && (
              <p className="selected-photo">
                📸 Selected:{" "}
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
                disabled={loading}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="button-spinner"></span>
                    Creating...
                  </>
                ) : (
                  "Create Trip ✈️"
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}

export default AddTrip;