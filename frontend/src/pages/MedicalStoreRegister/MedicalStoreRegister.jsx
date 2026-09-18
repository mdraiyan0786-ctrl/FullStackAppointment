import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../component/Navbar/Navbar";
import Footer from "../../component/Footer/Footer";
import api from "../../api/api";

import "./MedicalStoreRegister.css";


function MedicalStoreRegister() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        storeName: "",
        address: "",
        storePhone: "",
        description: "",
        openingTime: "",
        closingTime: "",
        adminName: "",
        adminEmail: "",
        adminPhone: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    // ==========================================
    // HANDLE INPUT
    // ==========================================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

    };


    // ==========================================
    // REGISTER MEDICAL STORE
    // ==========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");


        // ==========================================
        // BASIC VALIDATION
        // ==========================================

        if (
            !formData.storeName.trim() ||
            !formData.address.trim() ||
            !formData.storePhone.trim() ||
            !formData.adminName.trim() ||
            !formData.adminEmail.trim() ||
            !formData.adminPhone.trim() ||
            !formData.password.trim() ||
            !formData.openingTime ||
            !formData.closingTime
        ) {

            setError(
                "Please fill in all required fields."
            );

            return;
        }


        try {

            setLoading(true);


            // ==========================================
            // SEND DATA TO BACKEND
            // ==========================================

            const response = await api.post(
                "/medical-stores/register",
                {
                    adminName: formData.adminName.trim(),
                    email: formData.adminEmail.trim(),
                    password: formData.password,
                    phone: formData.adminPhone.trim(),

                    storeName: formData.storeName.trim(),
                    address: formData.address.trim(),
                    storePhone: formData.storePhone.trim(),

                    description:
                        formData.description.trim(),

                    openingTime:
                        formData.openingTime,

                    closingTime:
                        formData.closingTime
                }
            );


            console.log(
                "Medical store registration successful:",
                response.data
            );


            // ==========================================
            // SUCCESS
            // ==========================================

            setSuccess(
                "Medical store registered successfully! Your store is waiting for approval."
            );


            // ==========================================
            // REDIRECT
            // ==========================================

            setTimeout(() => {

                navigate("/");

            }, 1800);


        } catch (error) {

            console.error(
                "MEDICAL STORE REGISTRATION ERROR:",
                error
            );

            console.log(
                "STATUS:",
                error.response?.status
            );

            console.log(
                "RESPONSE DATA:",
                error.response?.data
            );


            const backendMessage =
                error.response?.data?.message;


            if (backendMessage) {

                setError(backendMessage);

            } else if (typeof error.response?.data === "string") {

                setError(error.response.data);

            } else {

                setError(
                    `Registration failed (${error.response?.status || "unknown error"}).`
                );

            }


        } finally {

            setLoading(false);

        }

    };


    // ==========================================
    // PAGE
    // ==========================================

    return (
        <>
            <Navbar />


            <div className="medical-store-register-page">

                <div className="medical-store-register-container">


                    {/* ==========================================
                        HEADER
                    ========================================== */}

                    <div className="medical-store-register-header">

                        <div className="register-store-icon">
                            🏥
                        </div>

                        <h1>
                            Register Your Medical Store
                        </h1>

                        <p>
                            Create a medical store account and
                            connect with doctors and patients.
                        </p>

                    </div>


                    {/* ==========================================
                        FORM
                    ========================================== */}

                    <form
                        className="medical-store-register-form"
                        onSubmit={handleSubmit}
                    >


                        {/* ==========================================
                            STORE INFORMATION
                        ========================================== */}

                        <div className="form-section">

                            <h2>
                                Medical Store Information
                            </h2>


                            {/* STORE NAME */}

                            <div className="form-group">

                                <label>
                                    Store Name *
                                </label>

                                <input
                                    type="text"
                                    name="storeName"
                                    placeholder="Enter medical store name"
                                    value={formData.storeName}
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                            {/* ADDRESS */}

                            <div className="form-group">

                                <label>
                                    Address *
                                </label>

                                <textarea
                                    name="address"
                                    placeholder="Enter complete store address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    rows="3"
                                    required
                                />

                            </div>


                            {/* PHONE + DESCRIPTION */}

                            <div className="form-row">

                                <div className="form-group">

                                    <label>
                                        Store Phone *
                                    </label>

                                    <input
                                        type="tel"
                                        name="storePhone"
                                        placeholder="Store phone number"
                                        value={formData.storePhone}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        Description
                                    </label>

                                    <input
                                        type="text"
                                        name="description"
                                        placeholder="Short description"
                                        value={formData.description}
                                        onChange={handleChange}
                                    />

                                </div>

                            </div>


                            {/* OPENING + CLOSING TIME */}

                            <div className="form-row">

                                <div className="form-group">

                                    <label>
                                        Opening Time *
                                    </label>

                                    <input
                                        type="time"
                                        name="openingTime"
                                        value={formData.openingTime}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        Closing Time *
                                    </label>

                                    <input
                                        type="time"
                                        name="closingTime"
                                        value={formData.closingTime}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>

                            </div>

                        </div>


                        {/* ==========================================
                            ADMIN INFORMATION
                        ========================================== */}

                        <div className="form-section">

                            <h2>
                                Store Admin Account
                            </h2>


                            {/* ADMIN NAME */}

                            <div className="form-group">

                                <label>
                                    Admin Name *
                                </label>

                                <input
                                    type="text"
                                    name="adminName"
                                    placeholder="Enter admin name"
                                    value={formData.adminName}
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                            {/* EMAIL + PHONE */}

                            <div className="form-row">

                                <div className="form-group">

                                    <label>
                                        Admin Email *
                                    </label>

                                    <input
                                        type="email"
                                        name="adminEmail"
                                        placeholder="admin@example.com"
                                        value={formData.adminEmail}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        Admin Phone *
                                    </label>

                                    <input
                                        type="tel"
                                        name="adminPhone"
                                        placeholder="Admin phone number"
                                        value={formData.adminPhone}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>

                            </div>


                            {/* PASSWORD */}

                            <div className="form-group">

                                <label>
                                    Password *
                                </label>

                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Create a password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                        </div>


                        {/* ==========================================
                            ERROR
                        ========================================== */}

                        {error && (

                            <div className="register-error">
                                {error}
                            </div>

                        )}


                        {/* ==========================================
                            SUCCESS
                        ========================================== */}

                        {success && (

                            <div className="register-success">
                                {success}
                            </div>

                        )}


                        {/* ==========================================
                            SUBMIT
                        ========================================== */}

                        <button
                            type="submit"
                            className="medical-store-register-btn"
                            disabled={loading}
                        >

                            {loading
                                ? "Registering..."
                                : "Register Medical Store"}

                        </button>


                        <p className="approval-note">
                            Your store will be reviewed before it
                            becomes available on the platform.
                        </p>

                    </form>

                </div>

            </div>


            <Footer />
        </>
    );
}


export default MedicalStoreRegister;