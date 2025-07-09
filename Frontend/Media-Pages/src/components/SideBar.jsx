import { FaHome, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ selectedTab, setSelectedTab }) => {
  const navigate = useNavigate();

  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 bg-dark text-white h-100" style={{ width: "220px" }}>
      <a
        href="/"
        className="d-flex align-items-center mb-3 text-white text-decoration-none"
      >
        <span className="fs-4 fw-bold">📘 Blog App</span>
      </a>
      <hr className="border-light" />
      
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <button
            className={`nav-link d-flex align-items-center text-start text-white ${
              selectedTab === "Home" ? "bg-primary" : ""
            }`}
            onClick={() => {
              setSelectedTab("Home");
              navigate("/");
            }}
          >
            <FaHome className="me-2" />
            Home
          </button>
        </li>

        <li className="mt-2">
          <button
            className={`nav-link d-flex align-items-center text-start text-white ${
              selectedTab === "Create Post" ? "bg-primary" : ""
            }`}
            onClick={() => {
              setSelectedTab("Create Post");
              navigate("/create");
            }}
          >
            <FaPlus className="me-2" />
            Create Post
          </button>
        </li>
      </ul>

      <hr className="border-light mt-auto" />

      <div className="text-center small text-muted">
        &copy; {new Date().getFullYear()} SocialApp
      </div>
    </div>
  );
};

export default Sidebar;
