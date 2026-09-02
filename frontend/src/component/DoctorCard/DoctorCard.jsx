import "./DoctorCard.css";
import { useNavigate } from "react-router-dom";

function DoctorCard({ doctor }) {

    const navigate = useNavigate();

    const handleBookAppointment = () => {

        navigate("/appointment", {
            state: {
                doctor: doctor
            }
        });

    };

    const rating =
        doctor.rating !== null &&
        doctor.rating !== undefined
            ? Number(doctor.rating).toFixed(1)
            : null;

    return (
        <div className="doctor-card">

            <img
                src={
                    doctor.imageUrl ||
                    "https://via.placeholder.com/300"
                }
                alt={doctor.name}
                className="doctor-image"
            />

            <div className="doctor-info">

                <h2>
                    {doctor.name}
                </h2>

                <p className="specialization">
                    {doctor.specialization}
                </p>

                {/* RATING */}

                <div className="doctor-rating">

                    {rating ? (
                        <>
                            <span className="rating-stars">
                                ★★★★★
                            </span>

                            <strong>
                                {rating}
                            </strong>

                            {doctor.reviewCount !== undefined && (
                                <span className="review-count">
                                    ({doctor.reviewCount}{" "}
                                    {doctor.reviewCount === 1
                                        ? "review"
                                        : "reviews"})
                                </span>
                            )}
                        </>
                    ) : (
                        <span className="no-rating">
                            No reviews yet
                        </span>
                    )}

                </div>


                <p>
                    <strong>Qualification:</strong>{" "}
                    {doctor.qualification || "N/A"}
                </p>

                <p>
                    <strong>Experience:</strong>{" "}
                    {doctor.experience || 0} Years
                </p>

                <p>
                    <strong>Consultation Fee:</strong>{" "}
                    ₹{doctor.consultationFee || 0}
                </p>

                <p>
                    <strong>Medical Store:</strong>{" "}
                    {doctor.medicalStore || "N/A"}
                </p>

                <p>
                    <strong>Available:</strong>{" "}
                    {doctor.availableTime || "N/A"}
                </p>


                <div className="doctor-buttons">

                    <button
                        className="profile-btn"
                        onClick={() =>
                            navigate(
                                `/doctor/${doctor.id}`
                            )
                        }
                    >
                        View Profile
                    </button>

                    <button
                        className="book-btn"
                        onClick={handleBookAppointment}
                    >
                        Book Appointment
                    </button>

                </div>

            </div>

        </div>
    );
}

export default DoctorCard;