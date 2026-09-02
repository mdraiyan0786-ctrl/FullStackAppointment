import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../component/Navbar/Navbar";
import Footer from "../../component/Footer/Footer";
import api from "../../api/api";
import "./MedicalHistory.css";

function MedicalHistory() {

    const navigate = useNavigate();

    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const fetchMedicalHistory = async () => {

            try {

                const response =
                    await api.get(
                        "/appointments/medical-history"
                    );

                setHistory(response.data);
                setError("");

            } catch (error) {

                console.error(
                    "Medical history error:",
                    error
                );

                if (error.response?.status === 401) {

                    localStorage.removeItem("token");

                    alert(
                        "Session expired. Please login again."
                    );

                    navigate("/login");

                    return;
                }

                setError(
                    error.response?.data?.message ||
                    "Failed to load medical history."
                );

            } finally {

                setLoading(false);
            }
        };

        fetchMedicalHistory();

    }, [navigate]);


    // =========================
    // LOADING
    // =========================

    if (loading) {

        return (
            <>
                <Navbar />

                <div className="medical-history-page">

                    <div className="medical-history-loading">
                        Loading medical history...
                    </div>

                </div>

                <Footer />
            </>
        );
    }


    // =========================
    // ERROR
    // =========================

    if (error) {

        return (
            <>
                <Navbar />

                <div className="medical-history-page">

                    <div className="medical-history-error">
                        {error}
                    </div>

                </div>

                <Footer />
            </>
        );
    }


    return (
        <>
            <Navbar />

            <div className="medical-history-page">

                <div className="medical-history-wrapper">

                    {/* =========================
                        HEADER
                    ========================= */}

                    <div className="medical-history-header">

                        <h1>
                            Medical History
                        </h1>

                        <p>
                            View your previous consultations
                            and prescriptions
                        </p>

                    </div>


                    {/* =========================
                        EMPTY STATE
                    ========================= */}

                    {history.length === 0 ? (

                        <div className="medical-history-empty">

                            <div className="empty-icon">
                                🩺
                            </div>

                            <h2>
                                No Medical History
                            </h2>

                            <p>
                                Your completed consultations
                                will appear here.
                            </p>

                        </div>

                    ) : (

                        <div className="medical-history-list">

                            {history.map(
                                (appointment) => (

                                    <div
                                        className="medical-history-card"
                                        key={appointment.id}
                                    >

                                        {/* =========================
                                            CARD HEADER
                                        ========================= */}

                                        <div className="history-card-header">

                                            <div>

                                                <h2>
                                                    Dr.{" "}
                                                    {
                                                        appointment.doctor?.name ||
                                                        "Doctor"
                                                    }
                                                </h2>

                                                <p>
                                                    {
                                                        appointment.doctor?.specialization ||
                                                        "Medical Consultation"
                                                    }
                                                </p>

                                            </div>

                                            <span className="completed-badge">
                                                COMPLETED
                                            </span>

                                        </div>


                                        {/* =========================
                                            APPOINTMENT DETAILS
                                        ========================= */}

                                        <div className="history-details">

                                            <div>

                                                <span>
                                                    Date
                                                </span>

                                                <strong>
                                                    {
                                                        appointment.appointmentDate
                                                    }
                                                </strong>

                                            </div>

                                            <div>

                                                <span>
                                                    Time
                                                </span>

                                                <strong>
                                                    {
                                                        appointment.appointmentTime
                                                    }
                                                </strong>

                                            </div>

                                            <div>

                                                <span>
                                                    Patient
                                                </span>

                                                <strong>
                                                    {
                                                        appointment.patientName
                                                    }
                                                </strong>

                                            </div>

                                        </div>


                                        {/* =========================
                                            PRESCRIPTION
                                        ========================= */}

                                        {appointment.prescriptionText && (

                                            <div className="history-prescription">

                                                <h3>
                                                    📄 Prescription
                                                </h3>

                                                <div className="prescription-text">

                                                    {
                                                        appointment.prescriptionText
                                                    }

                                                </div>

                                            </div>

                                        )}


                                        {/* =========================
                                            PRESCRIPTION FILE
                                        ========================= */}

                                        {appointment.prescriptionFileUrl && (

                                            <div className="history-file">

                                                <a
                                                    href={`http://localhost:8080${appointment.prescriptionFileUrl}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    📎 View Prescription File
                                                </a>

                                            </div>

                                        )}

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

export default MedicalHistory;