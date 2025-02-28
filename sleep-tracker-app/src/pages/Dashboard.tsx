import { useNavigate } from "react-router-dom";
import SleepDataInputForm from "../components/SleepDataInputForm";

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem("token");
    // Redirect to login page
    navigate("/");
  };

  return (
    <>
        <h1>Sleep Tracker Dashboard</h1>
        <button onClick={handleLogout}>Logout</button>
      <SleepDataInputForm />
    </>
  );
}

export default Dashboard;