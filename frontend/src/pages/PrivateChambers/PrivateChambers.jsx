import { useEffect, useState } from "react";
import api from "../../api/api";
import "./PrivateChambers.css";

function PrivateChambers() {

    const [chambers, setChambers] = useState([]);

    const [formData, setFormData] = useState({
        name: "",
        address: "",
        phone: ""
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const fetchChambers = async () => {
        try {
            const response =
                await api.get("/private-chambers/my");

            setChambers(response.data);

        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to load chambers"
            );
        }
    };

    useEffect(() => {
        fetchChambers();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setMessage("");
        setError("");

        try {

            await api.post(
                "/private-chambers",
                formData
            );

            setMessage(
                "Private chamber added successfully."
            );

            setFormData({
                name: "",
                address: "",
                phone: ""
            });

            fetchChambers();

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to create chamber"
            );

        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {

        try {

            await api.delete(
                `/private-chambers/${id}`
            );

            setMessage(
                "Private chamber deleted successfully."
            );

            fetchChambers();

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to delete chamber"
            );
        }
    };

    return (
        <div className="private-chambers-page">

            <div className="private-chambers-container">

                <div className="private-chambers-header">
                    <h1>My Private Chambers</h1>

                    <p>
                        Manage your private clinics and
                        consultation locations.
                    </p>
                </div>


                {/* CREATE CHAMBER */}

                <div className="chamber-form-card">

                    <h2>Add Private Chamber</h2>

                    <form
                        className="chamber-form"
                        onSubmit={handleSubmit}
                    >

                        <div className="form-group">

                            <label>
                                Chamber Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                placeholder="e.g. Rahul Private Clinic"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Address
                            </label>

                            <input
                                type="text"
                                name="address"
                                placeholder="Enter chamber address"
                                value={formData.address}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Phone
                            </label>

                            <input
                                type="text"
                                name="phone"
                                placeholder="Enter contact number"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <button
                            className="add-chamber-btn"
                            type="submit"
                            disabled={loading}
                        >
                            {loading
                                ? "Adding..."
                                : "Add Private Chamber"}
                        </button>

                    </form>

                </div>


                {/* MESSAGES */}

                {message && (
                    <div className="success-message">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}


                {/* CHAMBERS */}

                <div className="chambers-section">

                    <div className="section-title">

                        <h2>
                            Your Chambers
                        </h2>

                        <span>
                            {chambers.length} chamber
                            {chambers.length !== 1
                                ? "s"
                                : ""}
                        </span>

                    </div>


                    {chambers.length === 0 ? (

                        <div className="empty-chambers">

                            <div className="empty-icon">
                                🏥
                            </div>

                            <h3>
                                No private chambers yet
                            </h3>

                            <p>
                                Add your first private chamber
                                to start managing your
                                consultation locations.
                            </p>

                        </div>

                    ) : (

                        <div className="chambers-grid">

                            {chambers.map((chamber) => (

                                <div
                                    className="chamber-card"
                                    key={chamber.id}
                                >

                                    <div className="chamber-card-header">

                                        <div className="chamber-icon">
                                            🏥
                                        </div>

                                        <div>
                                            <h3>
                                                {chamber.name}
                                            </h3>

                                            <span>
                                                Private Chamber
                                            </span>
                                        </div>

                                    </div>


                                    <div className="chamber-details">

                                        <div className="detail-row">

                                            <span className="detail-icon">
                                                📍
                                            </span>

                                            <p>
                                                {chamber.address}
                                            </p>

                                        </div>


                                        <div className="detail-row">

                                            <span className="detail-icon">
                                                📞
                                            </span>

                                            <p>
                                                {chamber.phone}
                                            </p>

                                        </div>

                                    </div>


                                    <div className="chamber-actions">

                                        <button
                                            className="delete-chamber-btn"
                                            onClick={() =>
                                                handleDelete(
                                                    chamber.id
                                                )
                                            }
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </div>

            </div>

        </div>
    );
}

export default PrivateChambers;