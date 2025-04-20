import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function UserProfile() {
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
    <div style={{ display: "flex", gap: "40px", padding: "20px" }}>
        <div style={{ flex: 1 }}>
            <button onClick={handleLogout}>Logout</button>
            <p>Username: {username}</p>
            <p>Password: {password}</p>
            <button onClick={() => navigate("/dashboard")}> Back</button>
        </div>

    </div>

  );
}

export default UserProfile;