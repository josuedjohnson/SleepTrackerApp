import React from "react";
import { useState } from "react";
import InputBox from "../components/InputBox";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Register.css";

function RegisterPage() {
  //state variables for name and password
  const [UserName, setUserName] = useState("");
  const [Password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:5001/auth/register", {
        username: UserName,
        password: Password
      });
      if (response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);
        navigate("/dashboard");
      } else {
        setError("Registration failed - please try again");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed - please try again");
    }
  };


  return (
    <>
    <div className="container">
    <div className="left-panel">
    <div className="logo">SleepSync</div>
      <h1>Welcome to SleepSync<br></br>Create an Account Here</h1>
      <form onSubmit={handleRegister}>
        <InputBox
          value={UserName}
          onChange={(e) => setUserName(e.target.value)}
          className="input-box"
          placeholder="Enter your username"
        ></InputBox>
        <br />
        <InputBox
          type="password"
          value={Password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-box"
          placeholder="Enter your password"
        ></InputBox>
        <br />
        <button type="submit" className="button">Create Account</button>
        {error && <p style={{ color: "red" }}>{error}</p>}


      </form>
      <p className="sign-up-text">
        Already have an account? 
        <span className="sign-up-link" onClick={() => navigate("/")}>Log in</span>
      </p>
      </div>
      </div>
    </>
  );
}

export default RegisterPage;
