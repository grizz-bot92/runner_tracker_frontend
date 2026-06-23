import React, { useEffect, useState } from "react";
import axios from "axios";
import "./volunteerCheckIn.css";

type AidStation = {
  id:number;
  name:string;
}

type Runner = {
  runner_name: string,
  aid_station_name: string;
  checked_in_at: string; 
}

const VolunteerCheckIn = () => {
  const [bibNumber, setBibNumber] = useState("");
  const [aidStations, setAidStations] = useState<AidStation[]>([]);
  const [selectedAidStation, setSelectedAidStation] = useState('');
  const [lastCheckIn, setCheckIn] = useState<Runner | null>(null);
  
  useEffect(() => {
    fetch('http://localhost:8080/aid_stations')
    .then(response => response.json())
    .then(data => setAidStations(data.aid_station));
  }, []);

  const handleClick = async () => {
    const isoTime = new Date().toISOString();
    console.log("SENDING:", isoTime);
    const result = await axios.post('http://localhost:8080/check_in', {
      bib_number: parseInt(bibNumber),
      aid_station_id: parseInt(selectedAidStation),
      checked_in_at: new Date().toISOString()
    });

    console.log("RECEIVED:", result.data.displayRunner.checked_in_at);

    setBibNumber("");
    console.log("Successful entry")
    setCheckIn(result.data.displayRunner);
  };

  const handleChange = (e : React.ChangeEvent<HTMLInputElement>) =>{ 
    setBibNumber(e.target.value);
  };

  const handleAidStationChange = (e : React.ChangeEvent<HTMLSelectElement>) =>{
    setSelectedAidStation(e.target.value);
  }

  return (
    <div className="checkin-container">
      <div className="Header">
        <h1 style={{color: "#C9A876", fontFamily: "monospace"}}>Volunteer Check-In</h1>
      </div>
      <div className="aid-station">
        <p style={{color: "#1B2D1F", fontFamily: "monospace", fontWeight: "bold"}}>Aid Station</p>
        <select onChange={handleAidStationChange} value={selectedAidStation}>
          {aidStations.map(station => (
            <option key={station.id} value={station.id}>
              {station.name}
            </option>
          ))}
        </select>
      </div>
      <div className="bib-number">
        <p style={{color: "#1B2D1F", fontFamily: "monospace", fontWeight: "bold"}}>Bib Number</p>
        <input name="bibNumber" type="text" inputMode="numeric" value={bibNumber} onChange= {handleChange} />
      </div>
      <div className="submitBtn">
        <button onClick={handleClick}> Submit</button>
      </div>
      <div className="lastCheckedIn">
        {lastCheckIn && (
          <div className="checkin-card">
            <p className="checkin-label">Last checked in</p>
            <p className="checkin-detail">
              {lastCheckIn.runner_name} · {lastCheckIn.aid_station_name} · {" "} 
              {new Date(lastCheckIn.checked_in_at).toLocaleTimeString("en-US", {hour: "2-digit", minute: "2-digit"})}
            </p>
          </div>
        )}
        </div>
    </div>
  )
}

export default VolunteerCheckIn;