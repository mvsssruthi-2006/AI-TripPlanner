import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Users, Wallet, Trash2, ArrowRight } from "lucide-react";
import "./MyTrips.css";

function MyTrips() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);

  const backgroundStyle = {
  minHeight: "100vh",
  padding: "120px 60px",
  color: "white",
  backgroundImage: `
    linear-gradient(
      rgba(10, 20, 40, 0.55),
      rgba(5, 10, 25, 0.75)
    ),
    url("/img3.jpg")
  `,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundAttachment: "fixed",
};


 useEffect(() => {
  const fetchTrips = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:8000/api/my-trips", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setTrips(data.map(t => t.trip_data));
  };

  fetchTrips();
}, []);

  const handleDeleteTrip = (indexToDelete) => {
    const updatedTrips = trips.filter((_, index) => index !== indexToDelete);
    setTrips(updatedTrips);
    localStorage.setItem("myTrips", JSON.stringify(updatedTrips));
  };

  if (trips.length === 0) {
    return (
      <div style={backgroundStyle} className="mytrips-page">
        <div className="empty-state">
          <h2>No trips saved yet</h2>
          <button onClick={() => navigate("/plan-trip")}>
            Plan a Trip
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mytrips-page" style={backgroundStyle}>
      <div className="mytrips-wrapper">
        <h1 className="mytrips-title">My Trips</h1>

        <div className="trips-grid">
          {trips.map((trip, index) => {
            const destination =
              trip.destination?.destination ||
              trip.user_profile?.destination ||
              "Unknown Destination";

            const days = trip.user_profile?.days || "N/A";
            const travelers = trip.user_profile?.travelers || "N/A";
            const budget = trip.budget || {};

            return (
              <div key={index} className="trip-card">
                <div className="trip-header">
                  <h2>{destination}</h2>

                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteTrip(index)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="trip-details">
                  <div>
                    <Calendar size={18} />
                    <span>{days} Days</span>
                  </div>

                  <div>
                    <Users size={18} />
                    <span>{travelers} Travelers</span>
                  </div>

                  {budget.total_estimated_budget && (
                    <div>
                      <Wallet size={18} />
                      <span>{budget.total_estimated_budget}</span>
                    </div>
                  )}
                </div>

                <button
                  className="view-btn"
                  onClick={() =>
                    navigate("/trip-result", { state: trip })
                  }
                >
                  Explore Trip <ArrowRight size={18} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default MyTrips;