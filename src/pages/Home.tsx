import { useStore } from "@nanostores/react";
import { useNavigate } from "react-router-dom";
import { piecesStore } from "../stores/pieces";
import "./Home.css";

const Home = () => {
  const pieces = useStore(piecesStore);
  const navigate = useNavigate();

  // Calculate statistics
  const totalPieces = pieces.filter(piece => !piece.archived).length;
  const bisquePieces = pieces.filter(piece => piece.stage === 'bisque' && !piece.archived).length;
  const starredPieces = pieces.filter(piece => piece.starred && !piece.archived).length;
  const totalCreated = pieces.length; // Including archived pieces

  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return "Good morning! Ready to create something beautiful today?";
    } else if (hour < 18) {
      return "Good afternoon! How's your pottery session going?";
    } else {
      return "Good evening! Perfect time for some peaceful clay work.";
    }
  };

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>🏺 Welcome to Your Studio</h1>
        <p>Track your ceramic journey from clay to finished masterpiece</p>
        <div className="welcome-time">
          {getGreeting()}
        </div>
      </div>

      <div className="home-main-content">
        <div className="home-quick-stats">
          <div className="home-stat-card total-pieces">
            <div className="home-stat-icon">🏺</div>
            <div className="home-stat-number">{totalPieces}</div>
            <div className="home-stat-label">Pieces Total</div>
          </div>
          <div className="home-stat-card bisque-stage">
            <div className="home-stat-icon">🔥</div>
            <div className="home-stat-number">{bisquePieces}</div>
            <div className="home-stat-label">Pieces in Bisque Stage</div>
          </div>
          <div className="home-stat-card starred">
            <div className="home-stat-icon">⭐</div>
            <div className="home-stat-number">{starredPieces}</div>
            <div className="home-stat-label">Pieces Starred</div>
          </div>
          <div className="home-stat-card total-created">
            <div className="home-stat-icon">✨</div>
            <div className="home-stat-number">{totalCreated}</div>
            <div className="home-stat-label">Total Pieces Created</div>
          </div>
        </div>

        <div className="home-navigation">
          <button 
            className="home-nav-btn" 
            onClick={() => navigate('/pieces/kanban')}
          >
            📋 View Kanban Board
          </button>
          <button 
            className="home-nav-btn secondary" 
            onClick={() => navigate('/pieces/table')}
          >
            📊 View Table
          </button>
          <button 
            className="home-nav-btn secondary" 
            onClick={() => navigate('/create-piece')}
          >
            + Add New Piece
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
