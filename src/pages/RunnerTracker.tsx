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

const RunnerTracker = () => {
  const [runner, setRunner] = useState<Runner[]>([]);
  const [inputText, setInputText] = useState("");

  const elapsedTime = "00:00:00";

  useEffect(() => {
    fetch('http://localhost:8080/runners/search/leaderboard')
    .then(response => response.json())
    .then(data => setRunner(data.runner));
  }, []);

  const inputHandler = (e : React.ChangeEvent<HTMLInputElement>)  => {
    const value = e.target.value;
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
            <p className="clock-time">{elapsedTime}</p>
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
                {new Date(r.checked_in_at).toLocaleTimeString("en-US")} · {r.aid_station_name}
              </span>
            </div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${(r.mile_marker ?? 0 / 62) * 100}%` }}
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