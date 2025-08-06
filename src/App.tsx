import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import HamburgerMenu from "./components/HamburgerMenu";
import Modal from "./components/Modal";
import LoadingOverlay from "./components/LoadingOverlay";
import { ModalProvider } from "./contexts/ModalContext";
import { initializeUserSession } from "./stores/user";
import Home from "./pages/Home";
import Pieces from "./pages/Pieces";
import PieceDetail from "./pages/PieceDetail";
import Profile from "./pages/Profile";
import UserProfile from "./pages/UserProfile";
import CreatePiece from "./pages/CreatePiece";
import Login from "./pages/Login";
import Developer from "./pages/developer/Developer";
import Design from "./pages/developer/Design";
import "./App.css";

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isLoginPage = location.pathname === "/";

  // Initialize user session on app startup
  useEffect(() => {
    initializeUserSession();
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <ModalProvider>
      <div className="app">
        {!isLoginPage && (
          <>
            <HamburgerMenu isOpen={isMobileMenuOpen} onClick={toggleMobileMenu} />
            <Sidebar isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />
          </>
        )}
        <div className={`container ${isLoginPage ? "container--full" : ""}`}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/pieces/*" element={<Pieces />} />
            <Route path="/piece/:id" element={<PieceDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:username" element={<UserProfile />} />
            <Route path="/create-piece" element={<CreatePiece />} />
            <Route path="/developer" element={<Developer />} />
            <Route path="/design" element={<Design />} />
          </Routes>
        </div>
        <Modal />
        <LoadingOverlay />
      </div>
    </ModalProvider>
  );
}

export default App;
