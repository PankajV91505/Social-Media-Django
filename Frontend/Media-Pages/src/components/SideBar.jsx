import { FaHome, FaPlus, FaUser } from "react-icons/fa";

const Sidebar = ({ selectedTab, setSelectedTab }) => {
  return (
    <div className="sidebar d-flex flex-column flex-shrink-0 p-3 bg-dark text-white">
      <a
        href="/"
        className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none"
      >
        <span className="fs-4">Blog App</span>
      </a>
      <hr />
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <button
            className={`nav-link text-white ${selectedTab === "Home" && "active"}`}
            onClick={() => setSelectedTab("Home")}
          >
            <FaHome className="me-2" />
            Home
          </button>
        </li>
        <li>
          <button
            className={`nav-link text-white ${selectedTab === "Create Post" && "active"}`}
            onClick={() => setSelectedTab("Create Post")}
          >
            <FaPlus className="me-2" />
            Create Post
          </button>
        </li>
      </ul>
      <hr />
      <div className="dropdown">
        <a
          href="#"
          className="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <img
            src="https://ui-avatars.com/api/?name=User&background=random"
            alt="User"
            width="32"
            height="32"
            className="rounded-circle me-2"
          />
          <strong>User</strong>
        </a>
        <ul className="dropdown-menu dropdown-menu-dark text-small shadow">
          <li>
            <button className="dropdown-item">Settings</button>
          </li>
          <li>
            <button className="dropdown-item">Profile</button>
          </li>
          <li>
            <hr className="dropdown-divider" />
          </li>
          <li>
            <button className="dropdown-item">Sign out</button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;