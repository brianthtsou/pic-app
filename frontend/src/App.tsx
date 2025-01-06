import "./App.css";
import { useState } from "react";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: React.FormEvent<EventTarget>): void => {
    event.preventDefault();
    alert(password);
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
          ></input>
          <label htmlFor="password-input-field">Password:</label>
          <input
            name="password-input-field"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
          <button type="submit">Submit</button>
        </form>
      </div>
    </>
  );
}

export default App;
