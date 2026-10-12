
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

    useEffect(() => {
        let cancelled = false;

        const fetchData = async () => {
            setLoading(true);
            setError("");
            setAppointments([]);
            setDoctor(null);

            try {
                // Fetch appointments for this doctor at this store.
                const response = await api.get(
                    `/appointments/store/doctor/${doctorId}`
                );

                if (cancelled) return;

                if (Array.isArray(response.data)) {
                    setAppointments(response.data);

                    // Use appointment data as a fallback for doctor details.
                    if (response.data.length > 0 && response.data[0].doctor) {
                        setDoctor(response.data[0].doctor);
                    }
                } else {
                    setAppointments([]);
                }
            } catch (err) {
                if (cancelled) return;

                console.error("Failed to load store appointments:", err);

                setError(
                    err.response?.data?.message ||
                    "Failed to load appointments. Please try again."
                );
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }

            // Fetch doctor details independently so they appear even
            // when there are no appointments.
            try {
                const doctorResponse = await api.get(
                    `/doctors/${doctorId}`
                );

                if (cancelled) return;

                const doctorData =
                    doctorResponse.data?.doctor ?? doctorResponse.data;

                if (doctorData && doctorData.id) {
                    setDoctor(doctorData);
                }
            } catch (err) {
                // Appointment data may already contain doctor details.
                console.warn(
                    "Could not load separate doctor details:",
                    err
                );
            }
        };

        fetchData();

        return () => {
            cancelled = true;
        };
    }, [doctorId]);

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

    const handleBack = () => {
        navigate("/store-admin-dashboard");
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <main className="store-appointments-page">
                    <div className="store-appointments-container">
                        <p>Loading appointments...</p>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navbar />
                <main className="store-appointments-page">
                    <div className="store-appointments-container">
                        <button className="back-btn" onClick={handleBack}>
                            ← Back to Dashboard
                        </button>

                        <div className="error-box">
                            <h2>Unable to load appointments</h2>
                            <p>{error}</p>
                            <button
                                className="back-btn"
                                onClick={() => window.location.reload()}
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />

            <main className="store-appointments-page">
                <div className="store-appointments-container">
                    <button className="back-btn" onClick={handleBack}>
                        ← Back to Dashboard
                    </button>

                    <div className="appointments-header">
                        <div>
                            <h1>Doctor Appointments</h1>

                            <p>
                                {doctor
                                    ? `Dr. ${doctor.name || "Doctor"} • ${
                                          doctor.specialization ||
                                          "Medical Specialist"
                                      }`
                                    : `Doctor ID: ${doctorId}`}
                            </p>
                        </div>

                        <div className="appointment-count">
                            {appointments.length}{" "}
                            {appointments.length === 1
                                ? "Appointment"
                                : "Appointments"}
                        </div>
                    </div>

                    {appointments.length === 0 ? (
                        <div className="no-appointments">
                            <div className="empty-icon">📅</div>
                            <h2>No appointments yet</h2>
                            <p>
                                No patients have booked this doctor at your
                                medical store yet.
                            </p>
                        </div>
                    ) : (
                        <div className="appointments-list">
                            {appointments.map((appointment) => (
                                <div
                                    className="appointment-card"
                                    key={appointment.id}
                                >
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
                                            <p>Patient</p>
                                        </div>
                                    </div>

                                    <div className="appointment-details">
                                        <div className="detail">
                                            <span>📞</span>
                                            <div>
                                                <small>Phone</small>
                                                <strong>
                                                    {appointment.phone ||
                                                        appointment.user?.phone ||
                                                        "Not available"}
                                                </strong>
                                            </div>
                                        </div>

                                        <div className="detail">
                                            <span>📅</span>
                                            <div>
                                                <small>Date</small>
                                                <strong>
                                                    {appointment.appointmentDate ||
                                                        "Not available"}
                                                </strong>
                                            </div>
                                        </div>

                                        <div className="detail">
                                            <span>🕒</span>
                                            <div>
                                                <small>Time</small>
                                                <strong>
                                                    {appointment.appointmentTime ||
                                                        "Not available"}
                                                </strong>
                                            </div>
                                        </div>

                                        <div className="detail">
                                            <span>📌</span>
                                            <div>
                                                <small>Status</small>
                                                <strong
                                                    className={getStatusClass(
                                                        appointment.status
                                                    )}
                                                >
                                                    {appointment.status ||
                                                        "UNKNOWN"}
                                                </strong>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </>
    );
}

export default StoreDoctorAppointments;
