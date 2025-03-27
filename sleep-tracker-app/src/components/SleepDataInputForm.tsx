import React, { useState } from "react";
import { TextField, Button } from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import axios from "axios";

// Define the prop type
interface Props {
  onSubmitSleepData: (data: {
    sleepStart: Dayjs;
    wakeUpTime: Dayjs;
    hoursSlept: number;
    notes: string;
  }) => void;
}

function SleepDataInputForm({ onSubmitSleepData }: Props) {
  const [sleepStart, setSleepStart] = useState<Dayjs | null>(null);
  const [wakeUpTime, setWakeUpTime] = useState<Dayjs | null>(null);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!sleepStart || !wakeUpTime) {
      setError("Please enter both sleep and wake-up times.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to submit sleep data.");
        return;
      }

      await axios.post(
        "http://localhost:5001/sleep",
        {
          sleepStart: sleepStart.toISOString(),
          wakeUpTime: wakeUpTime.toISOString(),
          notes,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const hoursSlept = wakeUpTime.diff(sleepStart, "minute") / 60;

      // Send the new entry back to the dashboard to update the chart
      onSubmitSleepData({ sleepStart, wakeUpTime, hoursSlept, notes });

      // Clear form
      setSleepStart(null);
      setWakeUpTime(null);
      setNotes("");
      setSuccess("✅ Sleep data saved successfully!");
    } catch (err: any) {
      setError(err.response?.data?.message || "❌ Error saving sleep data");
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <form onSubmit={handleSubmit}>
        <h2>Sleep Data Input</h2>

        <div style={{ marginBottom: "16px" }}>
          <DateTimePicker
            label="Sleep Start Time"
            value={sleepStart}
            onChange={setSleepStart}
            slotProps={{ textField: { fullWidth: true } }}
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <DateTimePicker
            label="Wake Up Time"
            value={wakeUpTime}
            onChange={setWakeUpTime}
            slotProps={{ textField: { fullWidth: true } }}
          />
        </div>

        <TextField
          label="Notes"
          multiline
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          fullWidth
          margin="normal"
        />

        <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: "16px" }}>
          Submit
        </Button>

        {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
        {success && <p style={{ color: "green", marginTop: "10px" }}>{success}</p>}
      </form>
    </LocalizationProvider>
  );
}

export default SleepDataInputForm;
