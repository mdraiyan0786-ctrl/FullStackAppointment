import { useEffect, useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";

import Navbar from "../../component/Navbar/Navbar";
import Footer from "../../component/Footer/Footer";
import "./Appointment.css";
import api from "../../api/api";

function Appointment() {

    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();

    const doctorId = searchParams.get("doctorId");
    const storeId = searchParams.get("storeId");

    const [doctor, setDoctor] = useState(
        location.state?.doctor || null
    );

    const [formData, setFormData] = useState({
        patientName: "",
        age: "",
        gender: "",
        phone: "",
        date: "",
        time: "",
    });

    const [loadingDoctor, setLoadingDoctor] = useState(false);


    // ==========================================
    // FETCH DOCTOR
    // ==========================================

    useEffect(() => {

        const fetchDoctor = async () => {

            // If doctor already came through location.state
            if (location.state?.doctor) {
                setDoctor(location.state.doctor);
                return;
            }

            // If doctorId is available in URL
            if (!doctorId) {
                return;
            }

            try {

                setLoadingDoctor(true);

                const response =
                    await api.get(
                        `/doctors/${doctorId}`
                    );

                setDoctor(response.data);

            } catch (error) {

                console.error(
                    "Failed to load doctor:",
                    error
                );

                alert("Unable to load doctor details.");

            } finally {

                setLoadingDoctor(false);

            }
        };

        fetchDoctor();

    }, [doctorId, location.state]);


    // ==========================================
    // HANDLE INPUT CHANGES
    // ==========================================

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

    };


    // ==========================================
    // BOOK APPOINTMENT
    // ==========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!doctor?.id) {

            alert("Please select a doctor first.");

            return;
        }

        if (!formData.date) {

            alert(
                "Please select an appointment date."
            );

            return;
        }

        if (!formData.time) {

            alert(
                "Please select an appointment time."
            );

            return;
        }

        try {

            const appointment = {

                patientName:
                    formData.patientName,

                age:
                    parseInt(formData.age),

                gender:
                    formData.gender,

                phone:
                    formData.phone,

                appointmentDate:
                    formData.date,

                appointmentTime:
                    formData.time,

                status:
                    "BOOKED",

                doctor: {
                    id: doctor.id,
                },

            };


            // ==========================================
            // ADD MEDICAL STORE
            // ==========================================

            if (storeId) {

                appointment.medicalStore = {
                    id: parseInt(storeId),
                };

            }


            // ==========================================
            // SEND BOOKING REQUEST
            // ==========================================

            const response =
                await api.post(
                    "/appointments",
                    appointment
                );


            console.log(
                "Appointment booked:",
                response.data
            );


            alert(
                "Appointment Booked Successfully!"
            );


            navigate(
                "/my-appointments"
            );


        } catch (error) {

            console.error(
                "Appointment error:",
                error
            );

            console.log(
                "Status:",
                error.response?.status
            );

            console.log(
                "Response data:",
                error.response?.data
            );


            if (
                error.response?.status === 401
            ) {

                alert(
                    "Please login before booking an appointment."
                );

                navigate("/login");

                return;
            }


            const message =
                error.response?.data?.message ||
                error.response?.data ||
                "Failed to book appointment.";


            alert(message);

        }

    };


    // ==========================================
    // LOADING DOCTOR
    // ==========================================

    if (loadingDoctor) {

        return (
            <>
                <Navbar />

                <div className="appointment-container">

                    <div className="appointment-card">

                        <h2>
                            Loading doctor...
                        </h2>

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

            <div className="appointment-container">

                <div className="appointment-card">

                    <h1>
                        Book Appointment
                    </h1>


                    {/* ==========================================
                        SELECTED DOCTOR
                    ========================================== */}

                    {doctor && (

                        <div className="selected-doctor">

                            <img
                                src={
                                    doctor.imageUrl ||
                                    doctor.image
                                }
                                alt={doctor.name}
                            />

                            <div>

                                <h2>
                                    {doctor.name}
                                </h2>

                                <p>
                                    {doctor.specialization}
                                </p>

                                <p>

                                    <strong>
                                        Consultation Fee:
                                    </strong>{" "}

                                    ₹
                                    {doctor.consultationFee ||
                                        doctor.fee}

                                </p>

                            </div>

                        </div>

                    )}


                    {!doctor && (

                        <p>
                            Doctor information could not be
                            loaded.
                        </p>

                    )}


                    <form onSubmit={handleSubmit}>


                        {/* ==========================================
                            PATIENT NAME
                        ========================================== */}

                        <div className="form-group">

                            <label>
                                Patient Name
                            </label>

                            <input
                                type="text"
                                name="patientName"
                                value={
                                    formData.patientName
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            />

                        </div>


                        {/* ==========================================
                            AGE
                        ========================================== */}

                        <div className="form-group">

                            <label>
                                Age
                            </label>

                            <input
                                type="number"
                                name="age"
                                min="1"
                                value={
                                    formData.age
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            />

                        </div>


                        {/* ==========================================
                            GENDER
                        ========================================== */}

                        <div className="form-group">

                            <label>
                                Gender
                            </label>

                            <select
                                name="gender"
                                value={
                                    formData.gender
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            >

                                <option value="">
                                    Select Gender
                                </option>

                                <option value="Male">
                                    Male
                                </option>

                                <option value="Female">
                                    Female
                                </option>

                                <option value="Other">
                                    Other
                                </option>

                            </select>

                        </div>


                        {/* ==========================================
                            PHONE
                        ========================================== */}

                        <div className="form-group">

                            <label>
                                Phone Number
                            </label>

                            <input
                                type="tel"
                                name="phone"
                                value={
                                    formData.phone
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            />

                        </div>


                        {/* ==========================================
                            DATE
                        ========================================== */}

                        <div className="form-group">

                            <label>
                                Appointment Date
                            </label>

                            <input
                                type="date"
                                name="date"
                                value={
                                    formData.date
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            />

                        </div>


                        {/* ==========================================
                            TIME
                        ========================================== */}

                        <div className="form-group">

                            <label>
                                Appointment Time
                            </label>

                            <input
                                type="time"
                                name="time"
                                value={
                                    formData.time
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            />

                        </div>


                        {/* ==========================================
                            STORE INFORMATION
                        ========================================== */}

                        {storeId && (

                            <p>
                                Appointment at selected
                                medical store.
                            </p>

                        )}


                        {/* ==========================================
                            CONFIRM BUTTON
                        ========================================== */}

                        <button
                            type="submit"
                            className="confirm-btn"
                            disabled={!doctor}
                        >
                            Confirm Appointment
                        </button>

                    </form>

                </div>

            </div>

            <Footer />

        </>
    );
}

export default Appointment;