import React from "react";
import { useState } from "react";
import InputBox from "../components/InputBox";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
      <h1>Welcome to your Sleep Analysis Tool</h1>
      <p>Create an Account Here</p>
      <form onSubmit={handleRegister}>
        <label>Username:</label>
        <InputBox
          value={UserName}
          onChange={(e) => setUserName(e.target.value)}
        ></InputBox>
        <br />
        <label>Password:</label>
        <InputBox
          type="password"
          value={Password}
          onChange={(e) => setPassword(e.target.value)}
        ></InputBox>
        <br />
        <button type="submit"> Submit </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
      <p>Already have an account? <button onClick={() => navigate("/")}>Log in</button></p>
    </>
  );
}

export default RegisterPage;
