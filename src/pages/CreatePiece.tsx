import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { addPiece } from '../stores/pieces'
import { PotteryPiece, Stages, Priorities } from '../types/Piece'
import './CreatePiece.css'

const CreatePiece = () => {
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    details: '',
    date: '',
    priority: 'medium' as Priorities,
    stage: 'ideas' as Stages,
    dueDate: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const now = new Date().toISOString()
    const newPiece: PotteryPiece = {
      id: uuidv4(),
      ...formData,
      createdAt: now,
      lastUpdated: now,
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined
    }
    
    addPiece(newPiece)
    navigate('/pieces')
  }

  const handleReset = () => {
    setFormData({
      title: '',
      type: '',
      details: '',
      date: '',
      priority: 'medium',
      stage: 'ideas',
      dueDate: ''
    })
  }

  return (
    <div className="page">
      <div className="create-piece">
        <h1 className="page__title">🏺 Create New Piece</h1>
        <p className="create-piece__subtitle">Add a new pottery piece to your collection</p>
        
        <form className="create-piece__form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Title <span className="required">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter piece title..."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="type" className="form-label">
              Type <span className="required">*</span>
            </label>
            <input
              type="text"
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="form-input"
              placeholder="e.g., Functional, Decorative, Art Piece..."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="details" className="form-label">
              Details
            </label>
            <textarea
              id="details"
              name="details"
              value={formData.details}
              onChange={handleInputChange}
              className="form-textarea"
              placeholder="Describe your piece, techniques, materials, inspiration..."
              rows={4}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="stage" className="form-label">
                Stage
              </label>
              <select
                id="stage"
                name="stage"
                value={formData.stage}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="ideas">💡 Ideas</option>
                <option value="throw">🏺 Throw</option>
                <option value="trim">🔧 Trim</option>
                <option value="bisque">🔥 Bisque</option>
                <option value="glaze">🎨 Glaze</option>
                <option value="finished">✨ Finished</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="priority" className="form-label">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date" className="form-label">
                Date/Status <span className="required">*</span>
              </label>
              <input
                type="text"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="form-input"
                placeholder="e.g., Started today, In progress..."
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="dueDate" className="form-label">
                Due Date
              </label>
              <input
                type="datetime-local"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={handleReset}
              className="btn btn--secondary"
            >
              Reset Form
            </button>
            <button
              type="submit"
              className="btn btn--primary"
            >
              Create Piece
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreatePiece