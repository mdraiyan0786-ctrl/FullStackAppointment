import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../component/Navbar/Navbar";
import Footer from "../../component/Footer/Footer";
import StoreDoctorRequests from "../../component/StoreDoctorRequests/StoreDoctorRequests";

import api from "../../api/api";

import "./StoreAdminDashboard.css";

function StoreAdminDashboard() {

    const navigate = useNavigate();

    const [store, setStore] = useState(null);
    const [doctors, setDoctors] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // ==========================================
    // FETCH STORE
    // ==========================================

    const fetchStore = async () => {

        try {

            const response =
                await api.get("/medical-stores/my");

            setStore(response.data);

            return response.data;

        } catch (error) {

            console.error(
                "Failed to load store:",
                error
            );

            throw error;
        }
    };


    // ==========================================
    // FETCH APPROVED DOCTORS
    // ==========================================

    const fetchDoctors = async (storeId) => {

        try {

            const response =
                await api.get(
                    `/medical-stores/${storeId}/approved-doctors`
                );

            if (Array.isArray(response.data)) {

                const doctorList =
                    response.data
                        .map((request) => request.doctor)
                        .filter((doctor) => doctor?.id);

                setDoctors(doctorList);

            } else {

                setDoctors([]);

            }

        } catch (error) {

            console.error(
                "Failed to load doctors:",
                error
            );

            setDoctors([]);

        }
    };


    // ==========================================
    // INITIAL LOAD
    // ==========================================

    useEffect(() => {

        const loadDashboard = async () => {

            try {

                setLoading(true);
                setError("");

                const storeData =
                    await fetchStore();

                if (storeData?.id) {

                    await fetchDoctors(
                        storeData.id
                    );

                }

            } catch (error) {

                setError(
                    error.response?.data?.message ||
                    "Failed to load store dashboard."
                );

            } finally {

                setLoading(false);

            }

        };

        loadDashboard();

    }, []);


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (
            <>
                <Navbar />

                <div className="store-admin-dashboard">

                    <div className="dashboard-container">

                        <h2>
                            Loading dashboard...
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

                <div className="store-admin-dashboard">

                    <div className="dashboard-container">

                        <div className="dashboard-error">

                            <h2>
                                Unable to load dashboard
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

            <div className="store-admin-dashboard">

                <div className="dashboard-container">


                    {/* ==========================================
                        STORE HEADER
                    ========================================== */}

                    <div className="store-dashboard-header">

                        <div>

                            <h1>
                                {store?.name ||
                                    "Medical Store Dashboard"}
                            </h1>

                            <p>
                                Manage your store and doctors
                            </p>

                        </div>

                    </div>


                    {/* ==========================================
                        STORE INFORMATION
                    ========================================== */}

                    {store && (

                        <div className="store-info-card">

                            <div>

                                <strong>
                                    Address
                                </strong>

                                <p>
                                    {store.address}
                                </p>

                            </div>

                            <div>

                                <strong>
                                    Phone
                                </strong>

                                <p>
                                    {store.phone}
                                </p>

                            </div>

                            <div>

                                <strong>
                                    Doctors
                                </strong>

                                <p>
                                    {doctors.length}
                                </p>

                            </div>

                        </div>

                    )}


                    {/* ==========================================
                        DOCTORS AT MY STORE
                    ========================================== */}

                    <div className="store-doctors-admin-section">

                        <div className="section-header">

                            <div>

                                <h2>
                                    Doctors at My Store
                                </h2>

                                <p>
                                    View appointments for doctors
                                    working at your medical store.
                                </p>

                            </div>

                            <span>
                                {doctors.length}
                                {" "}
                                {doctors.length === 1
                                    ? "Doctor"
                                    : "Doctors"}
                            </span>

                        </div>


                        {doctors.length === 0 ? (

                            <div className="no-doctors-admin">

                                <div>
                                    👨‍⚕️
                                </div>

                                <h3>
                                    No doctors yet
                                </h3>

                                <p>
                                    Approved doctors will appear
                                    here.
                                </p>

                            </div>

                        ) : (

                            <div className="admin-doctors-grid">

                                {doctors.map(
                                    (doctor) => (

                                        <div
                                            className="admin-doctor-card"
                                            key={doctor.id}
                                        >

                                            <div className="admin-doctor-info">

                                                <div className="admin-doctor-avatar">

                                                    {doctor.imageUrl ? (

                                                        <img
                                                            src={
                                                                doctor.imageUrl
                                                            }
                                                            alt={
                                                                doctor.name
                                                            }
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
                                                VIEW APPOINTMENTS
                                            ========================================== */}

                                            <button
                                                className="view-doctor-appointments-btn"
                                                onClick={() =>
                                                    navigate(
                                                        `/store-admin/doctor/${doctor.id}/appointments`
                                                    )
                                                }
                                            >
                                                View Appointments
                                            </button>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                    </div>


                    {/* ==========================================
                        DOCTOR REQUESTS
                    ========================================== */}

                    <div className="doctor-requests-section">

                        <StoreDoctorRequests />

                    </div>

                </div>

            </div>

            <Footer />
        </>
    );
}

export default StoreAdminDashboard;