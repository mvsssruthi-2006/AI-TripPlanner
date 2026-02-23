import "./Footer.css";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <h3>Trip Navigator 🧭</h3>
          <p>Your ultimate travel companion. Plan, explore, and create unforgettable journeys through incredible India with our intelligent trip planning platform.</p>
        </div>

        <div>
          <h4>Quick Links</h4>
          <p><Link to="/dashboard">Home</Link></p>
          <p><Link to="/destinations">Destinations</Link></p>
          <p><Link to="/plan-trip">Plan a Trip</Link></p>
          <p><Link to="/contact">Contact</Link></p>
        </div>

        <div>
          <h4>Popular Indian Destinations</h4>
          <p>Jaipur, Rajasthan</p>
          <p>Goa, Beach Paradise</p>
          <p>Kerala, Backwaters</p>
          <p>Agra, Taj Mahal</p>
          <p>Manali, Himalayas</p>
        </div>

        <div>
          <h4>Connect With Us</h4>
          <p>📧 info@tripnavigator.com</p>
          <p>📱 +91 98765 43210</p>
          <p>📍 New Delhi, India</p>
        </div>
      </div>

      <div className="copyright">
        © 2026 Trip Navigator. All rights reserved. | Discover the beauty of India
      </div>
    </footer>
  );
}