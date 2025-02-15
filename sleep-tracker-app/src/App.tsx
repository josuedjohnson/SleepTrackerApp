import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LogInPage from "./pages/LogInPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LogInPage />} />
      </Routes>
    </Router>
  );
}

export default App;
