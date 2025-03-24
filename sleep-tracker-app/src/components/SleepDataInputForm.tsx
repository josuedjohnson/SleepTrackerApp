import React, { useState } from "react";
import { TextField, Button } from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";

interface Props {
  onSubmitSleepData: (data: { sleepStart: Dayjs; wakeUpTime: Dayjs; hoursSlept: number; notes: string }) => void;
}

const SleepDataInputForm = ({ onSubmitSleepData }: Props) => {
  const [sleepStart, setSleepStart] = useState<Dayjs | null>(null);
  const [wakeUpTime, setWakeUpTime] = useState<Dayjs | null>(null);
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sleepStart || !wakeUpTime) return alert("Both times are required.");

    const hoursSlept = wakeUpTime.diff(sleepStart, "minute") / 60;
    onSubmitSleepData({ sleepStart, wakeUpTime, hoursSlept, notes });

    // Clear fields
    setSleepStart(null);
    setWakeUpTime(null);
    setNotes("");
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <form onSubmit={handleSubmit}>
        <DateTimePicker label="Sleep Start" value={sleepStart} onChange={setSleepStart} />
        <DateTimePicker label="Wake Up" value={wakeUpTime} onChange={setWakeUpTime} />
        <TextField label="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} multiline rows={2} />
        <Button type="submit" variant="contained" style={{ marginTop: "10px" }}>Submit</Button>
      </form>
    </LocalizationProvider>
  );
};

export default SleepDataInputForm;
