import { useContext } from "react";
import { PostList } from "../store/Post-list-store1";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { token, username, logout } = useContext(PostList);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container-fluid">
        <a className="navbar-brand fw-bold" href="/">
          🚀 SocialApp
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMain"
          aria-controls="navbarMain"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarMain">
          {token ? (
            <div className="d-flex align-items-center gap-3">
              <span className="text-white">👋 {username}</span>
              <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-light btn-sm"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
              <button
                className="btn btn-warning btn-sm"
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
