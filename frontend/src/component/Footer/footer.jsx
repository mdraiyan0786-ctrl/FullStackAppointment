import "./Footer.css";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        <div className="footer-section">
          <h2>Appointment</h2>

          <p>
            Book appointments with trusted doctors from nearby
            medical stores quickly and securely.
          </p>
        </div>

        <div className="footer-section">

          <h3>Quick Links</h3>

          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>

        </div>

        <div className="footer-section">

          <h3>Services</h3>

          <p>Find Doctors</p>
          <p>Medical Stores</p>
          <p>Book Appointment</p>
          <p>Digital Prescription</p>

        </div>

        <div className="footer-section">

          <h3>Contact</h3>

          <p>📍 Kolkata, West Bengal</p>
          <p>📞 +91 98765 43210</p>
          <p>📧 support@appointment.com</p>

        </div>

      </div>

      <hr />

      <div className="footer-bottom">
        © 2026 Appointment. All Rights Reserved.
      </div>

    </footer>
  );
}

export default Footer;