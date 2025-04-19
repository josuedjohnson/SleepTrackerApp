import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function LogoutPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/");

        const response = await axios.get("/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        setUsername(response.data.username);
        setPassword(response.data.password);
      } catch (error) {
        console.error("Failed to fetch user data", error);
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <>
      <h1>Sleep Tracker Dashboard</h1>
      {username && <p>Username: <strong>{username}</strong>!</p>}
      {password && <p>Password: <strong>{username}</strong>!</p>}
      <button onClick={handleLogout}>Logout</button>
    </>
  );
}

export default LogoutPage;