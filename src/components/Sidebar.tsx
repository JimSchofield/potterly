import { NavLink } from "react-router-dom";
import "./Sidebar.css";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar = ({ isOpen = false, onClose }: SidebarProps) => {
  const handleLinkClick = () => {
    // Close mobile menu when a link is clicked
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      
      <nav className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
      <h2 className="sidebar__title">Potterly</h2>
      <ul className="sidebar__nav">
        <li className="sidebar__item">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `sidebar__link ${isActive ? "sidebar__link--active" : ""}`
            }
            onClick={handleLinkClick}
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
            onClick={handleLinkClick}
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
            onClick={handleLinkClick}
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
            onClick={handleLinkClick}
          >
            <span className="sidebar__icon">➕</span>
            <span className="sidebar__text">Create Piece</span>
          </NavLink>
        </li>
      </ul>
    </nav>
    </>
  );
};

export default Sidebar;

