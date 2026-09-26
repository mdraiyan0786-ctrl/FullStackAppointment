import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Navbar from "../../component/Navbar/Navbar";
import Footer from "../../component/Footer/Footer";
import api from "../../api/api";

import "./StoreDoctorAppointments.css";

function StoreDoctorAppointments() {

    const { doctorId } = useParams();
    const navigate = useNavigate();

    const [appointments, setAppointments] = useState([]);
    const [doctor, setDoctor] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // ==========================================
    // FETCH APPOINTMENTS
    // ==========================================

    useEffect(() => {

        const fetchAppointments = async () => {

            try {

                setLoading(true);
                setError("");

                const response =
                    await api.get(
                        `/appointments/store/doctor/${doctorId}`
                    );

                const data = response.data;

                if (Array.isArray(data)) {

                    setAppointments(data);

                    // Get doctor information from
                    // the first appointment
                    if (
                        data.length > 0 &&
                        data[0].doctor
                    ) {

                        setDoctor(
                            data[0].doctor
                        );

                    }

                } else {

                    setAppointments([]);

                }

            } catch (error) {

                console.error(
                    "Failed to load store appointments:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load appointments."
                );

            } finally {

                setLoading(false);

            }

        };

        fetchAppointments();

    }, [doctorId]);


    // ==========================================
    // STATUS CLASS
    // ==========================================

    const getStatusClass = (status) => {

        switch (status) {

            case "BOOKED":
                return "status-booked";

            case "COMPLETED":
                return "status-completed";

            case "CANCELLED":
                return "status-cancelled";

            case "ABSENT":
                return "status-absent";

            default:
                return "";

        }

    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (
            <>
                <Navbar />

                <div className="store-appointments-page">

                    <div className="store-appointments-container">

                        <h2>
                            Loading appointments...
                        </h2>

                    </div>

                </div>

                <Footer />
            </>
        );

    }


    // ==========================================
    // ERROR
    // ==========================================

    if (error) {

        return (
            <>
                <Navbar />

                <div className="store-appointments-page">

                    <div className="store-appointments-container">

                        <button
                            className="back-btn"
                            onClick={() =>
                                navigate(
                                    "/store-admin-dashboard"
                                )
                            }
                        >
                            ← Back to Dashboard
                        </button>

                        <div className="error-box">

                            <h2>
                                Unable to load appointments
                            </h2>

                            <p>
                                {error}
                            </p>

                        </div>

                    </div>

                </div>

                <Footer />
            </>
        );

    }


    return (
        <>
            <Navbar />

            <div className="store-appointments-page">

                <div className="store-appointments-container">


                    {/* ==========================================
                        BACK
                    ========================================== */}

                    <button
                        className="back-btn"
                        onClick={() =>
                            navigate(
                                "/store-admin-dashboard"
                            )
                        }
                    >
                        ← Back to Dashboard
                    </button>


                    {/* ==========================================
                        HEADER
                    ========================================== */}

                    <div className="appointments-header">

                        <div>

                            <h1>
                                Doctor Appointments
                            </h1>

                            {doctor && (

                                <p>
                                    Dr. {doctor.name}
                                    {" • "}
                                    {doctor.specialization ||
                                        "Medical Specialist"}
                                </p>

                            )}

                        </div>

                        <div className="appointment-count">

                            {appointments.length}

                            {" "}

                            {appointments.length === 1
                                ? "Appointment"
                                : "Appointments"}

                        </div>

                    </div>


                    {/* ==========================================
                        NO APPOINTMENTS
                    ========================================== */}

                    {appointments.length === 0 ? (

                        <div className="no-appointments">

                            <div className="empty-icon">
                                📅
                            </div>

                            <h2>
                                No appointments yet
                            </h2>

                            <p>
                                No patients have booked this
                                doctor at your medical store yet.
                            </p>

                        </div>

                    ) : (

                        /* ==========================================
                           APPOINTMENT LIST
                        ========================================== */

                        <div className="appointments-list">

                            {appointments.map(
                                (appointment) => (

                                    <div
                                        className="appointment-card"
                                        key={appointment.id}
                                    >

                                        {/* ==========================================
                                            PATIENT
                                        ========================================== */}

                                        <div className="patient-section">

                                            <div className="patient-avatar">
                                                👤
                                            </div>

                                            <div>

                                                <h3>
                                                    {appointment.patientName ||
                                                        appointment.user?.name ||
                                                        "Unknown Patient"}
                                                </h3>

                                                <p>
                                                    Patient
                                                </p>

                                            </div>

                                        </div>


                                        {/* ==========================================
                                            DETAILS
                                        ========================================== */}

                                        <div className="appointment-details">

                                            <div className="detail">

                                                <span>
                                                    📞
                                                </span>

                                                <div>

                                                    <small>
                                                        Phone
                                                    </small>

                                                    <strong>
                                                        {appointment.phone ||
                                                            appointment.user?.phone ||
                                                            "Not available"}
                                                    </strong>

                                                </div>

                                            </div>


                                            <div className="detail">

                                                <span>
                                                    📅
                                                </span>

                                                <div>

                                                    <small>
                                                        Date
                                                    </small>

                                                    <strong>
                                                        {appointment.appointmentDate}
                                                    </strong>

                                                </div>

                                            </div>


                                            <div className="detail">

                                                <span>
                                                    🕒
                                                </span>

                                                <div>

                                                    <small>
                                                        Time
                                                    </small>

                                                    <strong>
                                                        {appointment.appointmentTime}
                                                    </strong>

                                                </div>

                                            </div>


                                            <div className="detail">

                                                <span>
                                                    📌
                                                </span>

                                                <div>

                                                    <small>
                                                        Status
                                                    </small>

                                                    <strong
                                                        className={
                                                            getStatusClass(
                                                                appointment.status
                                                            )
                                                        }
                                                    >
                                                        {appointment.status}
                                                    </strong>

                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </div>

            </div>

            <Footer />
        </>
    );
}

export default StoreDoctorAppointments;