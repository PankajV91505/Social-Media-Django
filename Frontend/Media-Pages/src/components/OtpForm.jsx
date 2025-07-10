import { useState } from "react";
import { useNavigate } from "react-router-dom";

const OtpForm = ({ email }) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const response = await fetch("http://localhost:8000/api/verify-otp/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // ✅ needed for session
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMsg("Signup successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(data.error || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleVerify}>
      <h5 className="text-center mb-3">Enter OTP sent to <strong>{email}</strong></h5>

      {error && <div className="alert alert-danger text-center">{error}</div>}
      {successMsg && <div className="alert alert-success text-center">{successMsg}</div>}

      <div className="mb-3">
        <input
          type="text"
          className="form-control text-center fs-5"
          maxLength={6}
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
      </div>

      <button
        type="submit"
        className="btn btn-success w-100"
        disabled={loading || otp.length !== 6}
      >
        {loading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2"></span>
            Verifying...
          </>
        ) : (
          "Verify OTP & Signup"
        )}
      </button>
    </form>
  );
};

export default OtpForm;
