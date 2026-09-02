import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../component/Navbar/Navbar";
import Footer from "../../component/Footer/Footer";
import api from "../../api/api";
import "./DoctorOwnProfile.css";

function DoctorOwnProfile() {
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    degree: "",
    qualification: "",
    experience: "",
    consultationFee: "",
    medicalStore: "",
    availableTime: "",
    rating: "",
    imageUrl: "",
  });

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // =========================
  // GET DOCTOR PROFILE
  // =========================

  useEffect(() => {
    const doctorToken = localStorage.getItem("doctorToken");

    if (!doctorToken) {
      navigate("/doctor-login");
      return;
    }

    fetchProfile();
  }, [navigate]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/doctors/profile");

      const data = response.data;

      setDoctor(data);

      setFormData({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        specialization: data.specialization || "",
        degree: data.degree || "",
        qualification: data.qualification || "",
        experience: data.experience ?? "",
        consultationFee: data.consultationFee ?? "",
        medicalStore: data.medicalStore || "",
        availableTime: data.availableTime || "",
        rating: data.rating ?? "",
        imageUrl: data.imageUrl || "",
      });

    } catch (error) {
      console.error("Profile fetch error:", error);

      if (error.response?.status === 401 ||
          error.response?.status === 403) {

        localStorage.removeItem("doctorToken");
        localStorage.removeItem("doctorInfo");

        navigate("/doctor-login");
        return;
      }

      setError(
        error.response?.data?.message ||
        "Unable to load profile"
      );

    } finally {
      setLoading(false);
    }
  };

  // =========================
  // HANDLE INPUT
  // =========================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // UPDATE PROFILE
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");
    setSaving(true);

    try {
      const response = await api.put(
        "/doctors/profile",
        {
          name: formData.name,
          phone: formData.phone,
          specialization: formData.specialization,
          degree: formData.degree,
          qualification: formData.qualification,
          experience:
            formData.experience === ""
              ? null
              : Number(formData.experience),
          consultationFee:
            formData.consultationFee === ""
              ? null
              : Number(formData.consultationFee),
          medicalStore: formData.medicalStore,
          availableTime: formData.availableTime,
          imageUrl: formData.imageUrl,
        }
      );

      const updatedDoctor = response.data;

      setDoctor(updatedDoctor);

      setFormData({
        name: updatedDoctor.name || "",
        email: updatedDoctor.email || "",
        phone: updatedDoctor.phone || "",
        specialization: updatedDoctor.specialization || "",
        degree: updatedDoctor.degree || "",
        qualification: updatedDoctor.qualification || "",
        experience: updatedDoctor.experience ?? "",
        consultationFee:
          updatedDoctor.consultationFee ?? "",
        medicalStore: updatedDoctor.medicalStore || "",
        availableTime:
          updatedDoctor.availableTime || "",
        rating: updatedDoctor.rating ?? "",
        imageUrl: updatedDoctor.imageUrl || "",
      });

      // Keep doctorInfo in localStorage updated
      localStorage.setItem(
        "doctorInfo",
        JSON.stringify(updatedDoctor)
      );

      setMessage("Profile updated successfully");
      setEditing(false);

    } catch (error) {
      console.error("Profile update error:", error);

      setError(
        error.response?.data?.message ||
        "Unable to update profile"
      );

    } finally {
      setSaving(false);
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="doctor-own-profile-page">
          <div className="doctor-own-profile-card">
            <h2>Loading profile...</h2>
          </div>
        </div>

        <Footer />
      </>
    );
  }

  if (!doctor) {
    return (
      <>
        <Navbar />

        <div className="doctor-own-profile-page">
          <div className="doctor-own-profile-card">
            <h2>Unable to load profile</h2>

            {error && (
              <p className="error-message">
                {error}
              </p>
            )}
          </div>
        </div>

        <Footer />
      </>
    );
  }

  // =========================
  // PROFILE VIEW
  // =========================

  return (
    <>
      <Navbar />

      <div className="doctor-own-profile-page">

        <div className="doctor-own-profile-card">

          <h1>My Profile</h1>

          {message && (
            <p className="success-message">
              {message}
            </p>
          )}

          {error && (
            <p className="error-message">
              {error}
            </p>
          )}

          {!editing ? (
            <>
              <div className="doctor-own-profile-header">

                {doctor.imageUrl ? (
                  <img
                    src={doctor.imageUrl}
                    alt={doctor.name}
                    className="doctor-own-profile-image"
                  />
                ) : (
                  <div className="doctor-own-profile-placeholder">
                    {doctor.name?.charAt(0)?.toUpperCase()}
                  </div>
                )}

                <div>
                  <h2>{doctor.name}</h2>

                  {doctor.specialization && (
                    <p>{doctor.specialization}</p>
                  )}
                </div>

              </div>

              <div className="profile-info">

                <div className="profile-info-row">
                  <strong>Email</strong>
                  <span>{doctor.email}</span>
                </div>

                <div className="profile-info-row">
                  <strong>Phone</strong>
                  <span>{doctor.phone}</span>
                </div>

                <div className="profile-info-row">
                  <strong>Specialization</strong>
                  <span>
                    {doctor.specialization || "Not provided"}
                  </span>
                </div>

                <div className="profile-info-row">
                  <strong>Degree</strong>
                  <span>
                    {doctor.degree || "Not provided"}
                  </span>
                </div>

                <div className="profile-info-row">
                  <strong>Qualification</strong>
                  <span>
                    {doctor.qualification || "Not provided"}
                  </span>
                </div>

                <div className="profile-info-row">
                  <strong>Experience</strong>
                  <span>
                    {doctor.experience !== null &&
                    doctor.experience !== undefined
                      ? `${doctor.experience} years`
                      : "Not provided"}
                  </span>
                </div>

                <div className="profile-info-row">
                  <strong>Consultation Fee</strong>
                  <span>
                    {doctor.consultationFee !== null &&
                    doctor.consultationFee !== undefined
                      ? `₹${doctor.consultationFee}`
                      : "Not provided"}
                  </span>
                </div>

                <div className="profile-info-row">
                  <strong>Medical Store</strong>
                  <span>
                    {doctor.medicalStore || "Not provided"}
                  </span>
                </div>

                <div className="profile-info-row">
                  <strong>Available Time</strong>
                  <span>
                    {doctor.availableTime || "Not provided"}
                  </span>
                </div>

                <div className="profile-info-row">
                  <strong>Rating</strong>
                  <span>
                    {doctor.rating !== null &&
                    doctor.rating !== undefined
                      ? `⭐ ${doctor.rating}`
                      : "Not rated yet"}
                  </span>
                </div>

              </div>

              <button
                className="edit-profile-btn"
                onClick={() => {
                  setMessage("");
                  setError("");
                  setEditing(true);
                }}
              >
                Edit Profile
              </button>
            </>
          ) : (

            // =========================
            // EDIT PROFILE
            // =========================

            <form
              className="doctor-profile-form"
              onSubmit={handleSubmit}
            >

              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                disabled
              />

              <label>Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />

              <label>Specialization</label>
              <input
                type="text"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
              />

              <label>Degree</label>
              <input
                type="text"
                name="degree"
                value={formData.degree}
                onChange={handleChange}
              />

              <label>Qualification</label>
              <input
                type="text"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
              />

              <label>Experience (years)</label>
              <input
                type="number"
                name="experience"
                min="0"
                value={formData.experience}
                onChange={handleChange}
              />

              <label>Consultation Fee</label>
              <input
                type="number"
                name="consultationFee"
                min="0"
                value={formData.consultationFee}
                onChange={handleChange}
              />

              <label>Medical Store</label>
              <input
                type="text"
                name="medicalStore"
                value={formData.medicalStore}
                onChange={handleChange}
              />

              <label>Available Time</label>
              <input
                type="text"
                name="availableTime"
                placeholder="e.g. 10 AM - 2 PM"
                value={formData.availableTime}
                onChange={handleChange}
              />

              <label>Profile Image URL</label>
              <input
                type="url"
                name="imageUrl"
                placeholder="https://..."
                value={formData.imageUrl}
                onChange={handleChange}
              />

              <div className="profile-form-buttons">

                <button
                  type="submit"
                  className="save-profile-btn"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </button>

                <button
                  type="button"
                  className="cancel-profile-btn"
                  disabled={saving}
                  onClick={() => {
                    setEditing(false);
                    setError("");
                    setMessage("");
                  }}
                >
                  Cancel
                </button>

              </div>

            </form>
          )}

        </div>

      </div>

      <Footer />
    </>
  );
}

export default DoctorOwnProfile;