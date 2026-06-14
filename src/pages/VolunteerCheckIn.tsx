import React, { useEffect, useState } from "react";
import axios from "axios";

type AidStation = {
  id:number;
  name:string;
}

const VolunteerCheckIn = () => {
  const [bibNumber, setBibNumber] = useState("");
  const [aidStations, setAidStations] = useState<AidStation[]>([])
  const [selectedAidStation, setSelectedAidStation] = useState('')
  
  useEffect(() => {
    fetch('http://localhost:8080/aid_stations')
    .then(response => response.json())
    .then(data => setAidStations(data.aid_station));
  }, []);

  const handleClick = async () => {
    await axios.post('http://localhost:8080/check_in', {
      bib_number: parseInt(bibNumber),
      aid_station_id: parseInt(selectedAidStation),
      checked_in_at: new Date().toISOString()
    });

    setBibNumber("");
    console.log("Successful entry")
  };

  const handleChange = (e : React.ChangeEvent<HTMLInputElement>) =>{ 
    setBibNumber(e.target.value);
  };

  const handleAidStationChange = (e : React.ChangeEvent<HTMLSelectElement>) =>{
    setSelectedAidStation(e.target.value);
  }

  return (
    <div>
      <h1>Volunteer Check in</h1>
      <select onChange={handleAidStationChange} value={selectedAidStation}>
        {aidStations.map(station => (
          <option key={station.id} value={station.id}>
            {station.name}
          </option>
        ))}
      </select>

      <input name="bibNumber" type="text" inputMode="numeric" value={bibNumber} onChange= {handleChange} />
      <button onClick={handleClick}> Submit</button>
    </div>
  )
}

export default VolunteerCheckIn;