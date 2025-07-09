import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { PostList } from "../store/Post-list-store1";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useContext(PostList);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("http://localhost:8000/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) throw new Error("Invalid username or password");

      const data = await response.json();
      login(data.access, username);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card shadow-lg p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <h3 className="text-center mb-3">🔐 Login to Your Account</h3>

        {error && (
          <div className="alert alert-danger py-2 text-center">{error}</div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-control rounded-pill"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control rounded-pill"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="d-grid mb-3">
            <button type="submit" className="btn btn-primary rounded-pill">
              Login
            </button>
          </div>

          <div className="text-center">
            <span>Don't have an account? </span>
            <a href="/signup">Sign up</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
