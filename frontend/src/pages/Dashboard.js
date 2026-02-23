import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const name = user?.email?.split("@")[0] || "Traveler";

  return (
    <motion.div
      className="dashboard-page"
      style={{ backgroundImage: "url(/img5.jpg)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="dashboard-content"
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <p className="welcome-text">
          Welcome back, {name}! 👋
        </p>

        <h1>
          Ready for Your Next <span>Adventure?</span>
        </h1>

        <p className="subtitle1">
          Create personalized travel plans, explore new destinations,
          and keep all your trips organized in one place.
          <br />
          Your next unforgettable journey starts here.
        </p>

        <div className="dashboard-cards">
          {/* PLAN A TRIP - NO ICON */}
          <motion.div
            className="dash-card"
            onClick={() => navigate("/plan-trip")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <h3>Plan a Trip</h3>
            <p>
              Create a new travel itinerary with our step-by-step planner
            </p>
          </motion.div>

          {/* MY TRIPS - NO ICON */}
          <motion.div
            className="dash-card"
            onClick={() => navigate("/my-trips")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <h3>My Trips</h3>
            <p>
              View and manage all your planned adventures
            </p>
          </motion.div>
        </div>

        {/* STATS SECTION COMPLETELY REMOVED */}
        
      </motion.div>
    </motion.div>
  );
}

export default Dashboard;