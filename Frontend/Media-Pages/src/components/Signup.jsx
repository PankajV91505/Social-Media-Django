import { useState, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";

// Lazy load OtpForm
const OtpForm = lazy(() => import("./OtpForm"));

const Signup = () => {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    password2: "",
  });
  const [otpStep, setOtpStep] = useState(false);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    setInfo(null);

    if (form.password !== form.password2) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/request-signup/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setOtpStep(true);
        setInfo("OTP has been sent to your email.");
      } else {
        setError(data.detail || data.error || "Signup failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card p-4 shadow border-0" style={{ width: "100%", maxWidth: "500px" }}>
        <h3 className="text-center text-primary mb-4">Sign Up</h3>

        {error && <div className="alert alert-danger text-center">{error}</div>}
        {info && <div className="alert alert-success text-center">{info}</div>}

        {!otpStep ? (
          <form onSubmit={handleSignup}>
            <div className="mb-3">
              <input
                type="text"
                name="first_name"
                className="form-control"
                placeholder="First Name"
                value={form.first_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                name="last_name"
                className="form-control"
                placeholder="Last Name"
                value={form.last_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                name="password2"
                className="form-control"
                placeholder="Confirm Password"
                value={form.password2}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Send OTP to Email
            </button>
          </form>
        ) : (
          <Suspense fallback={<div className="text-center">Loading OTP Form...</div>}>
            <OtpForm email={form.email} />
          </Suspense>
        )}
      </div>
    </div>
  );
};

export default Signup;
