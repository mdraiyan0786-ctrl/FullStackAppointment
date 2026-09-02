import Navbar from "../../component/Navbar/Navbar";
import "./Contact.css";

function Contact() {
  return (
    <>
      <Navbar />

      <div className="contact-container">

        <div className="contact-header">
          <h1>Contact Us</h1>
          <p>
            We'd love to hear from you. If you have any questions,
            suggestions, or feedback, feel free to contact us.
          </p>
        </div>

        <div className="contact-content">

          <div className="contact-info">

            <h2>Get In Touch</h2>

            <div className="info-box">
              <h3>📍 Address</h3>
              <p>Kolkata, West Bengal, India</p>
            </div>

            <div className="info-box">
              <h3>📞 Phone</h3>
              <p>+91 98765 43210</p>
            </div>

            <div className="info-box">
              <h3>📧 Email</h3>
              <p>support@appointment.com</p>
            </div>

          </div>

          <div className="contact-form">

            <h2>Send a Message</h2>

            <form>

              <input
                type="text"
                placeholder="Your Name"
              />

              <input
                type="email"
                placeholder="Your Email"
              />

              <input
                type="text"
                placeholder="Subject"
              />

              <textarea
                rows="6"
                placeholder="Your Message"
              ></textarea>

              <button type="submit">
                Send Message
              </button>

            </form>

          </div>

        </div>

      </div>
    </>
  );
}

export default Contact;