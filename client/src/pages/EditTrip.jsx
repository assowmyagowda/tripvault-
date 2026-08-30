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

  // Week 4 messages
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================
  // LOAD TRIP
  // ==========================================

  useEffect(() => {
    loadTrip();
  }, [id]);

  const loadTrip = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await api.get(`/trips/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const trip = response.data.trip;

      if (!trip) {
        setError("Trip not found.");
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

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      setError(
        error.response?.data?.message ||
          "Unable to load this trip. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // HANDLE INPUT CHANGES
  // ==========================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
    setSuccess("");
  };

  // ==========================================
  // HANDLE PHOTO
  // ==========================================

  const handlePhotoChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) {
      setPhoto(null);
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      setError(
        "Please select a JPG, JPEG, PNG, or WEBP image."
      );

      setPhoto(null);
      e.target.value = "";
      return;
    }

    // Maximum 5 MB
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("Photo size must be less than 5 MB.");

      setPhoto(null);
      e.target.value = "";
      return;
    }

    setError("");
    setSuccess("");
    setPhoto(selectedFile);
  };

  // ==========================================
  // UPDATE TRIP
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Your session has expired. Please login again.");

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
      setError("End date cannot be before start date.");
      return;
    }

    try {
      setSaving(true);

      // ==========================================
      // STEP 1: UPDATE TRIP DETAILS
      // ==========================================

      await api.put(
        `/trips/${id}`,
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

      // ==========================================
      // STEP 2: UPLOAD NEW PHOTO
      // ==========================================

      if (photo) {
        try {
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
        } catch (uploadError) {
          console.error(
            "Photo upload error:",
            uploadError
          );

          setError(
            "Trip details were updated, but the new photo could not be uploaded."
          );

          setSaving(false);
          return;
        }
      }

      // ==========================================
      // SUCCESS
      // ==========================================

      setSuccess("Trip updated successfully! 🎉");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      console.error("Update trip error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
        return;
      }

      setError(
        error.response?.data?.message ||
          "Unable to update trip. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // LOADING SCREEN
  // ==========================================

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="edit-loading-page">
          <div className="edit-loading">
            <div className="edit-spinner"></div>

            <p>Loading your trip...</p>
          </div>
        </main>
      </>
    );
  }

  // ==========================================
  // MAIN UI
  // ==========================================

  return (
    <>
      <Navbar />

      <main className="edit-trip-page">
        <div className="edit-trip-card">

          <h1>Edit Trip ✏️</h1>

          <p className="edit-subtitle">
            Update your travel details and memories.
          </p>

          {/* ERROR MESSAGE */}

          {error && (
            <div className="edit-error">
              ❌ {error}
            </div>
          )}

          {/* SUCCESS MESSAGE */}

          {success && (
            <div className="edit-success">
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
              disabled={saving}
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
              disabled={saving}
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
              disabled={saving}
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
              disabled={saving}
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
              disabled={saving}
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
              disabled={saving}
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
                  className="current-photo-image"
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
              disabled={saving}
            />

            {photo && (
              <p className="selected-photo">
                📸 New photo selected:{" "}
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
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="save-edit-btn"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="button-spinner"></span>
                    Saving...
                  </>
                ) : (
                  "Save Changes 💾"
                )}
              </button>

            </div>

          </form>
        </div>
      </main>
    </>
  );
}

export default EditTrip;