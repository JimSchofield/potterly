import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import HamburgerMenu from "./components/HamburgerMenu";
import Modal from "./components/Modal";
import { ModalProvider } from "./contexts/ModalContext";
import Home from "./pages/Home";
import Pieces from "./pages/Pieces";
import PieceDetail from "./pages/PieceDetail";
import Profile from "./pages/Profile";
import CreatePiece from "./pages/CreatePiece";
import Developer from "./pages/developer/Developer";
import Design from "./pages/developer/Design";
import "./App.css";

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <ModalProvider>
      <div className="app">
        <HamburgerMenu isOpen={isMobileMenuOpen} onClick={toggleMobileMenu} />
        <Sidebar isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/pieces/*" element={<Pieces />} />
            <Route path="/piece/:id" element={<PieceDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/create-piece" element={<CreatePiece />} />
            <Route path="/developer" element={<Developer />} />
            <Route path="/design" element={<Design />} />
          </Routes>
        </div>
        <Modal />
      </div>
    </ModalProvider>
  );
}

export default App;
