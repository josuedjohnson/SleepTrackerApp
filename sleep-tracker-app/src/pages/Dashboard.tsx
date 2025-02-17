import SleepDataInputForm from "../components/SleepDataInputForm";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

function Dashboard() {
  return (
    <>
        <h1>Sleep Tracker Dashboard</h1>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <SleepDataInputForm />
        </LocalizationProvider>
    </>
  );
}

export default Dashboard;