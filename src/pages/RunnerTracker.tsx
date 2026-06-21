import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TextField from "@mui/material/TextField";
import "./runnerTracker.css";

type Runner = {
  runner_name:string;
  bib_number:number;
  mile_marker: number;
  aid_station_name: string;
  checked_in_at: string;
}

const startTime = new Date('2026-08-15T05:00:00');

const RunnerTracker = () => {
  const [runner, setRunner] = useState<Runner[]>([]);
  const [inputText, setInputText] = useState("");
  const [time, setTime] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const elapsed = Date.now() - startTime.getTime();
      setTime(elapsed);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  function formatTime():string {
    const absTime = Math.abs(time);
    const totalSeconds = Math.floor(absTime / 1000);
    const totalHours = Math.floor(totalSeconds / 3600);
    const totalMinutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (time < 0) {
      return `Race starts in ${padZero(totalHours)}:${padZero(totalMinutes)}:${padZero(seconds)}`;
    }

    return `${padZero(totalHours)}:${padZero(totalMinutes)}:${padZero(seconds)}`;
  }

  function padZero(number:number){
    return (number < 10 ? "0" : "") + number;
  }

  useEffect(() => {
    fetch('http://localhost:8080/runners/search/leaderboard')
    .then(response => response.json())
    .then(data => setRunner(data.runner));
  }, []);

  function fetchLeaderBoard(){
    return fetch('http://localhost:8080/runners/search/leaderboard')
    .then(response => response.json())
    .then(data => setRunner(data.runner))
  }

  const inputHandler = (e : React.ChangeEvent<HTMLInputElement>)  => {
    const value = e.target.value;
    if(value === ""){
      fetchLeaderBoard();
    }

    setInputText(value);
  }

  const handleSearch = async () => {
    setRunner([]);
    const isBib = !isNaN(Number(inputText));
    const response = await axios.get('http://localhost:8080/runners/search', {
      params: isBib 
      ? { bib_number: inputText }
      : { name: inputText }
    });

    setRunner(response.data.runner);
  }

  return(
    <>
      <div className="main">
        <div className="header-top">
          <div>
            <p className="race-label">Olympic Mountain 100k</p>
            <p className="header-title">Live leaderboard</p>
          </div>
          <div className="race-clock">
            <p className="race-label">Race clock</p>
            <p className="clock-time">{formatTime()}</p>
          </div>
        </div>

        <div className="search">
          <TextField
            id="outlined-basic"
            variant="outlined"
            onChange={inputHandler}
            value={inputText}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#B5502E',
                },
              },
              '& .MuiInputLabel-root': {
                color: '#F2EFE6',
              },
              '& .MuiOutlinedInput-input': {
                color: '#F2EFE6',
              },
            }}
            label="Search bib number or name"
          />
          <button onClick={handleSearch}>Search</button>
        </div>
      </div>
      <div className="leaderboard">
        {runner.map((r) => (
          <div className="runner-card" key={`${r.bib_number}-${r.checked_in_at}`}>
            <div className="runner-card-top">
              <span className="bib">#{r.bib_number}</span>
              <span className="runner-name">{r.runner_name}</span>
              <span className="checkin-info">
                {new Date(r.checked_in_at).toLocaleTimeString("en-US")} · {r.aid_station_name ?? "Start/Finish"}
              </span>
            </div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${((r.mile_marker ?? 0) / 62) * 100}%` }}
              />
            </div>
            <div className="progress-labels">
              <span>mi {r.mile_marker ?? 0}</span>
              <span>62.0</span>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default RunnerTracker;