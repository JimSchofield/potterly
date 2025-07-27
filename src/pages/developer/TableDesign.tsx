import './TableDesign.css'

interface PotteryPiece {
  id: string
  name: string
  type: string
  stage: 'ideas' | 'throw' | 'trim' | 'bisque' | 'glaze' | 'finished'
  description: string
  priority: 'high' | 'medium' | 'low'
  date: string
}

const TableDesign = () => {
  const potteryPieces: PotteryPiece[] = [
    {
      id: 1,
      name: "Japanese Tea Set",
      type: "Service Set",
      stage: "ideas",
      description: "Inspired by traditional Raku techniques. Planning 6 cups, teapot, and serving tray with earthy glazes.",
      priority: "high",
      date: "Started Jul 20"
    },
    {
      id: 2,
      name: "Garden Planters",
      type: "Functional",
      stage: "ideas",
      description: "Large outdoor planters with drainage. Considering textured surfaces and weatherproof glazes.",
      priority: "medium",
      date: "Started Jul 18"
    },
    {
      id: 3,
      name: "Large Serving Bowl",
      type: "Functional",
      stage: "throw",
      description: "14″ diameter bowl for salads. Using speckled stoneware clay. Need to center 3lbs of clay.",
      priority: "high",
      date: "Throwing today"
    },
    {
      id: 4,
      name: "Coffee Mugs (Set of 6)",
      type: "Functional",
      stage: "throw",
      description: "12oz mugs with comfortable handles. Throwing in batches to ensure consistency.",
      priority: "medium",
      date: "In progress"
    },
    {
      id: 5,
      name: "Pasta Bowls (Set of 4)",
      type: "Functional",
      stage: "trim",
      description: "Wide shallow bowls. Need to trim foot rings and refine rim. Clay at perfect leather-hard stage.",
      priority: "high",
      date: "Ready to trim"
    },
    {
      id: 6,
      name: "Ceramic Lamp Base",
      type: "Functional",
      stage: "trim",
      description: "Cylindrical form with cord hole. Need to clean up base and add signature stamp.",
      priority: "medium",
      date: "Drying since Jul 22"
    },
    {
      id: 7,
      name: "Dinner Plates (Set of 8)",
      type: "Functional",
      stage: "bisque",
      description: "10″ plates with subtle rim detail. Scheduled for next bisque firing on Friday.",
      priority: "high",
      date: "Firing Jul 28"
    },
    {
      id: 8,
      name: "Teapot",
      type: "Functional",
      stage: "bisque",
      description: "32oz capacity with bamboo-style handle. Spout needs final smoothing before firing.",
      priority: "medium",
      date: "Currently firing"
    },
    {
      id: 9,
      name: "Salad Bowl & Servers",
      type: "Functional",
      stage: "glaze",
      description: "Large bowl with wooden servers. Planning celadon green glaze with clear interior.",
      priority: "high",
      date: "Glazing today"
    },
    {
      id: 10,
      name: "Bud Vases (Set of 3)",
      type: "Decorative",
      stage: "glaze",
      description: "Small vases in varying heights. Testing new copper red glaze combination.",
      priority: "medium",
      date: "Test glazes"
    },
    {
      id: 11,
      name: "Espresso Cups (Set of 4)",
      type: "Functional",
      stage: "finished",
      description: "Perfect 3oz cups with matching saucers. Glossy black glaze with gold rim accent.",
      priority: "high",
      date: "Completed Jul 24"
    },
    {
      id: 12,
      name: "Fruit Bowl",
      type: "Functional",
      stage: "finished",
      description: "Large centerpiece bowl with fluted edges. Beautiful blue-green gradient glaze.",
      priority: "medium",
      date: "Completed Jul 22"
    }
  ]

  const getStageIcon = (stage: string) => {
    const icons = {
      ideas: '💡',
      throw: '🏺',
      trim: '🔧',
      bisque: '🔥',
      glaze: '🎨',
      finished: '✨'
    }
    return icons[stage as keyof typeof icons] || ''
  }

  const getStageLabel = (stage: string) => {
    const labels = {
      ideas: 'Ideas',
      throw: 'Throw',
      trim: 'Trim',
      bisque: 'Bisque',
      glaze: 'Glaze',
      finished: 'Finished'
    }
    return labels[stage as keyof typeof labels] || stage
  }

  const stats = {
    total: potteryPieces.length,
    inProgress: potteryPieces.filter(p => p.stage !== 'finished').length,
    highPriority: potteryPieces.filter(p => p.priority === 'high').length,
    completed: potteryPieces.filter(p => p.stage === 'finished').length
  }

  return (
    <div className="table-container">
      <div className="table-header">
        <div className="header-content">
          <h1>🏺 Pottery Studio Dashboard</h1>
          <p>Track and manage all your ceramic pieces in one organized view</p>
        </div>
        <div className="view-toggle">
          <button className="toggle-btn">📋 Kanban</button>
          <button className="toggle-btn active">📊 Table</button>
        </div>
      </div>
      
      <div className="table-controls">
        <div className="filters">
          <div className="filter-group">
            <label htmlFor="stage-filter">Stage:</label>
            <select id="stage-filter" className="filter-select">
              <option value="">All Stages</option>
              <option value="ideas">💡 Ideas</option>
              <option value="throw">🏺 Throw</option>
              <option value="trim">🔧 Trim</option>
              <option value="bisque">🔥 Bisque</option>
              <option value="glaze">🎨 Glaze</option>
              <option value="finished">✨ Finished</option>
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="type-filter">Type:</label>
            <select id="type-filter" className="filter-select">
              <option value="">All Types</option>
              <option value="functional">Functional</option>
              <option value="decorative">Decorative</option>
              <option value="art">Art Piece</option>
              <option value="service">Service Set</option>
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="priority-filter">Priority:</label>
            <select id="priority-filter" className="filter-select">
              <option value="">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
        <div className="search-and-add">
          <input type="text" className="search-box" placeholder="Search pieces..." />
          <button className="add-btn">+ Add New Piece</button>
        </div>
      </div>
      
      <div className="table-content">
        <table className="pottery-table">
          <thead>
            <tr>
              <th>Piece</th>
              <th>Stage</th>
              <th>Description</th>
              <th>Priority</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {potteryPieces.map((piece) => (
              <tr key={piece.id}>
                <td>
                  <div className="piece-info">
                    <div className="piece-name">{piece.name}</div>
                    <div className="piece-type">{piece.type}</div>
                  </div>
                </td>
                <td>
                  <div className={`stage-badge stage-${piece.stage}`}>
                    {getStageIcon(piece.stage)} {getStageLabel(piece.stage)}
                  </div>
                </td>
                <td>
                  <div className="description">{piece.description}</div>
                </td>
                <td>
                  <div className="priority-indicator">
                    <div className={`priority-dot priority-${piece.priority}`}></div>
                    <span>{piece.priority.charAt(0).toUpperCase() + piece.priority.slice(1)}</span>
                  </div>
                </td>
                <td>
                  <div className="date-info">{piece.date}</div>
                </td>
                <td>
                  <div className="actions">
                    <button className="action-btn">Edit</button>
                    <button className="action-btn">
                      {piece.stage === 'finished' ? 'Archive' : 'Move'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="stats-bar">
        <div className="stat-item">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Total Pieces</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{stats.inProgress}</div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{stats.highPriority}</div>
          <div className="stat-label">High Priority</div>
        </div>
        <div className="stat-item">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${Math.round((stats.completed / stats.total) * 100)}%` }}></div>
          </div>
          <div className="stat-label">{Math.round((stats.completed / stats.total) * 100)}% Complete</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{stats.completed}</div>
          <div className="stat-label">Finished This Week</div>
        </div>
      </div>
    </div>
  )
}

export default TableDesign