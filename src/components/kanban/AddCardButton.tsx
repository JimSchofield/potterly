import "./AddCardButton.css";

interface AddCardButtonProps {
  text: string;
  onClick?: () => void;
}

const AddCardButton = ({ text, onClick }: AddCardButtonProps) => {
  return (
    <button className="add-card-btn" onClick={onClick}>
      {text}
    </button>
  );
};

export default AddCardButton;

