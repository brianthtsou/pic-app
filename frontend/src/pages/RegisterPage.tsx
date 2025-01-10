import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import axios from "../services/axios";

function RegisterPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (
    event: React.FormEvent<EventTarget>
  ): Promise<void> => {
    event.preventDefault();
    const registerSuccessful = true; // Placeholder for actual register check (make sure all forms are filled!)
    if (registerSuccessful) {
      const postData = {
        username: username,
        password: password,
        first_name: firstName,
        last_name: lastName,
        email: email,
      };
      try {
        const response = await axios.post("/users", postData);
        if (response.status === 201) {
          console.log("Register success!");
          navigate("/login");
        } else {
          console.log("Error adding data to database");
        }
      } catch (error) {
        if (isAxiosError(error)) {
          console.error("Failed to post data:", error.message);
        } else {
          console.error("An unknown error occurred");
        }
      }
    } else {
      alert("Register failed!");
    }
  };

  return (
    <>
      <div className="register-title">
        <h1>Register</h1>
      </div>
      <div className="register-container">
        <form onSubmit={handleSubmit}>
          <label htmlFor="register-firstname-input-field">First Name:</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            name="register-firstname-input-field"
          />
          <label htmlFor="register-lastname-input-field">Last Name:</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            name="register-lastname-input-field"
          />
          <label htmlFor="register-email-input-field">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            name="register-email-input-field"
          />
          <label htmlFor="register-username-input-field">Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            name="register-username-input-field"
          />
          <label htmlFor="register-password-input-field">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name="register-password-input-field"
          />
          <button type="submit">Register</button>
        </form>
      </div>
    </>
  );
}

export default RegisterPage;
