import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

const token = localStorage.getItem("token");
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      {/* LEFT LOGO */}
      <div className="navbar-left">
        <Link to="/" className="logo">
          🧭 <span>Trip Navigator</span>
        </Link>
      </div>

      {/* RIGHT SIDE */}
      <div className="navbar-right">
        {!token ?(
          /* ===== BEFORE LOGIN ===== */
          <>
            <Link
              to="/"
              className={`nav-btn ${isActive("/") ? "active" : ""}`}
            >
              About
            </Link>

            <Link
              to="/login"
              className={`nav-btn ${isActive("/login") ? "active" : ""}`}
            >
              Login
            </Link>

            <Link
              to="/register"
              className={`nav-btn ${isActive("/register") ? "active" : ""}`}
            >
              Register
            </Link>
          </>
        ) : (
          /* ===== AFTER LOGIN ===== */
          <>
            <Link
              to="/dashboard"
              className={isActive("/dashboard") ? "active-link" : ""}
            >
              Home
            </Link>

            <Link
              to="/plan-trip"
              className={isActive("/plan-trip") ? "active-link" : ""}
            >
              Plan Trip
            </Link>

            <Link
              to="/my-trips"
              className={isActive("/my-trips") ? "active-link" : ""}
            >
              My Trips
            </Link>

                      

            <Link
              to="/destinations"
              className={isActive("/destinations") ? "active-link" : ""}
            >
              Destinations
            </Link>

            <Link
              to="/contact"
              className={isActive("/contact") ? "active-link" : ""}
            >
              Contact
            </Link>

            {/* <span className="user-greet">
              Hi, {user.email.split("@")[0]}
            </span> */}

            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;