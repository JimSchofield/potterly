import { useStore } from "@nanostores/react";
import { useNavigate } from "react-router-dom";
import { piecesStore } from "../stores/pieces";
import "./Home.css";

const Home = () => {
  const pieces = useStore(piecesStore);
  const navigate = useNavigate();

  // Calculate statistics
  const totalPieces = pieces.length; // All pieces including archived
  const bisquePieces = pieces.filter(piece => piece.stage === 'bisque' && !piece.archived).length;
  const starredPieces = pieces.filter(piece => piece.starred && !piece.archived).length;
  const ideasPieces = pieces.filter(piece => piece.stage === 'ideas' && !piece.archived).length;

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
          <div className="card stat-card card-accent card-hover card-center accent-clay">
            <div className="home-stat-icon">🏺</div>
            <div className="card-number">{totalPieces}</div>
            <div className="card-label">Pieces Total</div>
          </div>
          <div className="card stat-card card-accent card-hover card-center accent-bisque">
            <div className="home-stat-icon">🔥</div>
            <div className="card-number">{bisquePieces}</div>
            <div className="card-label">Pieces in Bisque Stage</div>
          </div>
          <div className="card stat-card card-accent card-hover card-center accent-gold">
            <div className="home-stat-icon">⭐</div>
            <div className="card-number">{starredPieces}</div>
            <div className="card-label">Pieces Starred</div>
          </div>
          <div className="card stat-card card-accent card-hover card-center accent-ideas">
            <div className="home-stat-icon">💡</div>
            <div className="card-number">{ideasPieces}</div>
            <div className="card-label">Ideas Stage</div>
          </div>
        </div>

        <div className="home-navigation btn-group btn-group-center">
          <button 
            className="btn btn-primary btn-lg" 
            onClick={() => navigate('/pieces/kanban')}
          >
            📋 View Kanban Board
          </button>
          <button 
            className="btn btn-secondary btn-lg" 
            onClick={() => navigate('/pieces/table')}
          >
            📊 View Table
          </button>
          <button 
            className="btn btn-secondary btn-lg" 
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
