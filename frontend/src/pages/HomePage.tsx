import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <>
      <div className="homepage-title">
        <h1>Welcome to the pic app!</h1>
      </div>
      <button onClick={handleLogout}>Logout</button>
    </>
  );
}

export default HomePage;
