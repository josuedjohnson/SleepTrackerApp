import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LogInPage from "./pages/LogInPage";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    
    <Router>
      <Routes>
        <Route path="/" element={<LogInPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
