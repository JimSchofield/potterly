import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { addPiece } from "../stores/pieces";
import { getCurrentUser } from "../stores/user";
import { PotteryPiece, Stages, Priorities, Types } from "../types/Piece";
import { createDefaultStageDetails } from "../utils/stage-defaults";
import {
  getAllStages,
  getStageIcon,
  getStageLabel,
} from "../utils/labels-and-icons";
import { pieceTypes } from "../utils/piece-types";
import "./CreatePiece.css";

const CreatePiece = () => {
  const navigate = useNavigate();
  const stages = getAllStages();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    type: "Functional" as Types,
    details: "",
    status: "",
    priority: "medium" as Priorities,
    stage: "ideas" as Stages,
    starred: false,
    dueDate: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const { checked } = e.target as HTMLInputElement;
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    const currentUser = getCurrentUser();
    if (!currentUser) {
      console.error("No authenticated user found");
      return;
    }

    setIsSubmitting(true);

    const now = new Date().toISOString();
    const newPiece: PotteryPiece = {
      id: uuidv4(),
      ...formData,
      archived: false,
      ownerId: currentUser.id,
      createdAt: now,
      lastUpdated: now,
      dueDate: formData.dueDate
        ? new Date(formData.dueDate).toISOString()
        : undefined,
      stageDetails: createDefaultStageDetails(),
    };

    try {
      const savedPiece = await addPiece(newPiece);
      navigate(`/piece/${savedPiece.id}`);
    } catch (error) {
      console.error("Failed to create piece:", error);
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      title: "",
      type: "Functional",
      details: "",
      status: "",
      priority: "medium",
      stage: "ideas",
      starred: false,
      dueDate: "",
    });
  };

  return (
    <div className="page">
      <div className="create-piece">
        <h1 className="page__title">🏺 Create New Piece</h1>
        <p className="create-piece__subtitle">
          Add a new pottery piece to your collection
        </p>

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
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="form-select"
              required
            >
              {pieceTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
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
                {stages.map((stage) => (
                  <option key={stage} value={stage}>
                    {getStageIcon(stage)} {getStageLabel(stage)}
                  </option>
                ))}
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

            <div className="form-group">
              <label htmlFor="status" className="form-label">
                Status
              </label>
              <input
                type="text"
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="form-input"
                placeholder="e.g., Started today, In progress..."
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

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="starred"
                checked={formData.starred}
                onChange={handleInputChange}
                className="form-checkbox"
              />
              <span>⭐ Star this piece</span>
            </label>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={handleReset}
              className="btn btn-secondary"
            >
              Reset
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Piece"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePiece;
