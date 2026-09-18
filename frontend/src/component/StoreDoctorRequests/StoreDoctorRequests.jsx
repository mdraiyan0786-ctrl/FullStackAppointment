import { useEffect, useState } from "react";
import api from "../../api/api";
import "./StoreDoctorRequests.css";

function StoreDoctorRequests() {

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");


    // ==========================================
    // FETCH REQUESTS
    // ==========================================

    const fetchRequests = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await api.get(
                    "/doctor-store-requests/admin"
                );

            if (Array.isArray(response.data)) {
                setRequests(response.data);
            } else {
                setRequests([]);
            }

        } catch (error) {

            console.error(
                "Failed to fetch doctor requests:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to load doctor requests."
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        fetchRequests();

    }, []);


    // ==========================================
    // APPROVE REQUEST
    // ==========================================

    const approveRequest = async (requestId) => {

        try {

            setActionLoading(requestId);
            setError("");
            setMessage("");

            await api.put(
                `/doctor-store-requests/${requestId}/approve`
            );

            setMessage(
                "Doctor request approved successfully."
            );

            await fetchRequests();

        } catch (error) {

            console.error(
                "Failed to approve request:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to approve request."
            );

        } finally {

            setActionLoading(null);

        }
    };


    // ==========================================
    // REJECT REQUEST
    // ==========================================

    const rejectRequest = async (requestId) => {

        try {

            setActionLoading(requestId);
            setError("");
            setMessage("");

            await api.put(
                `/doctor-store-requests/${requestId}/reject`
            );

            setMessage(
                "Doctor request rejected."
            );

            await fetchRequests();

        } catch (error) {

            console.error(
                "Failed to reject request:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to reject request."
            );

        } finally {

            setActionLoading(null);

        }
    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (
            <div className="store-doctor-requests">
                <div className="store-request-message">
                    Loading doctor requests...
                </div>
            </div>
        );
    }


    // ==========================================
    // PAGE
    // ==========================================

    return (

        <div className="store-doctor-requests">

            <div className="store-request-header">

                <div>

                    <h2>
                        Doctor Requests
                    </h2>

                    <p>
                        Manage doctors who want to work at your store.
                    </p>

                </div>

            </div>


            {/* SUCCESS */}

            {message && (

                <div className="store-request-success">
                    {message}
                </div>

            )}


            {/* ERROR */}

            {error && (

                <div className="store-request-error">
                    {error}
                </div>

            )}


            {/* EMPTY */}

            {requests.length === 0 && (

                <div className="store-request-message">

                    <div className="store-request-empty-icon">
                        🩺
                    </div>

                    <h3>
                        No doctor requests
                    </h3>

                    <p>
                        There are currently no doctors requesting to work at your store.
                    </p>

                </div>

            )}


            {/* REQUEST LIST */}

            {requests.length > 0 && (

                <div className="store-request-list">

                    {requests.map((request) => {

                        const doctor =
                            request.doctor;

                        const isPending =
                            request.status === "PENDING";

                        return (

                            <div
                                className="store-request-card"
                                key={request.id}
                            >

                                {/* DOCTOR INFO */}

                                <div className="store-request-doctor">

                                    <div className="store-request-doctor-icon">
                                        🩺
                                    </div>

                                    <div>

                                        <h3>
                                            {doctor?.name ||
                                                "Doctor"}
                                        </h3>

                                        <p>
                                            {doctor?.specialization ||
                                                "Specialization not provided"}
                                        </p>

                                    </div>

                                </div>


                                {/* DETAILS */}

                                <div className="store-request-details">

                                    <p>
                                        📧{" "}
                                        {doctor?.email ||
                                            "Not available"}
                                    </p>

                                    <p>
                                        📞{" "}
                                        {doctor?.phone ||
                                            "Not available"}
                                    </p>

                                    {doctor?.qualification && (
                                        <p>
                                            🎓{" "}
                                            {doctor.qualification}
                                        </p>
                                    )}

                                    {doctor?.experience !==
                                        null &&
                                        doctor?.experience !==
                                        undefined && (
                                            <p>
                                                💼{" "}
                                                {doctor.experience} years
                                                experience
                                            </p>
                                        )}

                                </div>


                                {/* STATUS / ACTIONS */}

                                <div className="store-request-actions">

                                    <span
                                        className={`store-request-status ${request.status.toLowerCase()}`}
                                    >
                                        {request.status}
                                    </span>


                                    {isPending && (

                                        <div className="store-request-buttons">

                                            <button
                                                className="store-request-approve"
                                                disabled={
                                                    actionLoading ===
                                                    request.id
                                                }
                                                onClick={() =>
                                                    approveRequest(
                                                        request.id
                                                    )
                                                }
                                            >
                                                {actionLoading ===
                                                request.id
                                                    ? "Processing..."
                                                    : "Accept"}
                                            </button>


                                            <button
                                                className="store-request-reject"
                                                disabled={
                                                    actionLoading ===
                                                    request.id
                                                }
                                                onClick={() =>
                                                    rejectRequest(
                                                        request.id
                                                    )
                                                }
                                            >
                                                {actionLoading ===
                                                request.id
                                                    ? "Processing..."
                                                    : "Reject"}
                                            </button>

                                        </div>

                                    )}

                                </div>

                            </div>

                        );

                    })}

                </div>

            )}

        </div>
    );
}

export default StoreDoctorRequests;