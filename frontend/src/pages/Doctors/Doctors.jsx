import { useEffect, useState } from "react";
import Navbar from "../../component/Navbar/Navbar";
import Footer from "../../component/Footer/Footer";
import DoctorCard from "../../component/DoctorCard/DoctorCard";
import api from "../../api/api";
import "./Doctors.css";

function Doctors() {

    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    const [maxFee, setMaxFee] = useState("");
    const [minExperience, setMinExperience] = useState("");


    // ==========================================
    // GET DOCTORS
    // ==========================================

    useEffect(() => {

        const fetchDoctors = async () => {

            try {

                const response =
                    await api.get("/doctors");

                if (Array.isArray(response.data)) {

                    setDoctors(response.data);

                } else {

                    console.error(
                        "Expected an array but received:",
                        response.data
                    );

                    setDoctors([]);

                }

            } catch (error) {

                console.error(
                    "Failed to fetch doctors:",
                    error
                );

                setError(
                    "Unable to load doctors."
                );

            } finally {

                setLoading(false);

            }
        };

        fetchDoctors();

    }, []);


    // ==========================================
    // FILTER DOCTORS
    // ==========================================

    const filteredDoctors = doctors.filter((doctor) => {

        const doctorName =
            doctor.name?.toLowerCase() || "";

        const specialization =
            doctor.specialization?.toLowerCase() || "";

        const searchValue =
            search.trim().toLowerCase();


        // SEARCH
        const searchMatch =
            doctorName.includes(searchValue) ||
            specialization.includes(searchValue);


        // SPECIALIZATION
        const categoryMatch =
            selectedCategory === "All" ||
            doctor.specialization === selectedCategory;


        // MAX FEE
        const feeMatch =
            maxFee === "" ||
            Number(doctor.consultationFee || 0)
                <= Number(maxFee);


        // MIN EXPERIENCE
        const experienceMatch =
            minExperience === "" ||
            Number(doctor.experience || 0)
                >= Number(minExperience);


        return (
            searchMatch &&
            categoryMatch &&
            feeMatch &&
            experienceMatch
        );

    });


    // ==========================================
    // CLEAR FILTERS
    // ==========================================

    const clearFilters = () => {

        setSearch("");
        setSelectedCategory("All");
        setMaxFee("");
        setMinExperience("");

    };


    // ==========================================
    // PAGE
    // ==========================================

    return (
        <>
            <Navbar />

            <div className="doctors-page">

                {/* ==========================================
                    HEADER
                ========================================== */}

                <div className="doctors-header">

                    <h1>
                        Find Your Doctor
                    </h1>

                    <p>
                        Browse experienced doctors and
                        book your appointment quickly
                        and securely.
                    </p>

                </div>


                {/* ==========================================
                    SEARCH
                ========================================== */}

                <div className="search-container">

                    <span className="search-icon">
                        🔍
                    </span>

                    <input
                        type="text"
                        className="search-bar"
                        placeholder="Search by doctor name or specialization..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                </div>


                {/* ==========================================
                    SPECIALIZATION
                ========================================== */}

                <div className="filter-buttons">

                    <button
                        className={
                            selectedCategory === "All"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setSelectedCategory("All")
                        }
                    >
                        All
                    </button>

                    <button
                        className={
                            selectedCategory === "Cardiologist"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setSelectedCategory(
                                "Cardiologist"
                            )
                        }
                    >
                        Cardiologist
                    </button>

                    <button
                        className={
                            selectedCategory === "Dentist"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setSelectedCategory(
                                "Dentist"
                            )
                        }
                    >
                        Dentist
                    </button>

                    <button
                        className={
                            selectedCategory === "Neurologist"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setSelectedCategory(
                                "Neurologist"
                            )
                        }
                    >
                        Neurologist
                    </button>

                    <button
                        className={
                            selectedCategory === "Orthopedic"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setSelectedCategory(
                                "Orthopedic"
                            )
                        }
                    >
                        Orthopedic
                    </button>

                </div>


                {/* ==========================================
                    ADVANCED FILTERS
                ========================================== */}

                <div className="advanced-filters">

                    {/* MAX FEE */}

                    <div className="filter-group">

                        <label>
                            Maximum Consultation Fee
                        </label>

                        <select
                            value={maxFee}
                            onChange={(e) =>
                                setMaxFee(e.target.value)
                            }
                        >

                            <option value="">
                                Any Fee
                            </option>

                            <option value="200">
                                ₹200 or less
                            </option>

                            <option value="500">
                                ₹500 or less
                            </option>

                            <option value="1000">
                                ₹1000 or less
                            </option>

                            <option value="2000">
                                ₹2000 or less
                            </option>

                        </select>

                    </div>


                    {/* EXPERIENCE */}

                    <div className="filter-group">

                        <label>
                            Minimum Experience
                        </label>

                        <select
                            value={minExperience}
                            onChange={(e) =>
                                setMinExperience(
                                    e.target.value
                                )
                            }
                        >

                            <option value="">
                                Any Experience
                            </option>

                            <option value="1">
                                1+ years
                            </option>

                            <option value="3">
                                3+ years
                            </option>

                            <option value="5">
                                5+ years
                            </option>

                            <option value="10">
                                10+ years
                            </option>

                            <option value="15">
                                15+ years
                            </option>

                        </select>

                    </div>


                    {/* CLEAR */}

                    {(search ||
                        selectedCategory !== "All" ||
                        maxFee ||
                        minExperience) && (

                        <button
                            className="clear-filters-btn"
                            onClick={clearFilters}
                        >
                            Clear Filters
                        </button>

                    )}

                </div>


                {/* ==========================================
                    RESULT COUNT
                ========================================== */}

                {!loading && !error && (

                    <div className="doctor-results-info">

                        <p>
                            Showing{" "}
                            <strong>
                                {filteredDoctors.length}
                            </strong>{" "}
                            {filteredDoctors.length === 1
                                ? "doctor"
                                : "doctors"}
                        </p>

                    </div>

                )}


                {/* ==========================================
                    DOCTORS
                ========================================== */}

                <div className="doctor-list">

                    {loading && (

                        <div>
                            <h2>
                                Loading doctors...
                            </h2>
                        </div>

                    )}


                    {!loading && error && (

                        <div>
                            <h2>
                                {error}
                            </h2>
                        </div>

                    )}


                    {!loading &&
                        !error &&
                        filteredDoctors.length === 0 && (

                            <div className="no-doctors">

                                <div>
                                    🔍
                                </div>

                                <h2>
                                    No doctors found
                                </h2>

                                <p>
                                    Try changing your search
                                    or filters.
                                </p>

                                <button
                                    onClick={clearFilters}
                                    className="clear-filters-btn"
                                >
                                    Clear Filters
                                </button>

                            </div>

                        )}


                    {!loading &&
                        !error &&
                        filteredDoctors.length > 0 && (

                            filteredDoctors.map(
                                (doctor) => (

                                    <DoctorCard
                                        key={doctor.id}
                                        doctor={doctor}
                                    />

                                )
                            )

                        )}

                </div>

            </div>

            <Footer />
        </>
    );
}

export default Doctors;