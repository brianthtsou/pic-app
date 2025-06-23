import { FC } from "react";
import axios from "../services/axios";

interface ImageDeleteButtonProps {
  imageId: number;
  onDeleteSuccess: () => void;
}

const ImageDeleteButton: FC<ImageDeleteButtonProps> = ({
  imageId,
  onDeleteSuccess,
}) => {
  const handleDeleteClick = async () => {
    try {
      const url = `images/${imageId}`;
      await axios.delete(url);
      onDeleteSuccess();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <button onClick={handleDeleteClick}>Delete Image</button>
    </>
  );
};

export default ImageDeleteButton;
