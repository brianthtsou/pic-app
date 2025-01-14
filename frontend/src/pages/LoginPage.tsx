import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import axios from "../services/axios";

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (
    event: React.FormEvent<EventTarget>
  ): Promise<void> => {
    event.preventDefault();
    const postData = {
      username: username,
      password: password,
    };
    try {
      const response = await axios.post("/auth/login", postData);
      if (response.status === 200) {
        const accessToken = response.data.accessToken;
        localStorage.setItem("accessToken", accessToken);
        navigate("/home");
      } else {
        console.log("Error logging in.");
        alert("Login failed!");
      }
    } catch (error) {
      if (isAxiosError(error)) {
        console.error("Failed to post data:", error.message);
      } else {
        console.error("An unknown error occurred");
      }
    }
  };

  const handleMoveToRegisterPage = (): void => {
    navigate("/register");
  };

  return (
    <>
      <div className="login-title">
        <h1>Login</h1>
      </div>
      <div className="login-container">
        <form onSubmit={handleSubmit}>
          <label htmlFor="username-input-field">Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            name="username-input-field"
          />
          <label htmlFor="password-input-field">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name="password-input-field"
          />
          <button type="submit">Submit</button>
        </form>
      </div>
      <div>
        <button onClick={handleMoveToRegisterPage}>Register</button>
      </div>
    </>
  );
}

export default LoginPage;
