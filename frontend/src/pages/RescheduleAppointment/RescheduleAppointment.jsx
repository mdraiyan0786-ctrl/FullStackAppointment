import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../component/Navbar/Navbar";
import Footer from "../../component/Footer/Footer";
import api from "../../api/api";
import "./RescheduleAppointment.css";

function RescheduleAppointment() {

    const navigate = useNavigate();
    const { id } = useParams();

    const [appointment, setAppointment] =
        useState(null);

    const [newDate, setNewDate] =
        useState("");

    const [newTime, setNewTime] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [rescheduling, setRescheduling] =
        useState(false);

    const [error, setError] =
        useState("");


    // ==========================================
    // FETCH APPOINTMENT
    // ==========================================

    useEffect(() => {

        const fetchAppointment = async () => {

            try {

                const response =
                    await api.get(
                        `/appointments/${id}`
                    );

                const data = response.data;

                // Only BOOKED appointments
                // can be rescheduled

                if (data.status !== "BOOKED") {

                    setError(
                        "Only booked appointments can be rescheduled."
                    );

                    return;
                }

                setAppointment(data);

                setNewDate(
                    data.appointmentDate || ""
                );

                setNewTime(
                    data.appointmentTime
                        ? data.appointmentTime.substring(0, 5)
                        : ""
                );

            } catch (error) {

                console.error(
                    "Failed to fetch appointment:",
                    error
                );

                if (
                    error.response?.status === 401
                ) {

                    localStorage.removeItem(
                        "token"
                    );

                    alert(
                        "Session expired. Please login again."
                    );

                    navigate("/login");

                    return;
                }

                setError(
                    error.response?.data?.message ||
                    "Unable to load appointment."
                );

            } finally {

                setLoading(false);

            }
        };

        fetchAppointment();

    }, [id, navigate]);


    // ==========================================
    // RESCHEDULE
    // ==========================================

    const handleReschedule = async (e) => {

        e.preventDefault();

        if (!newDate) {

            alert(
                "Please select a new date."
            );

            return;
        }

        if (!newTime) {

            alert(
                "Please select a new time."
            );

            return;
        }


        try {

            setRescheduling(true);

            await api.put(
                `/appointments/${id}/reschedule`,
                {
                    appointmentDate: newDate,
                    appointmentTime: `${newTime}:00`
                }
            );


            alert(
                "Appointment rescheduled successfully."
            );


            navigate("/my-appointments");

        } catch (error) {

            console.error(
                "Reschedule error:",
                error
            );


            if (
                error.response?.status === 401
            ) {

                localStorage.removeItem(
                    "token"
                );

                alert(
                    "Session expired. Please login again."
                );

                navigate("/login");

                return;
            }


            const message =
                error.response?.data?.message ||
                error.response?.data ||
                "Failed to reschedule appointment.";

            alert(message);

        } finally {

            setRescheduling(false);

        }
    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (
            <>
                <Navbar />

                <div className="reschedule-page">

                    <div className="reschedule-loading">
                        Loading appointment...
                    </div>

                </div>

                <Footer />
            </>
        );
    }


    // ==========================================
    // ERROR
    // ==========================================

    if (error || !appointment) {

        return (
            <>
                <Navbar />

                <div className="reschedule-page">

                    <div className="reschedule-error">

                        <h2>
                            Unable to Reschedule
                        </h2>

                        <p>
                            {error ||
                                "Appointment not found."}
                        </p>

                        <button
                            onClick={() =>
                                navigate(
                                    "/my-appointments"
                                )
                            }
                        >
                            Back to Appointments
                        </button>

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

            <div className="reschedule-page">

                <div className="reschedule-wrapper">

                    {/* ==========================================
                        BACK
                    ========================================== */}

                    <button
                        className="back-btn"
                        onClick={() =>
                            navigate(
                                "/my-appointments"
                            )
                        }
                    >
                        ← Back to Appointments
                    </button>


                    {/* ==========================================
                        HEADER
                    ========================================== */}

                    <div className="reschedule-heading">

                        <h1>
                            Reschedule Appointment
                        </h1>

                        <p>
                            Choose a new date and time
                            for your appointment.
                        </p>

                    </div>


                    {/* ==========================================
                        DOCTOR CARD
                    ========================================== */}

                    <div className="reschedule-doctor-card">

                        <div className="doctor-avatar">

                            {appointment.doctor?.name
                                ?.charAt(0)
                                ?.toUpperCase()}

                        </div>

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
                                    appointment.doctor
                                        ?.specialization ||
                                    "Medical Consultation"
                                }
                            </p>

                        </div>

                    </div>


                    {/* ==========================================
                        CURRENT APPOINTMENT
                    ========================================== */}

                    <div className="current-appointment-card">

                        <h3>
                            Current Appointment
                        </h3>

                        <div className="current-details">

                            <div>

                                <span>
                                    📅 Date
                                </span>

                                <strong>
                                    {
                                        appointment
                                            .appointmentDate
                                    }
                                </strong>

                            </div>

                            <div>

                                <span>
                                    🕐 Time
                                </span>

                                <strong>
                                    {
                                        appointment
                                            .appointmentTime
                                    }
                                </strong>

                            </div>

                        </div>

                    </div>


                    {/* ==========================================
                        RESCHEDULE FORM
                    ========================================== */}

                    <form
                        className="reschedule-form-page"
                        onSubmit={handleReschedule}
                    >

                        <h2>
                            Select New Schedule
                        </h2>


                        <div className="form-row">

                            <div className="form-group">

                                <label>
                                    New Date
                                </label>

                                <input
                                    type="date"
                                    value={newDate}
                                    min={
                                        new Date()
                                            .toISOString()
                                            .split("T")[0]
                                    }
                                    onChange={(e) =>
                                        setNewDate(
                                            e.target.value
                                        )
                                    }
                                    disabled={
                                        rescheduling
                                    }
                                    required
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    New Time
                                </label>

                                <input
                                    type="time"
                                    value={newTime}
                                    onChange={(e) =>
                                        setNewTime(
                                            e.target.value
                                        )
                                    }
                                    disabled={
                                        rescheduling
                                    }
                                    required
                                />

                            </div>

                        </div>


                        {/* ==========================================
                            NOTICE
                        ========================================== */}

                        <div className="reschedule-notice">

                            <span>
                                ℹ️
                            </span>

                            <p>
                                Please choose a date and time
                                that works for you. The appointment
                                will remain booked after rescheduling.
                            </p>

                        </div>


                        {/* ==========================================
                            ACTIONS
                        ========================================== */}

                        <div className="reschedule-page-actions">

                            <button
                                type="button"
                                className="page-cancel-btn"
                                onClick={() =>
                                    navigate(
                                        "/my-appointments"
                                    )
                                }
                                disabled={
                                    rescheduling
                                }
                            >
                                Cancel
                            </button>


                            <button
                                type="submit"
                                className="page-confirm-btn"
                                disabled={
                                    rescheduling ||
                                    !newDate ||
                                    !newTime
                                }
                            >
                                {rescheduling
                                    ? "Rescheduling..."
                                    : "Confirm Reschedule"}
                            </button>

                        </div>

                    </form>

                </div>

            </div>

            <Footer />
        </>
    );
}

export default RescheduleAppointment;