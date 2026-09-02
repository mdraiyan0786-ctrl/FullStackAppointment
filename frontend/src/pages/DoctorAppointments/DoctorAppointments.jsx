import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import "./DoctorAppointments.css";

function DoctorAppointments() {

    // =========================
    // NAVIGATION
    // =========================

    const navigate = useNavigate();

    // =========================
    // STATES
    // =========================

    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [prescriptionOpen, setPrescriptionOpen] = useState(null);
    const [prescriptionText, setPrescriptionText] = useState("");
    const [savingPrescription, setSavingPrescription] = useState(false);

    // =========================
    // FETCH DOCTOR APPOINTMENTS
    // =========================

    const fetchAppointments = async () => {
        try {

            const response = await api.get(
                "/appointments/doctor"
            );

            setAppointments(response.data);
            setError("");

        } catch (error) {

            console.error(
                "Failed to fetch doctor appointments:",
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

    // =========================
    // LOAD APPOINTMENTS
    // =========================

    useEffect(() => {
        fetchAppointments();
    }, []);

    // =========================
    // COMPLETE APPOINTMENT
    // =========================

    const handleComplete = async (id) => {

        const confirmComplete = window.confirm(
            "Are you sure you want to complete this appointment?"
        );

        if (!confirmComplete) {
            return;
        }

        try {

            await api.put(
                `/appointments/${id}/complete`
            );

            setAppointments(
                (previousAppointments) =>
                    previousAppointments.map(
                        (appointment) =>
                            appointment.id === id
                                ? {
                                      ...appointment,
                                      status: "COMPLETED"
                                  }
                                : appointment
                    )
            );

            alert(
                "Appointment completed successfully."
            );

        } catch (error) {

            console.error(
                "Failed to complete appointment:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to complete appointment."
            );
        }
    };

    // =========================
    // CANCEL APPOINTMENT
    // =========================

    const handleCancel = async (id) => {

        const confirmCancel = window.confirm(
            "Are you sure you want to cancel this appointment?"
        );

        if (!confirmCancel) {
            return;
        }

        try {

            await api.put(
                `/appointments/${id}/cancel`
            );

            setAppointments(
                (previousAppointments) =>
                    previousAppointments.map(
                        (appointment) =>
                            appointment.id === id
                                ? {
                                      ...appointment,
                                      status: "CANCELLED"
                                  }
                                : appointment
                    )
            );

            alert(
                "Appointment cancelled successfully."
            );

        } catch (error) {

            console.error(
                "Failed to cancel appointment:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to cancel appointment."
            );
        }
    };

    // =========================
    // MARK APPOINTMENT ABSENT
    // =========================

    const handleAbsent = async (id) => {

        const confirmAbsent = window.confirm(
            "Are you sure you want to mark this patient as absent?"
        );

        if (!confirmAbsent) {
            return;
        }

        try {

            await api.put(
                `/appointments/${id}/absent`
            );

            setAppointments(
                (previousAppointments) =>
                    previousAppointments.map(
                        (appointment) =>
                            appointment.id === id
                                ? {
                                      ...appointment,
                                      status: "ABSENT"
                                  }
                                : appointment
                    )
            );

            alert(
                "Patient marked as absent successfully."
            );

        } catch (error) {

            console.error(
                "Failed to mark patient absent:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to mark patient absent."
            );
        }
    };

    // =========================
    // OPEN PRESCRIPTION
    // =========================

    const handleOpenPrescription = (appointment) => {

        setPrescriptionOpen(
            appointment.id
        );

        setPrescriptionText(
            appointment.prescriptionText || ""
        );

        setError("");
    };

    // =========================
    // CLOSE PRESCRIPTION
    // =========================

    const handleClosePrescription = () => {

        setPrescriptionOpen(null);
        setPrescriptionText("");
        setError("");
    };

    // =========================
    // SAVE PRESCRIPTION
    // =========================

    const handleSavePrescription = async (id) => {

        if (!prescriptionText.trim()) {

            setError(
                "Prescription cannot be empty."
            );

            return;
        }

        setSavingPrescription(true);
        setError("");

        try {

            const response = await api.put(
                `/appointments/${id}/prescription`,
                {
                    prescriptionText:
                        prescriptionText.trim()
                }
            );

            const updatedAppointment =
                response.data;

            setAppointments(
                (previousAppointments) =>
                    previousAppointments.map(
                        (appointment) =>
                            appointment.id === id
                                ? {
                                      ...appointment,

                                      prescriptionText:
                                          updatedAppointment.prescriptionText,

                                      status:
                                          updatedAppointment.status
                                  }
                                : appointment
                    )
            );

            setPrescriptionOpen(null);
            setPrescriptionText("");

            alert(
                "Prescription saved successfully. Appointment completed."
            );

        } catch (error) {

            console.error(
                "Failed to save prescription:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to save prescription."
            );

        } finally {

            setSavingPrescription(false);

        }
    };

    // =========================
    // MEDICAL HISTORY
    // =========================

    const handleMedicalHistory = (appointment) => {

        console.log(
            "History clicked:",
            appointment.user?.id
        );

        if (!appointment.user?.id) {

            alert(
                "Patient information is not available."
            );

            return;
        }

        navigate(
            `/doctor/patient/${appointment.user.id}/medical-history`
        );
    };

    // =========================
    // LOADING
    // =========================

    if (loading) {

        return (
            <div className="doctor-appointments-page">

                <div className="loading-message">
                    Loading appointments...
                </div>

            </div>
        );
    }

    // =========================
    // ERROR
    // =========================

    if (error && appointments.length === 0) {

        return (
            <div className="doctor-appointments-page">

                <div className="error-message">
                    {error}
                </div>

            </div>
        );
    }

    // =========================
    // PAGE
    // =========================

    return (
        <div className="doctor-appointments-page">

            {/* =========================
                HEADER
            ========================= */}

            <div className="doctor-appointments-header">

                <h1>
                    My Appointments
                </h1>

                <p>
                    Manage your patient appointments
                </p>

            </div>

            {/* =========================
                NO APPOINTMENTS
            ========================= */}

            {appointments.length === 0 ? (

                <div className="no-appointments">

                    <div className="no-appointments-icon">
                        📅
                    </div>

                    <h2>
                        No Appointments
                    </h2>

                    <p>
                        You don't have any appointments yet.
                    </p>

                </div>

            ) : (

                <div className="doctor-appointments-container">

                    {appointments.map(
                        (appointment) => (

                            <div
                                className="doctor-appointment-card"
                                key={appointment.id}
                            >

                                {/* =========================
                                    CARD HEADER
                                ========================= */}

                                <div className="appointment-card-header">

                                    <div>

                                        <h2>
                                            {
                                                appointment.patientName
                                            }
                                        </h2>

                                        <span className="appointment-id">
                                            Appointment #
                                            {appointment.id}
                                        </span>

                                    </div>

                                    <span
                                        className={`appointment-status ${
                                            appointment.status ===
                                            "BOOKED"
                                                ? "status-booked"
                                                : appointment.status ===
                                                  "CANCELLED"
                                                ? "status-cancelled"
                                                : appointment.status ===
                                                  "ABSENT"
                                                ? "status-absent"
                                                : "status-completed"
                                        }`}
                                    >
                                        {appointment.status}
                                    </span>

                                </div>

                                {/* =========================
                                    PATIENT DETAILS
                                ========================= */}

                                <div className="patient-details">

                                    <div className="detail-item">

                                        <span className="detail-label">
                                            Age
                                        </span>

                                        <span className="detail-value">
                                            {appointment.age}
                                        </span>

                                    </div>

                                    <div className="detail-item">

                                        <span className="detail-label">
                                            Gender
                                        </span>

                                        <span className="detail-value">
                                            {appointment.gender}
                                        </span>

                                    </div>

                                    <div className="detail-item">

                                        <span className="detail-label">
                                            Phone
                                        </span>

                                        <span className="detail-value">
                                            {appointment.phone}
                                        </span>

                                    </div>

                                </div>

                                {/* =========================
                                    APPOINTMENT DATE / TIME
                                ========================= */}

                                <div className="appointment-info">

                                    <div className="appointment-info-item">

                                        <span className="info-icon">
                                            📅
                                        </span>

                                        <div>

                                            <span className="info-label">
                                                Date
                                            </span>

                                            <strong>
                                                {
                                                    appointment.appointmentDate
                                                }
                                            </strong>

                                        </div>

                                    </div>

                                    <div className="appointment-info-item">

                                        <span className="info-icon">
                                            🕐
                                        </span>

                                        <div>

                                            <span className="info-label">
                                                Time
                                            </span>

                                            <strong>
                                                {
                                                    appointment.appointmentTime
                                                }
                                            </strong>

                                        </div>

                                    </div>

                                </div>

                                {/* =========================
                                    PRESCRIPTION
                                ========================= */}

                                <div className="doctor-prescription-section">

                                    {prescriptionOpen ===
                                    appointment.id ? (

                                        <div className="prescription-editor">

                                            <h3>
                                                Write Prescription
                                            </h3>

                                            <textarea
                                                value={
                                                    prescriptionText
                                                }
                                                onChange={(e) =>
                                                    setPrescriptionText(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Write prescription and instructions here..."
                                                rows="8"
                                            />

                                            {error && (
                                                <p className="error-message">
                                                    {error}
                                                </p>
                                            )}

                                            <div className="prescription-actions">

                                                <button
                                                    className="save-prescription-btn"
                                                    onClick={() =>
                                                        handleSavePrescription(
                                                            appointment.id
                                                        )
                                                    }
                                                    disabled={
                                                        savingPrescription
                                                    }
                                                >
                                                    {savingPrescription
                                                        ? "Saving..."
                                                        : "Save Prescription"}
                                                </button>

                                                <button
                                                    className="cancel-prescription-btn"
                                                    onClick={
                                                        handleClosePrescription
                                                    }
                                                    disabled={
                                                        savingPrescription
                                                    }
                                                >
                                                    Cancel
                                                </button>

                                            </div>

                                        </div>

                                    ) : (

                                        <div className="prescription-display">

                                            <div className="prescription-header">

                                                <h3>
                                                    Prescription
                                                </h3>

                                                <button
                                                    className="write-prescription-btn"
                                                    onClick={() =>
                                                        handleOpenPrescription(
                                                            appointment
                                                        )
                                                    }
                                                >
                                                    {
                                                        appointment.prescriptionText
                                                            ? "Edit Prescription"
                                                            : "Write Prescription"
                                                    }
                                                </button>

                                            </div>

                                            {appointment.prescriptionText && (

                                                <div className="prescription-text">
                                                    {
                                                        appointment.prescriptionText
                                                    }
                                                </div>

                                            )}

                                            {!appointment.prescriptionText && (

                                                <p className="no-prescription">
                                                    No prescription added yet.
                                                </p>

                                            )}

                                        </div>

                                    )}

                                </div>

                                {/* =========================
                                    APPOINTMENT ACTIONS
                                ========================= */}

                                {appointment.status === "BOOKED" && (

                                    <div className="doctor-appointment-actions">

                                        {/* COMPLETE */}

                                        <button
                                            className="complete-btn"
                                            onClick={() =>
                                                handleComplete(
                                                    appointment.id
                                                )
                                            }
                                        >
                                            ✓ Complete
                                        </button>

                                        {/* CANCEL */}

                                        <button
                                            className="cancel-btn"
                                            onClick={() =>
                                                handleCancel(
                                                    appointment.id
                                                )
                                            }
                                        >
                                            ✕ Cancel
                                        </button>

                                        {/* ABSENT */}

                                        <button
                                            className="absent-btn"
                                            onClick={() =>
                                                handleAbsent(
                                                    appointment.id
                                                )
                                            }
                                        >
                                            👤 Patient Absent
                                        </button>

                                        {/* MEDICAL HISTORY */}

                                        <button
                                            className="medical-history-btn"
                                            onClick={() =>
                                                handleMedicalHistory(
                                                    appointment
                                                )
                                            }
                                        >
                                            🩺 Medical History
                                        </button>

                                    </div>

                                )}

                            </div>

                        )
                    )}

                </div>

            )}

        </div>
    );
}

export default DoctorAppointments;