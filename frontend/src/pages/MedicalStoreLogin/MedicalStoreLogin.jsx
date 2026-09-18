import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import "./MedicalStoreLogin.css";

function MedicalStoreLogin() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (!formData.email.trim() || !formData.password) {
            setError("Please enter email and password.");
            return;
        }

        try {
            setLoading(true);

            const response = await api.post(
                "/medical-stores/login",
                {
                    email: formData.email.trim(),
                    password: formData.password
                }
            );

            console.log("Store admin login response:", response.data);

            // Save authentication
            localStorage.setItem(
                "storeAdminToken",
                response.data.token
            );

            // Save store information
            localStorage.setItem(
                "storeAdminInfo",
                JSON.stringify({
                    userId: response.data.userId,
                    name: response.data.name,
                    email: response.data.email,
                    role: response.data.role,
                    storeId: response.data.storeId,
                    storeName: response.data.storeName
                })
            );

            // Go to store dashboard
            navigate("/store-admin-dashboard");

        } catch (error) {
            console.error("Store admin login error:", error);

            const message =
                error.response?.data?.message ||
                "Invalid email or password.";

            setError(message);

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="store-login-page">

            <div className="store-login-card">

                <h1>Medical Store Login</h1>

                <p className="store-login-subtitle">
                    Login to manage your medical store
                </p>

                {error && (
                    <div className="store-login-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <div className="store-login-field">
                        <label>Email</label>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="store-login-field">
                        <label>Password</label>

                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="store-login-button"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                </form>

                <div className="store-login-register">
                    Don't have a medical store account?{" "}
                    <span
                        onClick={() =>
                            navigate("/medical-store-register")
                        }
                    >
                        Register your store
                    </span>
                </div>

            </div>

        </div>
    );
}

export default MedicalStoreLogin;