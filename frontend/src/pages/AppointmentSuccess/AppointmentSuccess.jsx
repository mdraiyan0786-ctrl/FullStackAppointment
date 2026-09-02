import { Link, useLocation } from "react-router-dom";
import Navbar from "../../component/Navbar/Navbar";
import Footer from "../../component/Footer/Footer";
import "./AppointmentSuccess.css";

function AppointmentSuccess() {

  const { state } = useLocation();

  if (!state) {
    return <h2>No appointment found.</h2>;
  }

  return (
    <>
      <Navbar />

      <div className="success-container">

        <div className="success-card">

          <h1>Appointment Booked Successfully 🎉</h1>

          <div className="appointment-details">

            <p><strong>Patient :</strong> {state.patientName}</p>

            <p><strong>Age :</strong> {state.age}</p>

            <p><strong>Gender :</strong> {state.gender}</p>

            <p><strong>Phone :</strong> {state.phone}</p>

            <p><strong>Date :</strong> {state.date}</p>

            <p><strong>Time :</strong> {state.time}</p>

            <p><strong>Status :</strong> Confirmed</p>

          </div>

          <Link to="/">
            <button>
              Back to Home
            </button>
          </Link>

        </div>

      </div>

      <Footer />
    </>
  );
}

export default AppointmentSuccess;