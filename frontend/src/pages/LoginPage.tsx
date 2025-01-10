import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: React.FormEvent<EventTarget>): void => {
    event.preventDefault();
    const loginSuccessful = true; // Placeholder for actual login check
    if (loginSuccessful) {
      navigate("/home"); // Redirect to Home on success
    } else {
      alert("Login failed!");
    }
  };

  const handleRegister = (): void => {
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
        <button onClick={handleRegister}>Register</button>
      </div>
    </>
  );
}

export default LoginPage;
