import { FC } from "react";
import "../App.css";

interface SignedURLImageProps {
  imageUrl: string;
  handleClick: () => void;
}

const SignedURLImage: FC<SignedURLImageProps> = ({ imageUrl, handleClick }) => {
  return (
    <div>
      <img className="clickable-element" src={imageUrl} onClick={handleClick} />
    </div>
  );
};

export default SignedURLImage;
