import React from "react";
import { useState } from "react";
import InputBox from "../components/InputBox";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Login.css";

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
    <div className="container">
      <div className="left-panel">
        <h1>Welcome to SleepSync<br></br>Sign into your account</h1>
        <form onSubmit={handleLogin}>
          <InputBox
            value={username}
            onChange={(e) => setUserName(e.target.value)}
            className="input-box"
            placeholder="Enter your username"
          ></InputBox>
          <br />
          <InputBox
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-box"
            placeholder="Enter your password"
          ></InputBox>
          <br />
          <p className="forgot-password">Forgot Password?</p>
          <button type="submit" className="button">Log In</button>
          {error && <p style={{ color: "red" }}>{error}</p>}

          
        </form>
        <p className="sign-up-text">
            Don't have an account?
            <span className="sign-up-link" onClick={() => navigate("/register")}> Sign up now</span>
        </p>
      </div>
    </div>
    </>
  );
}

export default LogInPage;
