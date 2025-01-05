import "./App.css";

function App() {
  return (
    <>
      <div className="login-container">
        <h1>Login</h1>
        <label htmlFor="username-input-field">Username:</label>
        <input name="username-input-field"></input>
        <label htmlFor="password-input-field">Password:</label>
        <input name="password-input-field"></input>
      </div>
    </>
  );
}

export default App;
