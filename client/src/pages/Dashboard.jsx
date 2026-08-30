import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/Dashboard.css";
import api from "../services/api";

function Dashboard() {
  const navigate = useNavigate();

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/trips", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Check what the backend is sending
      console.log("TRIPS FROM SERVER:", response.data.trips);

      setTrips(response.data.trips || []);
    } catch (error) {
      console.error("Error fetching trips:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (tripId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this trip?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await api.delete(`/trips/${tripId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Trip deleted successfully!");

      fetchTrips();
    } catch (error) {
      console.error("Delete trip error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to delete trip"
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <>
      <Navbar />

      <main className="dashboard-page">
        <section className="dashboard-header">
          <div>
            <p className="dashboard-label">
              MY TRAVEL SPACE
            </p>

            <h1>
              Welcome, {user?.name || "Traveler"} 👋
            </h1>

            <p className="dashboard-subtitle">
              Plan your adventures and keep all your trips
              organized in one place.
            </p>
          </div>

          <div className="dashboard-actions">
            <button
              className="add-trip-btn"
              onClick={() => navigate("/add-trip")}
            >
              + Add New Trip
            </button>

            <button
              className="logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </section>

        <section className="trip-section">
          <div className="section-title">
            <div>
              <h2>My Trips ✈️</h2>
              <p>Your upcoming and saved journeys</p>
            </div>

            <span className="trip-count">
              {trips.length}{" "}
              {trips.length === 1 ? "Trip" : "Trips"}
            </span>
          </div>

          {loading ? (
            <div className="dashboard-message">
              <div className="spinner"></div>
              <p>Loading your trips...</p>
            </div>
          ) : trips.length === 0 ? (
            <div className="empty-trips">
              <div className="empty-icon">🧳</div>

              <h3>No trips yet</h3>

              <p>
                Your next adventure starts here. Create
                your first trip!
              </p>

              <button
                className="add-trip-btn"
                onClick={() => navigate("/add-trip")}
              >
                + Create Your First Trip
              </button>
            </div>
          ) : (
            <div className="trip-grid">
              {trips.map((trip) => (
                <div className="trip-card" key={trip._id}>

                  {/* ============================= */}
                  {/* TRIP PHOTO */}
                  {/* ============================= */}

                  {trip.coverImage ? (
                    <div className="trip-image-container">
                      <img
                        src={trip.coverImage}
                        alt={trip.title || "Trip"}
                        className="trip-image"
                        onError={(e) => {
                          console.error(
                            "Image failed to load:",
                            trip.coverImage
                          );

                          e.currentTarget.style.display =
                            "none";
                        }}
                      />
                    </div>
                  ) : (
                    <div className="trip-image-placeholder">
                      🌍
                    </div>
                  )}

                  {/* TOP SECTION */}

                  <div className="trip-card-top">
                    <span className="trip-icon">
                      🌍
                    </span>

                    <span className="trip-status">
                      Planned
                    </span>
                  </div>

                  {/* TITLE */}

                  <h3>{trip.title}</h3>

                  {/* DESTINATION */}

                  <p className="trip-destination">
                    📍 {trip.destination}
                  </p>

                  {/* DATES */}

                  <div className="trip-date">
                    <span>📅</span>

                    <div>
                      <strong>
                        {new Date(
                          trip.startDate
                        ).toLocaleDateString()}
                      </strong>

                      <span> → </span>

                      <strong>
                        {new Date(
                          trip.endDate
                        ).toLocaleDateString()}
                      </strong>
                    </div>
                  </div>

                  {/* RATING */}

                  {trip.rating && (
                    <div className="trip-rating">
                      <span>⭐</span>

                      <strong>
                        {trip.rating}/5
                      </strong>
                    </div>
                  )}

                  {/* DESCRIPTION */}

                  {trip.description && (
                    <p className="trip-description">
                      {trip.description}
                    </p>
                  )}

                  {/* ACTIONS */}

                  <div className="trip-card-actions">
                    <button
                      className="edit-btn"
                      onClick={() =>
                        navigate(
                          `/edit-trip/${trip._id}`
                        )
                      }
                    >
                      ✏️ Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        handleDelete(trip._id)
                      }
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}

export default Dashboard;