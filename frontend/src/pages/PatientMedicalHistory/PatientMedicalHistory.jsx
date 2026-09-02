import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../component/Navbar/Navbar";
import Footer from "../../component/Footer/Footer";
import api from "../../api/api";
import "./PatientMedicalHistory.css";

function PatientMedicalHistory() {

    const { patientId } = useParams();
    const navigate = useNavigate();

    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ==========================================
    // FETCH PATIENT MEDICAL HISTORY
    // ==========================================

    useEffect(() => {

        const fetchMedicalHistory = async () => {

            try {

                const response =
                    await api.get(
                        `/appointments/doctor/patient/${patientId}/medical-history`
                    );

                console.log(
                    "Patient medical history:",
                    response.data
                );

                setHistory(response.data);
                setError("");

            } catch (error) {

                console.error(
                    "Medical history error:",
                    error
                );

                if (error.response?.status === 401) {

                    localStorage.removeItem("doctorToken");
                    localStorage.removeItem("doctorInfo");

                    alert(
                        "Session expired. Please login again."
                    );

                    navigate("/doctor-login");

                    return;
                }

                if (error.response?.status === 403) {

                    setError(
                        error.response?.data?.message ||
                        "You are not authorized to view this patient's medical history."
                    );

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

    }, [patientId, navigate]);


    // ==========================================
    // LOADING
    // ==========================================

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


    // ==========================================
    // ERROR
    // ==========================================

    if (error) {

        return (
            <>
                <Navbar />

                <div className="medical-history-page">

                    <div className="medical-history-error">

                        <div className="history-error-icon">
                            ⚠️
                        </div>

                        <h2>
                            Unable to Load History
                        </h2>

                        <p>
                            {error}
                        </p>

                        <button
                            onClick={() =>
                                navigate(-1)
                            }
                        >
                            ← Go Back
                        </button>

                    </div>

                </div>

                <Footer />
            </>
        );
    }


    // ==========================================
    // GET PATIENT INFORMATION
    // ==========================================

    const patient =
        history.length > 0
            ? history[0]
            : null;


    return (
        <>
            <Navbar />

            <div className="medical-history-page">

                <div className="medical-history-wrapper">

                    {/* ==========================================
                        BACK BUTTON
                    ========================================== */}

                    <button
                        className="history-back-btn"
                        onClick={() =>
                            navigate(-1)
                        }
                    >
                        ← Back to Appointments
                    </button>


                    {/* ==========================================
                        HEADER
                    ========================================== */}

                    <div className="medical-history-header">

                        <div className="history-header-icon">
                            🩺
                        </div>

                        <div>

                            <h1>
                                Patient Medical History
                            </h1>

                            <p>
                                Review previous completed consultations
                            </p>

                        </div>

                    </div>


                    {/* ==========================================
                        PATIENT INFORMATION
                    ========================================== */}

                    {patient && (

                        <div className="patient-summary-card">

                            <div className="patient-summary-avatar">

                                {patient.patientName
                                    ?.charAt(0)
                                    ?.toUpperCase()}

                            </div>

                            <div className="patient-summary-info">

                                <h2>
                                    {patient.patientName}
                                </h2>

                                <div className="patient-summary-details">

                                    {patient.age != null && (

                                        <span>
                                            Age: {patient.age}
                                        </span>

                                    )}

                                    {patient.gender && (

                                        <span>
                                            Gender: {patient.gender}
                                        </span>

                                    )}

                                    {patient.phone && (

                                        <span>
                                            Phone: {patient.phone}
                                        </span>

                                    )}

                                </div>

                            </div>

                        </div>

                    )}


                    {/* ==========================================
                        NO HISTORY
                    ========================================== */}

                    {history.length === 0 ? (

                        <div className="no-medical-history">

                            <div className="no-history-icon">
                                📋
                            </div>

                            <h2>
                                No Medical History
                            </h2>

                            <p>
                                This patient has no completed
                                consultations yet.
                            </p>

                        </div>

                    ) : (

                        <>
                            {/* ==========================================
                                HISTORY COUNT
                            ========================================== */}

                            <div className="history-count">

                                <strong>
                                    {history.length}
                                </strong>

                                <span>
                                    Completed Consultation
                                    {history.length !== 1
                                        ? "s"
                                        : ""}
                                </span>

                            </div>


                            {/* ==========================================
                                HISTORY LIST
                            ========================================== */}

                            <div className="medical-history-list">

                                {history.map(
                                    (appointment) => (

                                        <div
                                            className="medical-history-card"
                                            key={appointment.id}
                                        >

                                            {/* HEADER */}

                                            <div className="history-card-header">

                                                <div>

                                                    <h2>
                                                        Consultation
                                                    </h2>

                                                    <p>
                                                        Appointment #
                                                        {
                                                            appointment.id
                                                        }
                                                    </p>

                                                </div>

                                                <span className="history-completed-badge">
                                                    ✓ COMPLETED
                                                </span>

                                            </div>


                                            {/* DETAILS */}

                                            <div className="history-details">

                                                <div className="history-detail">

                                                    <span>
                                                        Date
                                                    </span>

                                                    <strong>
                                                        {
                                                            appointment.appointmentDate
                                                        }
                                                    </strong>

                                                </div>


                                                <div className="history-detail">

                                                    <span>
                                                        Time
                                                    </span>

                                                    <strong>
                                                        {
                                                            appointment.appointmentTime
                                                        }
                                                    </strong>

                                                </div>


                                                <div className="history-detail">

                                                    <span>
                                                        Doctor
                                                    </span>

                                                    <strong>
                                                        Dr.{" "}
                                                        {
                                                            appointment.doctor?.name ||
                                                            "Doctor"
                                                        }
                                                    </strong>

                                                </div>


                                                <div className="history-detail">

                                                    <span>
                                                        Specialization
                                                    </span>

                                                    <strong>
                                                        {
                                                            appointment.doctor
                                                                ?.specialization ||
                                                            "N/A"
                                                        }
                                                    </strong>

                                                </div>

                                            </div>


                                            {/* ==========================================
                                                PRESCRIPTION
                                            ========================================== */}

                                            {appointment.prescriptionText && (

                                                <div className="history-prescription">

                                                    <div className="prescription-heading">

                                                        <span>
                                                            📄
                                                        </span>

                                                        <h3>
                                                            Prescription
                                                        </h3>

                                                    </div>

                                                    <div className="prescription-text">

                                                        {
                                                            appointment.prescriptionText
                                                        }

                                                    </div>

                                                </div>

                                            )}


                                            {/* ==========================================
                                                PRESCRIPTION FILE
                                            ========================================== */}

                                            {appointment.prescriptionFileUrl && (

                                                <div className="history-file-section">

                                                    <a
                                                        href={
                                                            `http://localhost:8080${appointment.prescriptionFileUrl}`
                                                        }
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="view-prescription-file"
                                                    >
                                                        📎 View Prescription File
                                                    </a>

                                                </div>

                                            )}

                                        </div>

                                    )
                                )}

                            </div>

                        </>
                    )}

                </div>

            </div>

            <Footer />
        </>
    );
}

export default PatientMedicalHistory;