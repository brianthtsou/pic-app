import { useRef, useState } from "react";
import { Image } from "../pages/HomePage";
import axios from "../services/axios";

interface ImageUploadButtonProps {
  // A function that will receive the new image data from the parent
  onUploadSuccess: (newImage: Image) => void;
}

const ImageUploadButton = ({ onUploadSuccess }: ImageUploadButtonProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [uploadButtonStyle, setUploadButtonStyle] =
    useState<React.CSSProperties>({
      display: "none",
    });
  const ref = useRef<HTMLInputElement>(null);

  const handleChooseClick = () => {
    if (ref.current) {
      ref.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setSelectedFileName(file.name);
      setUploadButtonStyle({});
    }
  };

  const handleUploadClick = async () => {
    if (!selectedFile) {
      return;
    }
    const formData = new FormData();
    formData.append("image", selectedFile);
    try {
      const response = await axios.post("/images/upload", formData);
      onUploadSuccess(response.data);
      setSelectedFile(null);
      setSelectedFileName("");
      setUploadButtonStyle({ display: "none" });

      if (ref.current) {
        ref.current.value = "";
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <button onClick={handleChooseClick}>Choose Image for Upload</button>
      {selectedFileName}
      <button onClick={handleUploadClick} style={uploadButtonStyle}>
        Confirm
      </button>
      <input
        ref={ref}
        onChange={handleFileChange}
        style={{ display: "none" }}
        type="file"
      />
    </>
  );
};

export default ImageUploadButton;
