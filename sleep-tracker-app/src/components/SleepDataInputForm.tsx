import React, { useState } from "react";
import { TextField, Button } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";

function SleepDataInputForm() {
    const [sleepStart, setSleepStart] = useState<Dayjs | null>(null);
    const [wakeUpTime, setWakeUpTime] = useState<Dayjs | null>(null);
    const [notes, setNotes] = useState("");
  
    const handleSubmit = (event: React.FormEvent) => {
      event.preventDefault();
      if (!sleepStart || !wakeUpTime) {
        alert("Please enter both sleep and wake-up times.");
        return;
      }
      console.log("Submitted:", { sleepStart, wakeUpTime, notes });
    };
  
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <form onSubmit={handleSubmit}>
            <h2>Sleep Data Input</h2>
            <DateTimePicker
            label="Sleep Start Time"
            value={sleepStart}
            onChange={setSleepStart}
            />
            <DateTimePicker
            label="Wake Up Time"
            value={wakeUpTime}
            onChange={setWakeUpTime}
            />
            <TextField
            label="Notes"
            multiline
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            />
            <Button type="submit" variant="contained" color="primary">
            Submit
            </Button>
        </form>
        </LocalizationProvider>
    );
  }
  
  export default SleepDataInputForm;