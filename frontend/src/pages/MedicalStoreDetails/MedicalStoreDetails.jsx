import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Navbar from "../../component/Navbar/Navbar";
import Footer from "../../component/Footer/Footer";
import api from "../../api/api";

import "./MedicalStoreDetails.css";

function MedicalStoreDetails() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [store, setStore] = useState(null);
    const [doctorSchedules, setDoctorSchedules] = useState([]);
    const [approvedDoctors, setApprovedDoctors] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // ==========================================
    // FETCH STORE + DOCTORS + SCHEDULES
    // ==========================================

    useEffect(() => {

        const fetchStoreDetails = async () => {

            try {

                setLoading(true);
                setError("");

                const storeResponse =
                    await api.get(
                        `/medical-stores/${id}`
                    );

                const scheduleResponse =
                    await api.get(
                        `/medical-stores/${id}/doctors`
                    );

                const approvedDoctorsResponse =
                    await api.get(
                        `/medical-stores/${id}/approved-doctors`
                    );

                setStore(storeResponse.data);


                // SCHEDULES

                if (
                    Array.isArray(
                        scheduleResponse.data
                    )
                ) {

                    setDoctorSchedules(
                        scheduleResponse.data
                    );

                } else {

                    setDoctorSchedules([]);

                }


                // APPROVED DOCTORS

                if (
                    Array.isArray(
                        approvedDoctorsResponse.data
                    )
                ) {

                    setApprovedDoctors(
                        approvedDoctorsResponse.data
                    );

                } else {

                    setApprovedDoctors([]);

                }

            } catch (error) {

                console.error(
                    "Failed to load medical store:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Unable to load medical store details."
                );

            } finally {

                setLoading(false);

            }

        };

        fetchStoreDetails();

    }, [id]);


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (
            <>
                <Navbar />

                <div className="store-details-message">

                    <h2>
                        Loading medical store...
                    </h2>

                </div>

                <Footer />
            </>
        );

    }


    // ==========================================
    // ERROR
    // ==========================================

    if (error || !store) {

        return (
            <>
                <Navbar />

                <div className="store-details-message">

                    <h2>
                        {error ||
                            "Medical store not found."}
                    </h2>

                    <button
                        onClick={() =>
                            navigate("/stores")
                        }
                    >
                        Back to Medical Stores
                    </button>

                </div>

                <Footer />
            </>
        );

    }


    // ==========================================
    // GROUP SCHEDULES BY DOCTOR
    // ==========================================

    const doctorMap = {};


    // First add all approved doctors

    approvedDoctors.forEach((request) => {

        const doctor =
            request.doctor;

        if (!doctor?.id) {
            return;
        }

        doctorMap[doctor.id] = {
            doctor: doctor,
            schedules: []
        };

    });


    // Then add schedules

    doctorSchedules.forEach((schedule) => {

        const doctorId =
            schedule.doctor?.id;

        if (!doctorId) {
            return;
        }


        if (!doctorMap[doctorId]) {

            doctorMap[doctorId] = {
                doctor: schedule.doctor,
                schedules: []
            };

        }


        doctorMap[doctorId].schedules.push(
            schedule
        );

    });


    const doctorList =
        Object.values(doctorMap);


    // ==========================================
    // PAGE
    // ==========================================

    return (
        <>
            <Navbar />

            <div className="store-details-page">


                {/* ==========================================
                    BACK BUTTON
                ========================================== */}

                <button
                    className="back-to-stores"
                    onClick={() =>
                        navigate("/stores")
                    }
                >
                    ← Back to Medical Stores
                </button>


                {/* ==========================================
                    STORE INFORMATION
                ========================================== */}

                <div className="store-info-card">

                    <div className="store-info-icon">
                        🏥
                    </div>

                    <div className="store-info-content">

                        <h1>
                            {store.name}
                        </h1>

                        <p>
                            📍 {store.address}
                        </p>

                        <p>
                            📞 {store.phone}
                        </p>

                        <p>
                            🕒 {store.openingTime}
                            {" - "}
                            {store.closingTime}
                        </p>

                        {store.description && (

                            <p className="store-description">
                                {store.description}
                            </p>

                        )}

                    </div>

                </div>


                {/* ==========================================
                    DOCTORS
                ========================================== */}

                <div className="store-doctors-section">

                    <div className="store-doctors-header">

                        <h2>
                            Doctors at this Store
                        </h2>

                        <p>
                            View doctors working at this
                            medical store and their schedules.
                        </p>

                    </div>


                    {/* NO DOCTORS */}

                    {doctorList.length === 0 && (

                        <div className="no-store-doctors">

                            <div>
                                👨‍⚕️
                            </div>

                            <h3>
                                No doctors available yet
                            </h3>

                            <p>
                                Doctors who are approved to
                                work at this store will appear here.
                            </p>

                        </div>

                    )}


                    {/* DOCTOR LIST */}

                    {doctorList.length > 0 && (

                        <div className="store-doctor-list">

                            {doctorList.map(
                                ({
                                    doctor,
                                    schedules
                                }) => (

                                    <div
                                        className="store-doctor-card"
                                        key={doctor.id}
                                    >

                                        {/* ==========================================
                                            DOCTOR INFO
                                        ========================================== */}

                                        <div className="store-doctor-info">

                                            <div className="doctor-avatar">

                                                {doctor.imageUrl ? (

                                                    <img
                                                        src={doctor.imageUrl}
                                                        alt={doctor.name}
                                                    />

                                                ) : (

                                                    "👨‍⚕️"

                                                )}

                                            </div>


                                            <div>

                                                <h3>
                                                    Dr. {doctor.name}
                                                </h3>

                                                <p>
                                                    {doctor.specialization ||
                                                        "Medical Specialist"}
                                                </p>

                                                {doctor.experience != null && (

                                                    <p>
                                                        {doctor.experience}
                                                        {" "}
                                                        years experience
                                                    </p>

                                                )}

                                            </div>

                                        </div>


                                        {/* ==========================================
                                            SCHEDULE
                                        ========================================== */}

                                        <div className="doctor-schedule">

                                            <h4>
                                                Available at this store
                                            </h4>


                                            {schedules.length === 0 ? (

                                                <p>
                                                    Schedule not added yet.
                                                </p>

                                            ) : (

                                                schedules.map(
                                                    (schedule) => (

                                                        <div
                                                            className="schedule-row"
                                                            key={schedule.id}
                                                        >

                                                            <strong>
                                                                {schedule.dayOfWeek}
                                                            </strong>

                                                            <span>
                                                                {schedule.startTime}
                                                                {" - "}
                                                                {schedule.endTime}
                                                            </span>

                                                        </div>

                                                    )
                                                )

                                            )}

                                        </div>


                                        {/* ==========================================
                                            BOOK
                                        ========================================== */}

                                        <button
                                            className="book-store-doctor-btn"
                                            disabled={
                                                schedules.length === 0
                                            }
                                            onClick={() =>
                                                navigate(
                                                    `/appointment?doctorId=${doctor.id}&storeId=${store.id}`
                                                )
                                            }
                                        >
                                            {schedules.length === 0
                                                ? "Schedule Not Available"
                                                : "Book Appointment"}
                                        </button>

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

export default MedicalStoreDetails;