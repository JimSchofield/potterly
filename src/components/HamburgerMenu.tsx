import "./HamburgerMenu.css";

interface HamburgerMenuProps {
  isOpen: boolean;
  onClick: () => void;
}

const HamburgerMenu = ({ isOpen, onClick }: HamburgerMenuProps) => {
  return (
    <button
      className={`hamburger ${isOpen ? "hamburger--open" : ""}`}
      onClick={onClick}
      aria-label="Toggle menu"
    >
      <span className="hamburger__line"></span>
      <span className="hamburger__line"></span>
      <span className="hamburger__line"></span>
    </button>
  );
};

export default HamburgerMenu;

