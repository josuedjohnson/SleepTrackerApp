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

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Title);

function Dashboard() {
  const navigate = useNavigate();
  const [sleepData, setSleepData] = useState<
    { sleepStart: any; wakeUpTime: any; hoursSlept: number; notes: string }[]
  >([]);

  const token = localStorage.getItem("token");

  // Fetch sleep data for logged-in user
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
            notes: entry.notes,
          };
        });

        setSleepData(formatted);
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
  }) => {
    setSleepData((prev) => [...prev, data]);

    axios
      .post(
        "http://localhost:5001/sleep",
        {
          sleepStart: data.sleepStart.toISOString(),
          wakeUpTime: data.wakeUpTime.toISOString(),
          notes: data.notes,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => console.log("✅ Sleep entry saved"))
      .catch((err) => console.error("❌ Failed to save sleep entry:", err));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const chartData = {
    labels: sleepData.map((entry) => entry.sleepStart.format("MM/DD HH:mm")),
    datasets: [
      {
        label: "Hours Slept",
        data: sleepData.map((entry) => entry.hoursSlept),
        fill: false,
        borderColor: "rgba(75,192,192,1)",
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
          label: (context: any) => `${context.parsed.y} hours`,
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
    <div style={{ display: "flex", gap: "40px", padding: "20px" }}>
      <div style={{ flex: 1 }}>
        <h1>Sleep Tracker Dashboard</h1>
        <button onClick={handleLogout}>Logout</button>
        <SleepDataInputForm onSubmitSleepData={handleSleepSubmit} />
      </div>

      <div style={{ flex: 1 }}>
        <h2>Sleep Duration Chart</h2>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

export default Dashboard;
