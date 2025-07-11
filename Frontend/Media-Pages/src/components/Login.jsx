import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { PostList } from "../store/Post-list-store1";

const Login = () => {
  const { login } = useContext(PostList);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch("http://localhost:8000/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "Login failed");
        return;
      }

      login(data.access, email);
      navigate("/");

    } catch (err) {
      setError("Network error");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card shadow p-4" style={{ width: "100%", maxWidth: "400px" }}>
        <h3 className="text-center text-primary mb-4">🔐 Login to Your Account</h3>

        {error && (
          <div className="alert alert-danger text-center" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label fw-semibold">Email address</label>
            <input
              type="email"
              className="form-control rounded-pill"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label fw-semibold">Password</label>
            <input
              type="password"
              className="form-control rounded-pill"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <small>
              <Link to="/forgot-password" className="text-decoration-none">
                Forgot password?
              </Link>
            </small>
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-success rounded-pill">
              Login
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <small>
            Don’t have an account?{" "}
            <Link to="/signup" className="text-decoration-none fw-semibold text-primary">
              Sign up
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Login;
