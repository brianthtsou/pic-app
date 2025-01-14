import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { isAxiosError } from "axios";
import axios from "../services/axios";

interface Post {
  title: string;
  username: string;
}

function HomePage() {
  const navigate = useNavigate();
  const [userPosts, setUserPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = localStorage.getItem("accessToken");
      axios.defaults.headers.common["Authorization"] = `${accessToken}`;
      try {
        const response = await axios.get("/users/posts");
        console.log(response);
        setUserPosts(response.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <>
      <div className="homepage-title">
        <h1>Welcome to the pic app!</h1>
      </div>
      {userPosts.map((post) => (
        <div>
          <h3>{post.title}</h3>
        </div>
      ))}
      <button onClick={handleLogout}>Logout</button>
    </>
  );
}

export default HomePage;
