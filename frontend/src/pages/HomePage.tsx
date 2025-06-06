import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
// import { isAxiosError } from "axios";
import axios from "../services/axios";
import SignedURLImage from "@/components/SignedURLImage";
import { useAuth } from "../context/AuthContext";

interface Post {
  title: string;
  username: string;
  id: number;
}

interface Image {
  image_id: number;
  signed_url: string;
}

function HomePage() {
  const navigate = useNavigate();
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [userImages, setUserImages] = useState<Image[]>([]);
  const uploadDialog = useRef(null);
  const { logout } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/users/posts");
        setUserPosts(response.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
      try {
        const imageResponse = await axios.get("/images/");
        console.log(imageResponse.data);
        setUserImages(imageResponse.data.photoUrls);
      } catch (error) {
        console.error("Error fetching images", error);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleUpload = () => {};

  return (
    <>
      <div className="homepage-title">
        <h1>Welcome to the pic app!!</h1>
      </div>
      <dialog ref={uploadDialog}>
        <button>Close</button>
        <p>This modal dialog has a groovy backdrop!</p>
      </dialog>
      <button onClick={handleUpload}>Upload</button>
      {userPosts.map((post) => (
        <div key={post.id}>
          <h3>{post.title}</h3>
        </div>
      ))}
      {userImages.map((image) => (
        <div key={image.image_id}>
          <SignedURLImage imageUrl={image.signed_url}></SignedURLImage>
        </div>
      ))}
      <button onClick={handleLogout}>Logout</button>
    </>
  );
}

export default HomePage;
