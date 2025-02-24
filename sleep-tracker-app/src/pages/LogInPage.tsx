import React from "react";
import { useState } from "react";
import InputBox from "../components/InputBox";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function LogInPage() {
  //state variables for name and password
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();


  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post("http://localhost:5001/auth/login", {
        username,
        password
      });
      localStorage.setItem("token", response.data.token);
      if (response.data && response.data.token) {
        navigate("/dashboard");
      } else {
        setError("Login failed - please try again");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed - please try again");
    }
  };
  return (
    <>
      <h1>Welcome to your Sleep Analysis Tool</h1>
      <p>Log in Here</p>
      <form onSubmit={handleLogin}>
        <label>Username:</label>
        <InputBox
          value={username}
          onChange={(e) => setUserName(e.target.value)}
        ></InputBox>
        <br />
        <label>password:</label>
        <InputBox
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></InputBox>
        <br />
        <button type="submit"> Submit </button>
        {error && <p style={{ color: "red" }}>{error}</p>}

        
      </form>
      <p>Don't have an account? <button onClick={() => navigate("/register")}>Create an Account</button></p>
    </>
  );
}

export default LogInPage;
