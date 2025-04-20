import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function UserProfile() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [passwordLength, setPasswordLength] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/");

        const response = await axios.get("http://localhost:5001/auth/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        setUsername(response.data.username);
        setPasswordLength(response.data.passwordLength);
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
            <p>Username: {username}</p>
            <p>Password: {"•".repeat(passwordLength)}</p>
            <button onClick={() => navigate("/dashboard")}> Back</button>
            <button onClick={handleLogout}>Logout</button>
        </div>

    </div>

  );
}

export default UserProfile;