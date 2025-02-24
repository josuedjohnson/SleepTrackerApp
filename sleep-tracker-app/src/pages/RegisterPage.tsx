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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/register", {
        username: UserName,
        password: Password
      });
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
      console.log(response.data);
    } catch (error) {
      setError("Invalid username or password");
    }
  };

  

  const navigate = useNavigate();

  return (
    <>
      <h1>Welcome to your Sleep Analysis Tool</h1>
      <p>Create an Account Here</p>
      <form onSubmit={handleSubmit}>
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
      <button onClick={() => navigate("/dashboard")}>Go to Dashboard</button>
    </>
  );
}

export default LogInPage;
