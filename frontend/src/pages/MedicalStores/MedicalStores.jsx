import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../component/Navbar/Navbar";
import Footer from "../../component/Footer/Footer";

import api from "../../api/api";

import "./MedicalStores.css";

function MedicalStores() {

    const navigate = useNavigate();

    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");

    // Doctor application states
    const [doctorRequests, setDoctorRequests] = useState([]);
    const [requestLoading, setRequestLoading] = useState(false);

    // ==========================================
    // CHECK DOCTOR LOGIN
    // ==========================================

    const doctorToken =
        localStorage.getItem("doctorToken");

    const isDoctorLoggedIn =
        Boolean(doctorToken);


    // ==========================================
    // GET MEDICAL STORES
    // ==========================================

    useEffect(() => {

        const fetchStores = async () => {

            try {

                const response =
                    await api.get("/medical-stores");

                if (Array.isArray(response.data)) {

                    setStores(response.data);

                } else {

                    setStores([]);

                }

            } catch (error) {

                console.error(
                    "Failed to fetch medical stores:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Unable to load medical stores."
                );

            } finally {

                setLoading(false);

            }
        };

        fetchStores();

    }, []);


    // ==========================================
    // GET DOCTOR'S STORE REQUESTS
    // ==========================================

    useEffect(() => {

        if (!isDoctorLoggedIn) {
            return;
        }

        const fetchDoctorRequests = async () => {

            try {

                const response =
                    await api.get(
                        "/doctor-store-requests/my"
                    );

                if (Array.isArray(response.data)) {

                    setDoctorRequests(response.data);

                } else {

                    setDoctorRequests([]);

                }

            } catch (error) {

                console.error(
                    "Failed to fetch doctor store requests:",
                    error
                );

                /*
                 * Do not block the Medical Stores page
                 * if the request list cannot be loaded.
                 */
                setDoctorRequests([]);

            }

        };

        fetchDoctorRequests();

    }, [isDoctorLoggedIn]);


    // ==========================================
    // GET REQUEST STATUS FOR STORE
    // ==========================================

    const getRequestForStore = (storeId) => {

        return doctorRequests.find(
            (request) =>
                request.medicalStore?.id === storeId
        );

    };


    // ==========================================
    // SEND WORK WITH THEM REQUEST
    // ==========================================

    const handleWorkWithThem = async (store) => {

        if (!isDoctorLoggedIn) {

            navigate("/doctor-login");

            return;
        }


        if (
            !store.status ||
            store.status.toUpperCase() !== "APPROVED"
        ) {

            alert(
                "This medical store is not approved yet."
            );

            return;
        }


        const existingRequest =
            getRequestForStore(store.id);


        if (
            existingRequest?.status === "PENDING"
        ) {

            alert(
                "Your application is already pending."
            );

            return;
        }


        if (
            existingRequest?.status === "APPROVED"
        ) {

            alert(
                "You are already associated with this medical store."
            );

            return;
        }


        try {

            setRequestLoading(true);

            const response =
                await api.post(
                    `/doctor-store-requests/${store.id}`
                );

            /*
             * Add/update the request locally
             * so the button changes immediately.
             */
            if (response.data) {

                setDoctorRequests(
                    (previousRequests) => {

                        const existingIndex =
                            previousRequests.findIndex(
                                (request) =>
                                    request.medicalStore?.id ===
                                    store.id
                            );


                        if (existingIndex !== -1) {

                            const updated =
                                [...previousRequests];

                            updated[existingIndex] =
                                response.data;

                            return updated;

                        }


                        return [
                            ...previousRequests,
                            response.data
                        ];

                    }
                );

            }

            alert(
                "Application sent successfully."
            );

        } catch (error) {

            console.error(
                "Failed to send store request:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to send application."
            );

        } finally {

            setRequestLoading(false);

        }

    };


    // ==========================================
    // FILTER STORES
    // ==========================================

    const filteredStores = stores.filter(
        (store) => {

            const storeName =
                store.name?.toLowerCase() || "";

            const address =
                store.address?.toLowerCase() || "";

            const searchValue =
                search.trim().toLowerCase();

            return (
                storeName.includes(searchValue) ||
                address.includes(searchValue)
            );

        }
    );


    // ==========================================
    // PAGE
    // ==========================================

    return (
        <>
            <Navbar />

            <div className="medical-stores-page">


                {/* ==========================================
                    HEADER
                ========================================== */}

                <div className="medical-stores-header">

                    <h1>
                        Find a Medical Store
                    </h1>

                    <p>
                        Search medical stores and find
                        doctors available at each location.
                    </p>

                </div>


                {/* ==========================================
                    SEARCH
                ========================================== */}

                <div className="medical-store-search-container">

                    <span className="medical-store-search-icon">
                        🔍
                    </span>

                    <input
                        type="text"
                        className="medical-store-search-bar"
                        placeholder="Search by store name or address..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                </div>


                {/* ==========================================
                    RESULT COUNT
                ========================================== */}

                {!loading && !error && (

                    <div className="medical-store-results-info">

                        <p>

                            Showing{" "}

                            <strong>
                                {filteredStores.length}
                            </strong>{" "}

                            {filteredStores.length === 1
                                ? "medical store"
                                : "medical stores"}

                        </p>

                    </div>

                )}


                {/* ==========================================
                    STORES
                ========================================== */}

                <div className="medical-store-list">


                    {/* LOADING */}

                    {loading && (

                        <div className="medical-store-message">

                            <h2>
                                Loading medical stores...
                            </h2>

                        </div>

                    )}


                    {/* ERROR */}

                    {!loading && error && (

                        <div className="medical-store-message">

                            <h2>
                                {error}
                            </h2>

                        </div>

                    )}


                    {/* NO STORES */}

                    {!loading &&
                        !error &&
                        filteredStores.length === 0 && (

                            <div className="no-medical-stores">

                                <div className="no-store-icon">
                                    🏥
                                </div>

                                <h2>
                                    No medical stores found
                                </h2>

                                <p>
                                    Try searching with a
                                    different name or address.
                                </p>

                            </div>

                        )}


                    {/* STORE CARDS */}

                    {!loading &&
                        !error &&
                        filteredStores.length > 0 && (

                            filteredStores.map(
                                (store) => {

                                    const request =
                                        getRequestForStore(
                                            store.id
                                        );

                                    const storeApproved =
                                        store.status?.toUpperCase() ===
                                        "APPROVED";


                                    return (

                                        <div
                                            className="medical-store-card"
                                            key={store.id}
                                        >


                                            {/* STORE ICON */}

                                            <div className="medical-store-card-icon">
                                                🏥
                                            </div>


                                            {/* STORE CONTENT */}

                                            <div className="medical-store-card-content">

                                                <h2>
                                                    {store.name}
                                                </h2>


                                                <p className="medical-store-address">
                                                    📍 {store.address}
                                                </p>


                                                <p className="medical-store-phone">
                                                    📞 {store.phone}
                                                </p>


                                                <p className="medical-store-hours">
                                                    🕒 {store.openingTime}
                                                    {" - "}
                                                    {store.closingTime}
                                                </p>


                                                {store.description && (

                                                    <p className="medical-store-description">
                                                        {store.description}
                                                    </p>

                                                )}


                                                {/* ==========================================
                                                    STORE STATUS
                                                ========================================== */}

                                                {store.status && (

                                                    <div
                                                        className={
                                                            storeApproved
                                                                ? "medical-store-status approved"
                                                                : "medical-store-status pending"
                                                        }
                                                    >

                                                        {storeApproved
                                                            ? "✓ Approved"
                                                            : "⏳ Awaiting Approval"}

                                                    </div>

                                                )}


                                                {/* ==========================================
                                                    BUTTONS
                                                ========================================== */}

                                                <div className="medical-store-actions">


                                                    {/* VIEW STORE */}

                                                    <button
                                                        className="view-store-btn"
                                                        onClick={() =>
                                                            navigate(
                                                                `/stores/${store.id}`
                                                            )
                                                        }
                                                    >
                                                        View Store
                                                    </button>


                                                    {/* ==========================================
                                                        DOCTOR ONLY
                                                    ========================================== */}

                                                    {isDoctorLoggedIn &&
                                                        storeApproved && (

                                                            <>
                                                                {/* PENDING */}

                                                                {request?.status?.toUpperCase() ===
                                                                    "PENDING" && (

                                                                    <button
                                                                        className="work-store-btn pending"
                                                                        disabled
                                                                    >
                                                                        ⏳ Application Pending
                                                                    </button>

                                                                )}


                                                                {/* APPROVED */}

                                                                {request?.status?.toUpperCase() ===
                                                                    "APPROVED" && (

                                                                    <button
                                                                        className="work-store-btn approved"
                                                                        disabled
                                                                    >
                                                                        ✓ You Work Here
                                                                    </button>

                                                                )}


                                                                {/* REJECTED */}

                                                                {request?.status?.toUpperCase() ===
                                                                    "REJECTED" && (

                                                                    <button
                                                                        className="work-store-btn"
                                                                        disabled={
                                                                            requestLoading
                                                                        }
                                                                        onClick={() =>
                                                                            handleWorkWithThem(
                                                                                store
                                                                            )
                                                                        }
                                                                    >

                                                                        {requestLoading
                                                                            ? "Applying..."
                                                                            : "Apply Again"}

                                                                    </button>

                                                                )}


                                                                {/* NO PREVIOUS REQUEST */}

                                                                {!request && (

                                                                    <button
                                                                        className="work-store-btn"
                                                                        disabled={
                                                                            requestLoading
                                                                        }
                                                                        onClick={() =>
                                                                            handleWorkWithThem(
                                                                                store
                                                                            )
                                                                        }
                                                                    >

                                                                        {requestLoading
                                                                            ? "Applying..."
                                                                            : "Work With Them"}

                                                                    </button>

                                                                )}

                                                            </>

                                                        )}

                                                </div>

                                            </div>

                                        </div>

                                    );

                                }

                            )

                        )}

                </div>

            </div>

            <Footer />
        </>
    );
}


export default MedicalStores;