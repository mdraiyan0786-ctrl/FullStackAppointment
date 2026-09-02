import { useState } from "react";
import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import api from "../../api/api";
import "./ForgotPassword.css";

function ForgotPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Determine where the user came from
  const accountType = searchParams.get("type") || "patient";

  const loginPath =
    accountType === "doctor"
      ? "/doctor-login"
      : "/login";

  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================
  // STEP 1 - REQUEST OTP
  // =========================

  const handleRequestOtp = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await api.post(
        "/forgot-password/request-otp",
        {
          email,
        }
      );

      setMessage(
        response.data.message || "OTP sent successfully"
      );

      setStep(2);

    } catch (error) {
      console.error("Request OTP error:", error);

      setError(
        error.response?.data?.message ||
        "Unable to send OTP"
      );

    } finally {
      setLoading(false);
    }
  };

  // =========================
  // STEP 2 - VERIFY OTP
  // =========================

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await api.post(
        "/forgot-password/verify-otp",
        {
          email,
          otp,
        }
      );

      setResetToken(response.data.resetToken);

      setMessage(
        response.data.message ||
        "OTP verified successfully"
      );

      setStep(3);

    } catch (error) {
      console.error("Verify OTP error:", error);

      setError(
        error.response?.data?.message ||
        "Invalid or expired OTP"
      );

    } finally {
      setLoading(false);
    }
  };

  // =========================
  // STEP 3 - RESET PASSWORD
  // =========================

  const handleResetPassword = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post(
        "/forgot-password/reset",
        {
          resetToken,
          newPassword,
        }
      );

      setMessage(
        response.data.message ||
        "Password reset successfully"
      );

      setTimeout(() => {
        navigate(loginPath);
      }, 1500);

    } catch (error) {
      console.error("Reset password error:", error);

      setError(
        error.response?.data?.message ||
        "Unable to reset password"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">

      <div className="forgot-password-card">

        <h1>Forgot Password</h1>

        {/* =========================
            STEP 1
        ========================= */}

        {step === 1 && (
          <>
            <p>
              Enter your email address and we'll send you
              a verification OTP.
            </p>

            {error && (
              <p className="error-message">
                {error}
              </p>
            )}

            <form onSubmit={handleRequestOtp}>

              <label>Email</label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <button
                type="submit"
                disabled={loading}
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>

            </form>
          </>
        )}

        {/* =========================
            STEP 2
        ========================= */}

        {step === 2 && (
          <>
            <p>
              Enter the OTP sent to:
            </p>

            <strong>{email}</strong>

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

            <form onSubmit={handleVerifyOtp}>

              <label>OTP</label>

              <input
                type="text"
                inputMode="numeric"
                maxLength="6"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) =>
                  setOtp(
                    e.target.value.replace(/\D/g, "")
                  )
                }
                required
              />

              <button
                type="submit"
                disabled={loading}
              >
                {loading
                  ? "Verifying..."
                  : "Verify OTP"}
              </button>

            </form>

            <button
              type="button"
              className="back-button"
              onClick={() => {
                setStep(1);
                setOtp("");
                setError("");
                setMessage("");
              }}
            >
              Change Email
            </button>
          </>
        )}

        {/* =========================
            STEP 3
        ========================= */}

        {step === 3 && (
          <>
            <p>
              OTP verified. Enter your new password.
            </p>

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

            <form onSubmit={handleResetPassword}>

              <label>New Password</label>

              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(e.target.value)
                }
                required
              />

              <label>Confirm Password</label>

              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                required
              />

              <button
                type="submit"
                disabled={loading}
              >
                {loading
                  ? "Resetting Password..."
                  : "Reset Password"}
              </button>

            </form>
          </>
        )}

        <p className="login-link-text">
          Remember your password?{" "}

          <Link to={loginPath}>
            Login
          </Link>
        </p>

      </div>

    </div>
  );
}

export default ForgotPassword;