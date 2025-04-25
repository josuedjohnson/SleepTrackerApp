import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Auth.css";
import defaultprofile from "../images/defaultprofile.jpg";

function UserProfile() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [passwordLength, setPasswordLength] = useState(0);
  const [createdAt, setCreatedAt] = useState("");

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
        setCreatedAt(response.data.createdAt);
      } catch (error) {
        console.error("Failed to fetch user data", error);
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    fetchUserData();
  }, [navigate]);

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="window">
      <div className="profile-panel">
        <h1>Your Profile</h1>
        <div className="section">
          <h2 className="section-title">👤 Profile Picture</h2>
          <img
            src= {defaultprofile}
            alt="Profile"
            className="profile-picture"
          />
        </div>
        <div className="section">
          <h2 className="section-title">📄 Personal Information</h2>
          <p><strong>Account created on</strong> {formattedDate}</p>
          <p><strong>Username:</strong> {username}</p>
          <p><strong>Password:</strong> {"•".repeat(passwordLength)}</p>
        </div>
        <div style={{ display: "flex", gap: "15px", marginTop: "20px" }}>
          <button className="button" onClick={() => navigate("/dashboard")}>Back</button>
          <button className="button" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;