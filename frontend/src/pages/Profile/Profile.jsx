import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get("/users/profile");

      setProfile(response.data);
      setName(response.data.name);
      setPhone(response.data.phone);
    } catch (error) {
      console.error("Error fetching profile:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Name cannot be empty.");
      return;
    }

    if (!phone.trim()) {
      alert("Phone number cannot be empty.");
      return;
    }

    try {
      setSaving(true);

      const response = await api.put("/users/profile", {
        name: name.trim(),
        phone: phone.trim(),
      });

      setProfile(response.data);

      setName(response.data.name);
      setPhone(response.data.phone);

      setEditing(false);

      alert("Profile updated successfully.");
    } catch (error) {
      console.error("Error updating profile:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      const message =
        error.response?.data?.message ||
        error.response?.data ||
        "Failed to update profile.";

      alert(message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setName(profile.name);
    setPhone(profile.phone);
    setEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="profile-error">Unable to load profile.</div>;
  }

  return (
    <div className="profile-page">

      <div className="profile-card">

        <div className="profile-header">
          <div className="profile-avatar">
            {profile.name
                ?.split(" ")
                .map((word) => word.charAt(0))
                .slice(0, 2)
                .join("")
                .toUpperCase()}
            </div>

          <div>
            <h1>My Profile</h1>
            <p>Manage your personal information</p>
          </div>
        </div>

        {!editing ? (
          <>
            <div className="profile-details">

              <div className="profile-field">
                <label>Name</label>
                <p>{profile.name}</p>
              </div>

              <div className="profile-field">
                <label>Email</label>
                <p>{profile.email}</p>
              </div>

              <div className="profile-field">
                <label>Phone</label>
                <p>{profile.phone}</p>
              </div>

              <div className="profile-field">
                <label>Role</label>
                <p>{profile.role}</p>
              </div>

              <div className="profile-field">
                <label>Member Since</label>
                <p>
                  {new Date(profile.createdAt).toLocaleDateString()}
                </p>
              </div>

            </div>

            <div className="profile-actions">
              <button
                className="edit-profile-btn"
                onClick={() => setEditing(true)}
              >
                Edit Profile
              </button>

              <button
                className="medical-history-btn"
                onClick={() => navigate("/medical-history")}
              >
                🩺 Medical History
              </button>

              <button
                className="logout-btn"
                onClick={handleLogout}
              >
                Logout
              </button>

            </div>
          </>
        ) : (
          <form onSubmit={handleSave} className="profile-form">

            <div className="form-group">
              <label>Name</label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>

            <div className="form-group">
              <label>Email</label>

              <input
                type="email"
                value={profile.email}
                disabled
              />

              <small>
                Email cannot be changed.
              </small>
            </div>

            <div className="form-group">
              <label>Phone</label>

              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
              />
            </div>

            <div className="profile-actions">

              <button
                type="submit"
                className="save-profile-btn"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>

              <button
                type="button"
                className="cancel-profile-btn"
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </button>

            </div>

          </form>
        )}

      </div>

    </div>
  );
}

export default Profile;