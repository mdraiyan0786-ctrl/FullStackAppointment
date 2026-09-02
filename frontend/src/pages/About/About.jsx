import Navbar from "../../component/Navbar/Navbar";
import "./About.css";

function About() {
  return (
    <>
      <Navbar />

      <div className="about-container">

        <div className="about-header">
          <h1>About Appointment</h1>
          <p>
            Appointment is a healthcare platform that connects patients,
            doctors, and medical stores through a simple and secure
            appointment booking system.
          </p>
        </div>

        <div className="about-section">
          <h2>Our Mission</h2>

          <p>
            Our mission is to make healthcare more accessible by helping
            patients easily find nearby doctors, book appointments online,
            and securely access their prescriptions anytime.
          </p>
        </div>

        <div className="features">

          <div className="feature-card">
            <h3>📅 Easy Appointment Booking</h3>
            <p>
              Book appointments with your preferred doctor in just a few clicks.
            </p>
          </div>

          <div className="feature-card">
            <h3>👨‍⚕️ Verified Doctors</h3>
            <p>
              Find experienced and trusted doctors from registered medical stores.
            </p>
          </div>

          <div className="feature-card">
            <h3>📄 Digital Prescriptions</h3>
            <p>
              Download and access prescriptions whenever you need them.
            </p>
          </div>

          <div className="feature-card">
            <h3>🔒 Secure Platform</h3>
            <p>
              Your personal information and appointments are protected securely.
            </p>
          </div>

        </div>

        <div className="developer">
          <h2>Developer</h2>

          <p>
            This project is developed using React and Spring Boot to provide
            a modern healthcare appointment management system.
          </p>
        </div>

      </div>
    </>
  );
}

export default About;