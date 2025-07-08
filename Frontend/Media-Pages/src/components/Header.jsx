import { useContext } from "react";
import { PostList } from "../store/Post-list-store1";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { token, username, logout } = useContext(PostList);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="p-3 text-bg-dark">
      <div className="container d-flex justify-content-between align-items-center">
        <a href="/" className="text-white text-decoration-none">My App</a>
        <div className="text-end">
          {token ? (
            <>
              <span className="text-white me-3">Welcome, {username}</span>
              <button onClick={handleLogout} className="btn btn-outline-light me-2">Logout</button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/login')} className="btn btn-outline-light me-2">Login</button>
              <button onClick={() => navigate('/signup')} className="btn btn-warning">Sign-up</button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
