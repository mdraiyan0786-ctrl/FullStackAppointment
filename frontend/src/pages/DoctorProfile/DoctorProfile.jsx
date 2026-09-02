import { useParams, Link } from "react-router-dom";
import Navbar from "../../component/Navbar/Navbar";
import Footer from "../../component/Footer/Footer";
import doctors from "../../data/doctors";
import "./DoctorProfile.css";

function DoctorProfile() {
  const { id } = useParams();

  const doctor = doctors.find((doc) => doc.id === Number(id));

  if (!doctor) {
    return <h2 className="not-found">Doctor Not Found</h2>;
  }

  return (
    <>
      <Navbar />

      <div className="profile-container">

        <div className="profile-card">

          <div className="profile-image">
            <img src={doctor.image} alt={doctor.name} />
          </div>

          <div className="profile-details">

            <h1>{doctor.name}</h1>

            <span className="specialization">
              {doctor.specialization}
            </span>

            <div className="info-row">
              <strong>Qualification</strong>
              <span>{doctor.qualification}</span>
            </div>

            <div className="info-row">
              <strong>Experience</strong>
              <span>{doctor.experience}</span>
            </div>

            <div className="info-row">
              <strong>Consultation Fee</strong>
              <span>₹{doctor.fee}</span>
            </div>

            <div className="info-row">
              <strong>Medical Store</strong>
              <span>{doctor.store}</span>
            </div>

            <div className="info-row">
              <strong>Available Time</strong>
              <span>{doctor.time}</span>
            </div>

            <div className="info-row">
              <strong>Rating</strong>
              <span>⭐ {doctor.rating}</span>
            </div>

            <Link to="/appointment" state={{ doctor }}>
  <button className="book-btn">Book Appointment</button>
</Link>

          </div>

        </div>

      </div>

      <Footer />
    </>
  );
}

export default DoctorProfile;