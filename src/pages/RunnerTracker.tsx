import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TextField from "@mui/material/TextField";
import "/src/App.css";

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
    const isBib = !isNaN(Number(inputText));
    const response = await axios.get('http://localhost:8080/runners/search', {
      params: isBib 
      ? { bib_number: inputText }
      : { name: inputText }
    });

    setRunner(response.data.runner);
  }

  return(
    <div>
      <div className="main">
        <div className="search">
          <TextField
            id="outlined-basic"
            variant="outlined"
            onChange={inputHandler}
            value={inputText}
            onKeyDown={(e) => {
              if(e.key === "Enter"){
                handleSearch();
                }
            }}
            fullWidth
            label="Search"
          />
          <button onClick={handleSearch}>Search</button>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Runner</th>
            <th>Bib Number</th>
            <th>Mile Marker</th>
            <th>Aid Station</th>
            <th>Checked In</th>
          </tr>
        </thead>
        <tbody>
          {runner.map((r) => (
            <tr key={r.bib_number}>
              <td>{r.runner_name}</td>
              <td>{r.bib_number}</td>
              <td>{r.mile_marker}</td>
              <td>{r.aid_station_name}</td>
              <td>{new Date(r.checked_in_at).toLocaleTimeString("en-US")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default RunnerTracker;