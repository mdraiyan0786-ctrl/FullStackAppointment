import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/api";
import "./DoctorLogin.css";

function DoctorLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/doctors/login", formData);

      // Save doctor JWT and info separately from user token
      localStorage.setItem("doctorToken", response.data.token);
      localStorage.setItem(
        "doctorInfo",
        JSON.stringify(response.data.doctor)
      );

        alert("Login successful!");

        navigate("/doctor-dashboard");
    } catch (error) {
      console.error("Doctor login error:", error);

      setError(
        error.response?.data?.message || "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="doctor-login-page">

      <div className="doctor-login-card">

        <h1>Doctor Login</h1>

        <p>Sign in to manage your appointments</p>

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>

          <label>Email</label>

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>Password</label>

          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <p className="forgot-password-text">
  <Link
    to="/forgot-password?type=doctor"
    className="forgot-password-link"
  >
    Forgot Password?
  </Link>
</p>

          <button
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p className="register-text">
          Not registered yet?{" "}
          <Link to="/doctor-register" className="register-link">
            Register as Doctor
          </Link>
        </p>

      </div>

    </div>
  );
}

export default DoctorLogin; 