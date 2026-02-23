import "./Hero.css";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

function Hero() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("loggedInUser");
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <motion.section
      className="hero"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url(/img2.jpg)",
      }}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="hero-content">
        <h1>
          Welcome to <span>Trip Navigator</span>
        </h1>

        <p>
          Your intelligent travel companion that transforms your dream vacations
          into perfectly planned adventures.
        </p>

        {/* ✅ SHOW ONLY IF NOT LOGGED IN */}
        {!isLoggedIn && (
          <div className="hero-buttons">
            <button
              className="hero-btn"
              onClick={() => navigate("/register")}
            >
              Start Your Journey
            </button>

            <button
              className="hero-btn"
              onClick={() => navigate("/login")}
            >
              Already a Traveler? Login
            </button>
          </div>
        )}

        {/* ✅ OPTIONAL: Show different button when logged in */}
        {isLoggedIn && (
          <button
            className="hero-btn"
            onClick={() => navigate("/dashboard")}
          >
            Go to Dashboard
          </button>
        )}

        <div className="scroll-indicator">
          <span>EXPLORE MORE</span>
          <div className="arrow">⌄</div>
        </div>
      </div>
    </motion.section>
  );
}

export default Hero;