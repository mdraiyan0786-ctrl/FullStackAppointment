import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../component/Navbar/Navbar";
import Footer from "../../component/Footer/Footer";
import api from "../../api/api";

import "./DoctorDashboard.css";


function DoctorDashboard() {

    const navigate = useNavigate();

    const [appointments, setAppointments] = useState([]);
    const [reviews, setReviews] = useState([]);

    const [averageRating, setAverageRating] = useState(0);
    const [reviewCount, setReviewCount] = useState(0);

    const [loading, setLoading] = useState(true);
    const [reviewsLoading, setReviewsLoading] = useState(true);

    const [error, setError] = useState("");
    const [reviewError, setReviewError] = useState("");


    // ==========================================
    // FETCH DOCTOR APPOINTMENTS
    // ==========================================

    useEffect(() => {

        const fetchAppointments = async () => {

            try {

                const response =
                    await api.get("/appointments/doctor");

                setAppointments(response.data);
                setError("");

            } catch (error) {

                console.error(
                    "Dashboard error:",
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

                setError(
                    error.response?.data?.message ||
                    "Failed to load dashboard."
                );

            } finally {

                setLoading(false);

            }
        };

        fetchAppointments();

    }, [navigate]);


    // ==========================================
    // FETCH MY REVIEWS
    // ==========================================

    useEffect(() => {

        const fetchReviews = async () => {

            try {

                const response =
                    await api.get("/reviews/my");

                console.log(
                    "Doctor reviews:",
                    response.data
                );

                setReviews(
                    response.data.reviews || []
                );

                setAverageRating(
                    response.data.averageRating || 0
                );

                setReviewCount(
                    response.data.reviewCount || 0
                );

                setReviewError("");

            } catch (error) {

                console.error(
                    "Reviews error:",
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

                setReviewError(
                    error.response?.data?.message ||
                    "Failed to load reviews."
                );

            } finally {

                setReviewsLoading(false);

            }
        };

        fetchReviews();

    }, [navigate]);


    // ==========================================
    // STATISTICS
    // ==========================================

    const totalAppointments =
        appointments.length;

    const bookedAppointments =
        appointments.filter(
            appointment =>
                appointment.status === "BOOKED"
        ).length;

    const completedAppointments =
        appointments.filter(
            appointment =>
                appointment.status === "COMPLETED"
        ).length;

    const cancelledAppointments =
        appointments.filter(
            appointment =>
                appointment.status === "CANCELLED"
        ).length;


    // ==========================================
    // TODAY'S DATE
    // ==========================================

    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    // ==========================================
    // TODAY'S APPOINTMENTS
    // ==========================================

    const todayAppointments =
        appointments
            .filter(
                appointment =>
                    appointment.appointmentDate === today
            )
            .sort(
                (a, b) =>
                    a.appointmentTime.localeCompare(
                        b.appointmentTime
                    )
            );


    // ==========================================
    // UPCOMING APPOINTMENTS
    // ==========================================

    const upcomingAppointments =
        appointments
            .filter(
                appointment =>
                    appointment.status === "BOOKED" &&
                    appointment.appointmentDate >= today
            )
            .sort(
                (a, b) =>
                    new Date(
                        `${a.appointmentDate}T${a.appointmentTime}`
                    ) -
                    new Date(
                        `${b.appointmentDate}T${b.appointmentTime}`
                    )
            )
            .slice(0, 5);


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (
            <>
                <Navbar />

                <div className="doctor-dashboard-page">

                    <div className="dashboard-loading">
                        Loading dashboard...
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

                <div className="doctor-dashboard-page">

                    <div className="dashboard-error">
                        {error}
                    </div>

                </div>

                <Footer />
            </>
        );

    }


    // ==========================================
    // DASHBOARD
    // ==========================================

    return (
        <>
            <Navbar />

            <div className="doctor-dashboard-page">

                <div className="doctor-dashboard-wrapper">


                    {/* ==========================================
                        HEADER
                    ========================================== */}

                    <div className="doctor-dashboard-header">

                        <div>

                            <h1>
                                Doctor Dashboard
                            </h1>

                            <p>
                                Manage your appointments,
                                patients and reviews
                            </p>

                        </div>

                    </div>


                    {/* ==========================================
                        STATISTICS
                    ========================================== */}

                    <div className="dashboard-stats">

                        <div className="stat-card">

                            <div className="stat-icon">
                                📋
                            </div>

                            <div>

                                <span>
                                    Total Appointments
                                </span>

                                <strong>
                                    {totalAppointments}
                                </strong>

                            </div>

                        </div>


                        <div className="stat-card">

                            <div className="stat-icon">
                                📅
                            </div>

                            <div>

                                <span>
                                    Booked
                                </span>

                                <strong>
                                    {bookedAppointments}
                                </strong>

                            </div>

                        </div>


                        <div className="stat-card">

                            <div className="stat-icon">
                                ✓
                            </div>

                            <div>

                                <span>
                                    Completed
                                </span>

                                <strong>
                                    {completedAppointments}
                                </strong>

                            </div>

                        </div>


                        <div className="stat-card">

                            <div className="stat-icon">
                                ✕
                            </div>

                            <div>

                                <span>
                                    Cancelled
                                </span>

                                <strong>
                                    {cancelledAppointments}
                                </strong>

                            </div>

                        </div>

                    </div>


                    {/* ==========================================
                        MY RATING
                    ========================================== */}

                    <div className="dashboard-section">

                        <div className="section-header">

                            <div>

                                <h2>
                                    My Rating
                                </h2>

                                <p>
                                    Patient feedback about your consultations
                                </p>

                            </div>

                        </div>


                        {reviewsLoading ? (

                            <div className="reviews-loading">
                                Loading ratings...
                            </div>

                        ) : reviewError ? (

                            <div className="reviews-error">
                                {reviewError}
                            </div>

                        ) : (

                            <div className="doctor-rating-summary">

                                <div className="rating-score">

                                    <strong>
                                        {averageRating.toFixed(1)}
                                    </strong>

                                    <span>
                                        / 5
                                    </span>

                                </div>


                                <div className="rating-stars-display">

                                    {[1, 2, 3, 4, 5].map(
                                        star => (

                                            <span
                                                key={star}
                                                className={
                                                    star <=
                                                    Math.round(
                                                        averageRating
                                                    )
                                                        ? "rating-star filled"
                                                        : "rating-star"
                                                }
                                            >
                                                ★
                                            </span>

                                        )
                                    )}

                                </div>


                                <p className="rating-count">

                                    {reviewCount === 1
                                        ? "1 Review"
                                        : `${reviewCount} Reviews`}

                                </p>

                            </div>

                        )}

                    </div>


                    {/* ==========================================
                        MY REVIEWS
                    ========================================== */}

                    <div className="dashboard-section">

                        <div className="section-header">

                            <div>

                                <h2>
                                    Patient Reviews
                                </h2>

                                <p>
                                    What your patients say about you
                                </p>

                            </div>

                        </div>


                        {reviewsLoading ? (

                            <div className="reviews-loading">
                                Loading reviews...
                            </div>

                        ) : reviewError ? (

                            <div className="reviews-error">
                                {reviewError}
                            </div>

                        ) : reviews.length === 0 ? (

                            <div className="no-reviews">

                                <div className="no-reviews-icon">
                                    ⭐
                                </div>

                                <h3>
                                    No Reviews Yet
                                </h3>

                                <p>
                                    Patient reviews will appear here
                                    after completed consultations.
                                </p>

                            </div>

                        ) : (

                            <div className="reviews-list">

                                {reviews.map(
                                    review => (

                                        <div
                                            className="review-card"
                                            key={review.id}
                                        >

                                            <div className="review-card-header">

                                                <div className="review-patient">

                                                    <div className="review-avatar">

                                                        {review.user?.name
                                                            ?.charAt(0)
                                                            ?.toUpperCase() ||
                                                            "P"}

                                                    </div>

                                                    <div>

                                                        <h3>
                                                            {
                                                                review.user?.name ||
                                                                "Patient"
                                                            }
                                                        </h3>

                                                        <span>
                                                            Patient
                                                        </span>

                                                    </div>

                                                </div>


                                                <div className="review-date">

                                                    {review.createdAt
                                                        ? new Date(
                                                              review.createdAt
                                                          ).toLocaleDateString()
                                                        : ""}

                                                </div>

                                            </div>


                                            <div className="review-stars">

                                                {[1, 2, 3, 4, 5].map(
                                                    star => (

                                                        <span
                                                            key={star}
                                                            className={
                                                                star <=
                                                                review.rating
                                                                    ? "review-star filled"
                                                                    : "review-star"
                                                            }
                                                        >
                                                            ★
                                                        </span>

                                                    )
                                                )}

                                                <strong>
                                                    {review.rating}/5
                                                </strong>

                                            </div>


                                            {review.comment && (

                                                <p className="review-comment">

                                                    "{review.comment}"

                                                </p>

                                            )}

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                    </div>


                    {/* ==========================================
                        TODAY'S APPOINTMENTS
                    ========================================== */}

                    <div className="dashboard-section">

                        <div className="section-header">

                            <div>

                                <h2>
                                    Today's Appointments
                                </h2>

                                <p>
                                    Patients scheduled for today
                                </p>

                            </div>

                            <button
                                className="view-all-btn"
                                onClick={() =>
                                    navigate(
                                        "/doctor-appointments"
                                    )
                                }
                            >
                                View All
                            </button>

                        </div>


                        {todayAppointments.length === 0 ? (

                            <div className="no-upcoming">

                                <div>
                                    📅
                                </div>

                                <h3>
                                    No Appointments Today
                                </h3>

                                <p>
                                    You have no appointments
                                    scheduled for today.
                                </p>

                            </div>

                        ) : (

                            <div className="upcoming-list">

                                {todayAppointments.map(
                                    appointment => (

                                        <div
                                            className="upcoming-card"
                                            key={appointment.id}
                                        >

                                            <div className="patient-info">

                                                <div className="patient-avatar">

                                                    {appointment.patientName
                                                        ?.charAt(0)
                                                        ?.toUpperCase()}

                                                </div>

                                                <div>

                                                    <h3>
                                                        {
                                                            appointment.patientName
                                                        }
                                                    </h3>

                                                    <p>
                                                        Appointment #
                                                        {
                                                            appointment.id
                                                        }
                                                    </p>

                                                </div>

                                            </div>


                                            <div className="appointment-date">

                                                <span>
                                                    🕐
                                                </span>

                                                <div>

                                                    <strong>
                                                        {
                                                            appointment.appointmentTime
                                                        }
                                                    </strong>

                                                    <small>
                                                        Today
                                                    </small>

                                                </div>

                                            </div>


                                            <span className="dashboard-status">

                                                {
                                                    appointment.status
                                                }

                                            </span>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                    </div>


                    {/* ==========================================
                        QUICK ACTIONS
                    ========================================== */}

                    <div className="dashboard-section">

                        <div className="section-header">

                            <h2>
                                Quick Actions
                            </h2>

                        </div>


                        <div className="quick-actions">

                            <button
                                onClick={() =>
                                    navigate(
                                        "/doctor-appointments"
                                    )
                                }
                            >
                                📋 View Appointments
                            </button>


                            <button
                                onClick={() =>
                                    navigate(
                                        "/doctor-own-profile"
                                    )
                                }
                            >
                                👤 My Profile
                            </button>

                        </div>

                    </div>


                    {/* ==========================================
                        UPCOMING APPOINTMENTS
                    ========================================== */}

                    <div className="dashboard-section">

                        <div className="section-header">

                            <div>

                                <h2>
                                    Upcoming Appointments
                                </h2>

                                <p>
                                    Your next scheduled appointments
                                </p>

                            </div>

                        </div>


                        {upcomingAppointments.length === 0 ? (

                            <div className="no-upcoming">

                                <div>
                                    📅
                                </div>

                                <h3>
                                    No Upcoming Appointments
                                </h3>

                                <p>
                                    You currently have
                                    no booked appointments.
                                </p>

                            </div>

                        ) : (

                            <div className="upcoming-list">

                                {upcomingAppointments.map(
                                    appointment => (

                                        <div
                                            className="upcoming-card"
                                            key={appointment.id}
                                        >

                                            <div className="patient-info">

                                                <div className="patient-avatar">

                                                    {appointment.patientName
                                                        ?.charAt(0)
                                                        ?.toUpperCase()}

                                                </div>

                                                <div>

                                                    <h3>
                                                        {
                                                            appointment.patientName
                                                        }
                                                    </h3>

                                                    <p>
                                                        Appointment #
                                                        {
                                                            appointment.id
                                                        }
                                                    </p>

                                                </div>

                                            </div>


                                            <div className="appointment-date">

                                                <span>
                                                    📅
                                                </span>

                                                <div>

                                                    <strong>
                                                        {
                                                            appointment.appointmentDate
                                                        }
                                                    </strong>

                                                    <small>
                                                        {
                                                            appointment.appointmentTime
                                                        }
                                                    </small>

                                                </div>

                                            </div>


                                            <span className="dashboard-status">

                                                {
                                                    appointment.status
                                                }

                                            </span>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                    </div>

                </div>

            </div>

            <Footer />
        </>
    );
}

export default DoctorDashboard;