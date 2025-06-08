import { useRef, useState } from "react";
import { isAxiosError } from "axios";
import axios from "../services/axios";

const ImageUploadButton = () => {
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
      await axios.post("/images/upload", formData);
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
