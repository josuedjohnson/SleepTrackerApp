import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import SleepDataInputForm from "../components/SleepDataInputForm";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { FaTrash, FaUserCircle } from "react-icons/fa";
import "../styles/Dashboard.css";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Title);

function Dashboard() {
  const navigate = useNavigate();
  const [sleepData, setSleepData] = useState<
    {
      id: string;
      sleepStart: any;
      wakeUpTime: any;
      hoursSlept: number;
      notes: string;
      score: number;
    }[]
  >([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchSleepData = async () => {
      try {
        if (!token) return navigate("/");
        const res = await axios.get("http://localhost:5001/sleep", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const formatted = res.data.map((entry: any) => {
          const sleepStart = dayjs(entry.sleepStart);
          const wakeUpTime = dayjs(entry.wakeUpTime);
          const hoursSlept = wakeUpTime.diff(sleepStart, "minute") / 60;

          return {
            sleepStart,
            wakeUpTime,
            hoursSlept,
            id: entry._id || entry.id,
            notes: entry.notes,
            score: entry.score ?? 0,
          };
        });

        setSleepData(formatted.sort((a : any, b : any) => a.sleepStart.valueOf() - b.sleepStart.valueOf()));
      } catch (err: any) {
        console.error("Error fetching sleep data:", err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem("token");
          navigate("/");
        }
      }
    };

    fetchSleepData();
  }, []);

  const handleSleepSubmit = (data: {
    sleepStart: any;
    wakeUpTime: any;
    hoursSlept: number;
    notes: string;
    score: number;
  }) => {
    axios
      .post(
        "http://localhost:5001/sleep",
        {
          sleepStart: data.sleepStart.toISOString(),
          wakeUpTime: data.wakeUpTime.toISOString(),
          notes: data.notes,
          score: data.score,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        const saved = res.data;
        const sleepStart = dayjs(saved.sleepStart);
        const wakeUpTime = dayjs(saved.wakeUpTime);
        const hoursSlept = wakeUpTime.diff(sleepStart, "minute") / 60;

        setSleepData((prev) =>
          [...prev, {
            id: saved._id,
            sleepStart,
            wakeUpTime,
            hoursSlept,
            notes: saved.notes,
            score: saved.score ?? 0,
          }].sort((a, b) => a.sleepStart.valueOf() - b.sleepStart.valueOf())
        );
        console.log("✅ Sleep entry saved");
      })
      .catch((err) => console.error("❌ Failed to save sleep entry:", err));
  };

  const handleDeleteSleep = (id: string) => {
    axios
      .delete(`http://localhost:5001/sleep/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setSleepData((prev) => prev.filter((entry) => entry.id !== id));
        console.log("🗑️ Sleep entry deleted");
      })
      .catch((err) => console.error("❌ Failed to delete sleep entry:", err));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const getRecommendation = (score: number, hours: number): string => {
    if (hours < 6) return "Try to get more than 6 hours. Build a consistent sleep schedule.";
    if (score <= 2) return "Consider meditation or chamomile tea to help you destress.";
    if (score <= 3) return "Try winding down with less screen time before bed.";
    if (score >= 4 && hours >= 6) return "Great job! Keep up the consistent sleep.";
    return "Aim for better sleep quality and consistent bedtime.";
  };

  const chartData = {
    labels: sleepData.map((entry) => entry.sleepStart.format("MM/DD HH:mm")),
    datasets: [
      {
        label: "Hours Slept",
        data: sleepData.map((entry) => entry.hoursSlept),
        fill: false,
        borderColor: "#A8A4CE",
        tension: 0.2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: {
        display: true,
        text: "Sleep Duration Over Time",
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const entry = sleepData[context.dataIndex];
            return `Hours Slept: ${entry.hoursSlept} | Score: ${entry.score}/5`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Hours Slept",
        },
      },
      x: {
        title: {
          display: true,
          text: "Sleep Start Time",
        },
      },
    },
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Sleep Tracker Dashboard</h1>
        <FaUserCircle className="profile-icon" onClick={() => navigate("/userprofile")}/>
        
      </div>

      <div className="dashboard-grid-top">
        <div className="dashboard-card">
          <h2>Log Your Sleep</h2>
          <SleepDataInputForm onSubmitSleepData={handleSleepSubmit} />
        </div>

        <div className="dashboard-card">
        <h2>Sleep Logs</h2>
        <ul className="sleep-log-list">
          {sleepData.map((entry) => (
            <li key={entry.id}>
              <span>
                {entry.sleepStart.format("MM/DD HH:mm")} –{" "}
                {entry.wakeUpTime.format("MM/DD HH:mm")} (
                {entry.hoursSlept.toFixed(2)} h)
              </span>
              <FaTrash onClick={() => handleDeleteSleep(entry.id)}/>
            </li>
          ))}
        </ul>
        </div>
      </div>

      <div className="dashboard-grid-bottom">
      <div className="dashboard-card">
        <h2>Sleep Duration Chart</h2>
        <Line data={chartData} options={chartOptions} />
      </div>
        <div className="dashboard-card">
        <h2>Latest Sleep Recommendation</h2>
        <p>
        {sleepData.length > 0 && 
              getRecommendation(
                sleepData[sleepData.length - 1].score,
                sleepData[sleepData.length - 1].hoursSlept
              )}
            </p>
          </div>
        </div>
      </div>
  );
}

export default Dashboard;
