import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("http://localhost:8000/api/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Registration failed");
      }

      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000); // Redirect to login after 2s
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card shadow-lg p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <h3 className="text-center mb-3 text-primary">📝 Sign Up</h3>

        {error && <div className="alert alert-danger text-center">{error}</div>}
        {success && (
          <div className="alert alert-success text-center">
            Registered successfully! Redirecting...
          </div>
        )}

        <form onSubmit={handleSignup}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Username</label>
            <input
              type="text"
              className="form-control rounded-pill"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              className="form-control rounded-pill"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-success rounded-pill">
              Sign Up
            </button>
          </div>

          <p className="text-center mt-3 small">
            Already have an account? <a href="/login">Login</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
