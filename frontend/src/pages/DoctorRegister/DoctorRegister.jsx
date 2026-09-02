import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/api";
import "./DoctorRegister.css";

function DoctorRegister() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    specialization: "",
    qualification: "",
    degree: "",
    experience: "",
    consultationFee: "",
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

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await api.post("/doctors/register", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        specialization: formData.specialization,
        qualification: formData.qualification,
        degree: formData.degree,
        experience: formData.experience
          ? Number(formData.experience)
          : null,
        consultationFee: formData.consultationFee
          ? Number(formData.consultationFee)
          : null,
      });

      alert("Registration successful! Please login.");

      navigate("/doctor-login");
    } catch (error) {
      console.error("Doctor register error:", error);

      setError(
        error.response?.data?.message ||
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="doctor-register-container">

      <div className="doctor-register-card">

        <h1>Doctor Registration</h1>

        <p>Register to manage appointments on our platform</p>

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>

          <label>Full Name</label>
          <input
            type="text"
            name="name"
            placeholder="Dr. Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>Phone Number</label>
          <input
            type="tel"
            name="phone"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          <label>Specialization</label>
          <input
            type="text"
            name="specialization"
            placeholder="e.g. Dermatologist"
            value={formData.specialization}
            onChange={handleChange}
            required
          />

          <label>Qualification</label>
          <input
            type="text"
            name="qualification"
            placeholder="e.g. MD Dermatology"
            value={formData.qualification}
            onChange={handleChange}
          />

          <label>Degree</label>
          <input
            type="text"
            name="degree"
            placeholder="e.g. MBBS, MD"
            value={formData.degree}
            onChange={handleChange}
          />

          <label>Experience (years)</label>
          <input
            type="number"
            name="experience"
            placeholder="e.g. 5"
            value={formData.experience}
            onChange={handleChange}
            min="0"
          />

          <label>Consultation Fee</label>
          <input
            type="number"
            name="consultationFee"
            placeholder="e.g. 400"
            value={formData.consultationFee}
            onChange={handleChange}
            min="0"
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>

        </form>

        <p className="login-text">
          Already registered?{" "}
          <Link to="/doctor-login" className="login-link">
            Login
          </Link>
        </p>
      </div>

    </div>
  );
}

export default DoctorRegister;