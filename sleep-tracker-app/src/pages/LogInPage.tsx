import React from "react";
import { useState } from "react";
import InputBox from "../components/InputBox";
import { useNavigate } from "react-router-dom";

function LogInPage() {
  //state variables for name and password
  const [UserName, setUserName] = useState("");
  const [Password, setPassword] = useState("");

  const navigate = useNavigate();

  return (
    <>
      <h1>Welcome to your Sleep Analysis Tool</h1>
      <p>Create an Account Here</p>
      <form>
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

        
      </form>
      <button onClick={() => navigate("/dashboard")}>Go to Dashboard</button>
    </>
  );
}

export default LogInPage;
