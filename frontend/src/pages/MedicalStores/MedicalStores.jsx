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
                    "Unable to load medical stores."
                );

            } finally {

                setLoading(false);

            }
        };

        fetchStores();

    }, []);

    // ==========================================
    // FILTER STORES
    // ==========================================

    const filteredStores = stores.filter((store) => {

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

                    {loading && (

                        <div className="medical-store-message">

                            <h2>
                                Loading medical stores...
                            </h2>

                        </div>

                    )}


                    {!loading && error && (

                        <div className="medical-store-message">

                            <h2>
                                {error}
                            </h2>

                        </div>

                    )}


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


                    {!loading &&
                        !error &&
                        filteredStores.length > 0 && (

                            filteredStores.map(
                                (store) => (

                                    <div
                                        className="medical-store-card"
                                        key={store.id}
                                    >

                                        <div className="medical-store-card-icon">
                                            🏥
                                        </div>

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

                                        </div>

                                    </div>

                                )
                            )

                        )}

                </div>

            </div>

            <Footer />
        </>
    );
}

export default MedicalStores;