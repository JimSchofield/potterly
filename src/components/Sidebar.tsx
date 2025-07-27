import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <nav className="sidebar">
      <h2 className="sidebar__title">Potterly</h2>
      <ul className="sidebar__nav">
        <li className="sidebar__item">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `sidebar__link ${isActive ? "sidebar__link--active" : ""}`
            }
          >
            <span className="sidebar__icon">🏠</span>
            <span className="sidebar__text">Home</span>
          </NavLink>
        </li>
        <li className="sidebar__item">
          <NavLink
            to="/pieces"
            className={({ isActive }) =>
              `sidebar__link ${isActive ? "sidebar__link--active" : ""}`
            }
          >
            <span className="sidebar__icon">🏺</span>
            <span className="sidebar__text">Pieces</span>
          </NavLink>
        </li>
        <li className="sidebar__item">
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `sidebar__link ${isActive ? "sidebar__link--active" : ""}`
            }
          >
            <span className="sidebar__icon">👤</span>
            <span className="sidebar__text">Profile</span>
          </NavLink>
        </li>
        <li className="sidebar__item">
          <NavLink
            to="/create-piece"
            className={({ isActive }) =>
              `sidebar__link ${isActive ? "sidebar__link--active" : ""}`
            }
          >
            <span className="sidebar__icon">➕</span>
            <span className="sidebar__text">Create Piece</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;

