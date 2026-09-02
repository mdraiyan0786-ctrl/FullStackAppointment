import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../component/Navbar/Navbar";
import Footer from "../../component/Footer/Footer";
import api from "../../api/api";
import "./MyAppointments.css";

function MyAppointments() {

    const navigate = useNavigate();

    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    // ==========================================
    // PRESCRIPTION STATE
    // ==========================================

    const [selectedPrescription, setSelectedPrescription] =
        useState(null);


    // ==========================================
    // RATING STATE
    // ==========================================

    const [selectedRatingAppointment, setSelectedRatingAppointment] =
        useState(null);

    const [rating, setRating] = useState(0);

    const [comment, setComment] = useState("");

    const [submittingRating, setSubmittingRating] =
        useState(false);


    // ==========================================
    // FETCH APPOINTMENTS
    // ==========================================

    useEffect(() => {

        const fetchAppointments = async () => {

            try {

                const response =
                    await api.get("/appointments/my");

                console.log(
                    "My appointments:",
                    response.data
                );

                setAppointments(response.data);

            } catch (error) {

                console.error(
                    "Appointments error:",
                    error
                );

                if (error.response?.status === 401) {

                    localStorage.removeItem("token");

                    alert(
                        "Session expired. Please login again."
                    );

                    navigate("/login");
                }

            } finally {

                setLoading(false);

            }
        };

        fetchAppointments();

    }, [navigate]);


    // ==========================================
    // CANCEL APPOINTMENT
    // ==========================================

    const handleCancel = async (id) => {

        const confirmCancel =
            window.confirm(
                "Are you sure you want to cancel this appointment?"
            );

        if (!confirmCancel) {
            return;
        }

        try {

            await api.delete(
                `/appointments/${id}`
            );

            alert(
                "Appointment cancelled successfully."
            );

            setAppointments(
                prevAppointments =>
                    prevAppointments.map(
                        appointment =>
                            appointment.id === id
                                ? {
                                    ...appointment,
                                    status: "CANCELLED"
                                }
                                : appointment
                    )
            );

        } catch (error) {

            console.error(
                "Cancel error:",
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

            const message =
                error.response?.data?.message ||
                error.response?.data ||
                "Failed to cancel appointment.";

            alert(message);
        }
    };


    // ==========================================
    // OPEN PRESCRIPTION
    // ==========================================

    const handlePrescription = (appointment) => {

        setSelectedPrescription(appointment);

    };


    // ==========================================
    // CLOSE PRESCRIPTION
    // ==========================================

    const closePrescription = () => {

        setSelectedPrescription(null);

    };


    // ==========================================
    // OPEN RATING MODAL
    // ==========================================

    const handleOpenRating = (appointment) => {

        setSelectedRatingAppointment(appointment);

        setRating(0);

        setComment("");

    };


    // ==========================================
    // CLOSE RATING MODAL
    // ==========================================

    const closeRating = () => {

        if (submittingRating) {
            return;
        }

        setSelectedRatingAppointment(null);

        setRating(0);

        setComment("");

    };


    // ==========================================
    // SUBMIT RATING
    // ==========================================

    const handleSubmitRating = async () => {

        if (!selectedRatingAppointment) {
            return;
        }

        if (rating < 1 || rating > 5) {

            alert(
                "Please select a rating from 1 to 5."
            );

            return;
        }

        try {

            setSubmittingRating(true);

            const response =
                await api.post(
                    `/reviews/appointment/${selectedRatingAppointment.id}`,
                    {
                        rating: rating,
                        comment: comment.trim()
                    }
                );

            console.log(
                "Review submitted:",
                response.data
            );

            alert(
                "Thank you for rating the doctor!"
            );

            closeRating();

        } catch (error) {

            console.error(
                "Rating error:",
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

            const message =
                error.response?.data?.message ||
                error.response?.data ||
                "Failed to submit rating.";

            alert(message);

        } finally {

            setSubmittingRating(false);

        }
    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (
            <>
                <Navbar />

                <div className="appointments-container">

                    <div className="loading">
                        Loading appointments...
                    </div>

                </div>

                <Footer />
            </>
        );
    }


    // ==========================================
    // PAGE
    // ==========================================

    return (
        <>
            <Navbar />

            <div className="appointments-container">

                <div className="appointments-wrapper">

                    {/* ==========================================
                        HEADING
                    ========================================== */}

                    <div className="appointments-heading">

                        <h1>
                            My Appointments
                        </h1>

                        <p>
                            View and manage your upcoming and past
                            appointments
                        </p>

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
                                No Appointments
                            </h2>

                            <p>
                                You don't have any appointments yet.
                            </p>

                            <button
                                onClick={() =>
                                    navigate("/doctors")
                                }
                            >
                                Find a Doctor
                            </button>

                        </div>

                    ) : (

                        <div className="appointments-list">

                            {appointments.map(
                                (appointment) => (

                                    <div
                                        className="appointment-card"
                                        key={appointment.id}
                                    >

                                        {/* ==========================================
                                            HEADER
                                        ========================================== */}

                                        <div className="appointment-header">

                                            <div>

                                                <h2>
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

                                            <span
                                                className={`status ${appointment.status?.toLowerCase()}`}
                                            >
                                                {
                                                    appointment.status
                                                }
                                            </span>

                                        </div>


                                        {/* ==========================================
                                            DETAILS
                                        ========================================== */}

                                        <div className="appointment-details">

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


                                        {/* ==========================================
                                            ACTIONS
                                        ========================================== */}

                                        <div className="appointment-actions">


                                            {/* ==========================================
                                                RESCHEDULE
                                            ========================================== */}

                                            {appointment.status ===
                                                "BOOKED" && (

                                                <button
                                                    className="reschedule-btn"
                                                    onClick={() =>
                                                        navigate(
                                                            `/reschedule-appointment/${appointment.id}`
                                                        )
                                                    }
                                                >
                                                    📅 Reschedule
                                                </button>

                                            )}


                                            {/* ==========================================
                                                CANCEL
                                            ========================================== */}

                                            {appointment.status !==
                                                "CANCELLED" &&
                                                appointment.status !==
                                                "COMPLETED" &&
                                                appointment.status !==
                                                "ABSENT" && (

                                                    <button
                                                        className="cancel-btn"
                                                        onClick={() =>
                                                            handleCancel(
                                                                appointment.id
                                                            )
                                                        }
                                                    >
                                                        Cancel Appointment
                                                    </button>

                                                )}


                                            {/* ==========================================
                                                PRESCRIPTION
                                            ========================================== */}

                                            {appointment.status ===
                                                "COMPLETED" &&
                                                appointment.prescriptionText && (

                                                    <button
                                                        className="prescription-btn"
                                                        onClick={() =>
                                                            handlePrescription(
                                                                appointment
                                                            )
                                                        }
                                                    >
                                                        📄 Prescription
                                                    </button>

                                                )}


                                            {/* ==========================================
                                                RATE DOCTOR
                                            ========================================== */}

                                            {appointment.status ===
                                                "COMPLETED" && (

                                                    <button
                                                        className="rating-btn"
                                                        onClick={() =>
                                                            handleOpenRating(
                                                                appointment
                                                            )
                                                        }
                                                    >
                                                        ⭐ Rate Doctor
                                                    </button>

                                                )}

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </div>

            </div>


            {/* ==========================================
                PRESCRIPTION MODAL
            ========================================== */}

            {selectedPrescription && (

                <div
                    className="prescription-modal-overlay"
                    onClick={closePrescription}
                >

                    <div
                        className="prescription-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        {/* HEADER */}

                        <div className="prescription-modal-header">

                            <div>

                                <h2>
                                    Prescription
                                </h2>

                                <p>
                                    Dr.{" "}
                                    {
                                        selectedPrescription
                                            .doctor?.name ||
                                        "Doctor"
                                    }
                                </p>

                            </div>

                            <button
                                className="prescription-close-btn"
                                onClick={
                                    closePrescription
                                }
                            >
                                ×
                            </button>

                        </div>


                        {/* CONTENT */}

                        <div className="prescription-modal-content">

                            <div className="prescription-info">

                                <span>
                                    Patient
                                </span>

                                <strong>
                                    {
                                        selectedPrescription
                                            .patientName
                                    }
                                </strong>

                            </div>


                            <div className="prescription-info">

                                <span>
                                    Appointment Date
                                </span>

                                <strong>
                                    {
                                        selectedPrescription
                                            .appointmentDate
                                    }
                                </strong>

                            </div>


                            <div className="prescription-divider" />


                            <h3>
                                Doctor's Prescription
                            </h3>


                            <div className="prescription-content">

                                {
                                    selectedPrescription
                                        .prescriptionText
                                }

                            </div>

                        </div>


                        {/* FOOTER */}

                        <div className="prescription-modal-footer">

                            <button
                                onClick={
                                    closePrescription
                                }
                            >
                                Close
                            </button>

                        </div>

                    </div>

                </div>

            )}


            {/* ==========================================
                RATING MODAL
            ========================================== */}

            {selectedRatingAppointment && (

                <div
                    className="rating-modal-overlay"
                    onClick={closeRating}
                >

                    <div
                        className="rating-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        {/* HEADER */}

                        <div className="rating-modal-header">

                            <div>

                                <h2>
                                    Rate Doctor
                                </h2>

                                <p>
                                    Dr.{" "}
                                    {
                                        selectedRatingAppointment
                                            .doctor?.name ||
                                        "Doctor"
                                    }
                                </p>

                            </div>


                            <button
                                className="rating-close-btn"
                                onClick={closeRating}
                                disabled={
                                    submittingRating
                                }
                            >
                                ×
                            </button>

                        </div>


                        {/* CONTENT */}

                        <div className="rating-modal-content">

                            <p className="rating-question">
                                How was your consultation?
                            </p>


                            {/* STARS */}

                            <div className="rating-stars">

                                {[1, 2, 3, 4, 5].map(
                                    (star) => (

                                        <button
                                            key={star}
                                            type="button"
                                            className={
                                                star <= rating
                                                    ? "star selected"
                                                    : "star"
                                            }
                                            onClick={() =>
                                                setRating(star)
                                            }
                                            disabled={
                                                submittingRating
                                            }
                                            aria-label={
                                                `${star} star`
                                            }
                                        >
                                            ★
                                        </button>

                                    )
                                )}

                            </div>


                            {/* RATING VALUE */}

                            <div className="rating-value">

                                {rating > 0
                                    ? `${rating} / 5`
                                    : "Select a rating"}

                            </div>


                            {/* COMMENT */}

                            <label htmlFor="doctor-review">
                                Review (optional)
                            </label>

                            <textarea
                                id="doctor-review"
                                value={comment}
                                onChange={(e) =>
                                    setComment(
                                        e.target.value
                                    )
                                }
                                placeholder="Share your experience..."
                                maxLength={1000}
                                disabled={
                                    submittingRating
                                }
                            />

                            <small>
                                {comment.length}/1000
                            </small>

                        </div>


                        {/* FOOTER */}

                        <div className="rating-modal-footer">

                            <button
                                className="rating-cancel-btn"
                                onClick={closeRating}
                                disabled={
                                    submittingRating
                                }
                            >
                                Cancel
                            </button>


                            <button
                                className="rating-submit-btn"
                                onClick={
                                    handleSubmitRating
                                }
                                disabled={
                                    submittingRating ||
                                    rating === 0
                                }
                            >
                                {submittingRating
                                    ? "Submitting..."
                                    : "Submit Rating"}
                            </button>

                        </div>

                    </div>

                </div>

            )}

            <Footer />

        </>
    );
}

export default MyAppointments;