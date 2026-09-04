import { useEffect, useState } from "react";
import api from "../../api/api";

function DoctorMedicalStores() {

    const [stores, setStores] = useState([]);
    const [requests, setRequests] = useState([]);

    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);
    const [requestLoading, setRequestLoading] = useState(null);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");


    // ==========================================
    // FETCH MEDICAL STORES
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
                    "Unable to load medical stores."
                );

            } finally {

                setLoading(false);

            }
        };

        fetchStores();

    }, []);


    // ==========================================
    // FETCH MY REQUESTS
    // ==========================================

    useEffect(() => {

        const fetchRequests = async () => {

            try {

                const response =
                    await api.get(
                        "/doctor-store-requests/my"
                    );

                if (Array.isArray(response.data)) {
                    setRequests(response.data);
                } else {
                    setRequests([]);
                }

            } catch (error) {

                console.error(
                    "Failed to fetch store requests:",
                    error
                );

            }

        };

        fetchRequests();

    }, []);


    // ==========================================
    // SEND REQUEST
    // ==========================================

    const sendRequest = async (storeId) => {

        try {

            setRequestLoading(storeId);
            setMessage("");
            setError("");

            const response =
                await api.post(
                    `/doctor-store-requests/${storeId}`
                );

            setMessage(
                "Request sent successfully."
            );

            setRequests((previousRequests) => [

                ...previousRequests.filter(
                    request =>
                        request.medicalStore?.id !== storeId
                ),

                response.data

            ]);

        } catch (error) {

            console.error(
                "Failed to send store request:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to send request."
            );

        } finally {

            setRequestLoading(null);

        }
    };


    // ==========================================
    // GET REQUEST STATUS
    // ==========================================

    const getRequestStatus = (storeId) => {

        const request =
            requests.find(
                item =>
                    item.medicalStore?.id === storeId
            );

        return request?.status || null;
    };


    // ==========================================
    // FILTER STORES
    // ==========================================

    const filteredStores =
        stores.filter((store) => {

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

        });


    // ==========================================
    // STATUS CLASS
    // ==========================================

    const getStatusClass = (status) => {

        if (status === "APPROVED") {
            return "doctor-store-status approved";
        }

        if (status === "REJECTED") {
            return "doctor-store-status rejected";
        }

        return "doctor-store-status pending";
    };


    // ==========================================
    // PAGE
    // ==========================================

    return (

        <div className="doctor-medical-stores">

            {/* ==========================================
                HEADER
            ========================================== */}

            <div className="section-header">

                <div>

                    <h2>
                        Medical Stores
                    </h2>

                    <p>
                        Request to work at approved medical stores.
                    </p>

                </div>

            </div>


            {/* ==========================================
                SUCCESS MESSAGE
            ========================================== */}

            {message && (

                <div className="doctor-store-success">
                    {message}
                </div>

            )}


            {/* ==========================================
                ERROR MESSAGE
            ========================================== */}

            {error && (

                <div className="doctor-store-error">
                    {error}
                </div>

            )}


            {/* ==========================================
                SEARCH
            ========================================== */}

            <div className="doctor-store-search">

                <span>
                    🔍
                </span>

                <input
                    type="text"
                    placeholder="Search medical stores..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />

            </div>


            {/* ==========================================
                LOADING
            ========================================== */}

            {loading && (

                <div className="doctor-store-message">
                    Loading medical stores...
                </div>

            )}


            {/* ==========================================
                NO RESULTS
            ========================================== */}

            {!loading &&
                filteredStores.length === 0 && (

                    <div className="doctor-store-message">

                        <div>
                            🏥
                        </div>

                        <h3>
                            No medical stores found
                        </h3>

                    </div>

                )}


            {/* ==========================================
                STORE LIST
            ========================================== */}

            {!loading &&
                filteredStores.length > 0 && (

                    <div className="doctor-store-list">

                        {filteredStores.map(
                            (store) => {

                                const status =
                                    getRequestStatus(
                                        store.id
                                    );

                                const isApprovedStore =
                                    store.status === "APPROVED";

                                return (

                                    <div
                                        className="doctor-store-card"
                                        key={store.id}
                                    >

                                        <div className="doctor-store-icon">
                                            🏥
                                        </div>

                                        <div className="doctor-store-content">

                                            <h3>
                                                {store.name}
                                            </h3>

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


                                            {!isApprovedStore && (

                                                <span className="doctor-store-not-approved">
                                                    Store awaiting approval
                                                </span>

                                            )}


                                            {status && (

                                                <span
                                                    className={getStatusClass(
                                                        status
                                                    )}
                                                >
                                                    {status}
                                                </span>

                                            )}


                                            {isApprovedStore &&
                                                !status && (

                                                    <button
                                                        className="doctor-store-request-btn"
                                                        disabled={
                                                            requestLoading ===
                                                            store.id
                                                        }
                                                        onClick={() =>
                                                            sendRequest(
                                                                store.id
                                                            )
                                                        }
                                                    >
                                                        {requestLoading ===
                                                        store.id
                                                            ? "Sending..."
                                                            : "Request to Work Here"}
                                                    </button>

                                                )}


                                            {status === "REJECTED" && (

                                                <button
                                                    className="doctor-store-request-btn"
                                                    disabled={
                                                        requestLoading ===
                                                        store.id
                                                    }
                                                    onClick={() =>
                                                        sendRequest(
                                                            store.id
                                                        )
                                                    }
                                                >
                                                    {requestLoading ===
                                                    store.id
                                                        ? "Sending..."
                                                        : "Send Request Again"}
                                                </button>

                                            )}

                                        </div>

                                    </div>

                                );

                            }
                        )}

                    </div>

                )}


            {/* ==========================================
                MY REQUESTS
            ========================================== */}

            {requests.length > 0 && (

                <div className="doctor-my-store-requests">

                    <div className="section-header">

                        <div>

                            <h2>
                                My Store Requests
                            </h2>

                            <p>
                                Track your requests to work at medical stores.
                            </p>

                        </div>

                    </div>


                    <div className="doctor-request-list">

                        {requests.map(
                            (request) => (

                                <div
                                    className="doctor-request-card"
                                    key={request.id}
                                >

                                    <div>

                                        <h3>
                                            {request.medicalStore?.name}
                                        </h3>

                                        <p>
                                            📍{" "}
                                            {
                                                request.medicalStore?.address
                                            }
                                        </p>

                                    </div>

                                    <span
                                        className={getStatusClass(
                                            request.status
                                        )}
                                    >
                                        {request.status}
                                    </span>

                                </div>

                            )
                        )}

                    </div>

                </div>

            )}

        </div>
    );
}

export default DoctorMedicalStores;