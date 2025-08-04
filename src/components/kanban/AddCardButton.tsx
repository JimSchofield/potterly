import { Link } from "react-router-dom";
import "./AddCardButton.css";

interface AddCardButtonProps {
  text: string;
  stage: string;
}

const AddCardButton = ({ text, stage }: AddCardButtonProps) => {
  return (
    <Link to={`/create-piece?stage=${stage}`} className="add-card-btn">
      {text}
    </Link>
  );
};

export default AddCardButton;

