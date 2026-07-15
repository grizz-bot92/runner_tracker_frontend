import React, { useEffect, useState } from "react";
import axios from "axios";
import "./volunteerCheckIn.css";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';

type AidStation = {
  id:number;
  name:string;
}

type Runner = {
  runner_name: string;
  aid_station_name: string;
  checked_in_at: string;
  status: string; 
}


const VolunteerCheckIn = () => {
  const [bibNumber, setBibNumber] = useState("");
  const [error, setError] = useState('');
  const [aidStations, setAidStations] = useState<AidStation[]>([]);
  const [selectedAidStation, setSelectedAidStation] = useState('');
  const [lastCheckIn, setCheckIn] = useState<Runner | null>(null);
  const [open, setOpen] = useState(false);
  const [runnerStatus, setStatus] = useState('active');
  
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/aid_stations`)
    .then(response => response.json())
    .then(data => {
      setAidStations(data.aid_station)
      if(data.aid_station.length > 0){
        setSelectedAidStation(data.aid_station[0].id.toString());
      }
    });
  }, []);

  const handleClick = async () => {
    const isoTime = new Date().toISOString();
    const token = localStorage.getItem('token');
    console.log("SENDING:", isoTime);
    try{
      const result = await axios.post(`${import.meta.env.VITE_API_URL}/check_in`, {
      bib_number: parseInt(bibNumber),
      aid_station_id: parseInt(selectedAidStation),
      checked_in_at: new Date().toISOString()
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log("RECEIVED:", result.data.displayRunner.checked_in_at);

    setBibNumber("");
    console.log("Successful entry")
    setCheckIn(result.data.displayRunner);
    setError('');
  
    } catch(e) {
        console.error(e)
        setError('Runner not found - check bib number');
    }
    
  };

  const handleClickOpen = async () => {
    setOpen(true);
  }
  
  const handleClose = async () => {
    setOpen(false);
  }

  const handleChange = (e : React.ChangeEvent<HTMLInputElement>) =>{ 
    setBibNumber(e.target.value);
  };

  const handleAidStationChange = (e : React.ChangeEvent<HTMLSelectElement>) =>{
    setSelectedAidStation(e.target.value);
  }

  const confirmDNF = async () => {
    const token = localStorage.getItem('token');
    await axios.patch(`${import.meta.env.VITE_API_URL}/runners/status`, {
      status: runnerStatus,
      bib_number: parseInt(bibNumber)
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    setStatus('dnf');
    console.log(`Runner Status : ${runnerStatus}`);
    setOpen(false);
  }

  return (
    <>
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
          {error && <p style={{ color: '#B5502E', fontFamily: 'monospace', padding: '0 1.5rem' }}>{error}</p>}
          <input name="bibNumber" type="text" inputMode="numeric" value={bibNumber} onChange= {handleChange} />
        </div>
        <div className='DNFBtn'>
          <button onClick={handleClickOpen}>
            Mark DNF
          </button>
        </div>
        
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby='alert-dialog-title'
          role='alertdialog'
        >
          <DialogTitle id='alert-dialog-title'>
            {`Mark runner #${bibNumber} as DNF?`}
          </DialogTitle>
          <DialogActions>
            <Button onClick={handleClose} autoFocus>Cancel</Button>
            <Button onClick={confirmDNF}>Confirm</Button>
          </DialogActions>
        </Dialog>

        <div className="submitBtn">
          <button onClick={handleClick}>Check-In</button>
        </div>
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
    </>
  )
}

export default VolunteerCheckIn;