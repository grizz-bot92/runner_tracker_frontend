import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import { FiEdit } from "react-icons/fi";
import "./raceDirector.css";
import { RiDeleteBinLine } from "react-icons/ri";

type Race = {
  name: string;
  date: string;
  distance: number;
  elevation_gain: number;
  cutoff_time: {
    hours?: number;
    minutes?: number;
    seconds?: number;
  };
}

type Runner = {
  id: number;
  name: string;
  bib_number: number;
}

type AidStation = {
  id: number;
  name: string;
  mile_marker: string;
  cutoff_time: {
    hours: number;
    minutes: number;
  };
  crew_access: boolean;
}

const RaceDirector = () => {
  const [race, setRace] = useState<Race[]>([]);
  const [runner, setRunner] = useState<Runner[]>([]);
  const [aidStation, setAidStation] = useState<AidStation[]>([]);
  const [runnerName, setRunnerName] = useState('');
  const [bibNumber, setBibNumber] = useState('');
  const [aidStationName, setAidStationName] = useState('');
  const [mileMarker, setMileMarker] = useState('');
  const [crewAccess, setCrewAccess] = useState(false);
  const [value, setValue] = useState('1');

  
  useEffect(() => {
    fetch('http://localhost:8080/races')
    .then(response => response.json())
    .then(data => setRace(data.race));
  }, []);

  useEffect(() => {
    fetch('http://localhost:8080/runners')
    .then(response => response.json())
    .then(data => setRunner(data.runner))
  }, []);

  useEffect(() => {
    fetch('http://localhost:8080/aid_stations')
    .then(response => response.json())
    .then(data => setAidStation(data.aid_station))
  }, []);

  const addRunner = async () => {
    const result = await axios.post('http://localhost:8080/runners', {
      name: runnerName,
      bib_number: parseInt(bibNumber),
    });
    setRunner([...runner, result.data.runner]);
  }

  const deleteRunner = async (id: number) => {
    try{
      await axios.delete(`http://localhost:8080/runners/${id}`);
      setRunner(runner.filter((r) => r.id !== id));
    } catch(e){
      console.error(`Runner cant be deleted after check-in ${e}`)
    }
  }

  const addAidStation = async () => {
    const result = await axios.post('http://localhost:8080/aid_stations', {
      name: aidStationName,
      mile_marker: mileMarker,
      crew_access: crewAccess,
    });
    setAidStation([...aidStation, result.data.aidStation]);
  }

  const deleteAidStation = async (id : number) => {
    try {
      await axios.delete(`http://localhost:8080/aid_stations/${id}`);
      setAidStation(aidStation.filter((a) => a.id != id));
    } catch(e){
      console.error(`Aid Station not deleted ${e}`)
    }
  }

  const handleChange = (event: React.SyntheticEvent, newValue : string) => {
    setValue(newValue);
  };
  
  const handleNameChange = (e : React.ChangeEvent<HTMLSelectElement>) => {
    setRunnerName(e.target.value);
  }

  const handleBibChange = (e : React.ChangeEvent<HTMLSelectElement>) => {
    setBibNumber(e.target.value);
  }

  const handleAidStationNameChange = (e : React.ChangeEvent<HTMLSelectElement>) => {
    setAidStationName(e.target.value);
  }

  const handleMileMarkerChange = (e : React.ChangeEvent<HTMLSelectElement>) => {
    setMileMarker(e.target.value);
  }

  const handleCrewAccess = (e : React.ChangeEvent<HTMLSelectElement>) => {
    setCrewAccess(e.target.value);
  }

  const textStyleField = {
    '& .MuiFilledInput-root': {
      borderRadius: '10px',
    },
    '& .MuiFilledInput-underline:before': {
      borderBottom: 'none',
    },
    '& .MuiFilledInput-underline:after': {                      
      borderBottom: 'none',
    },
    '& .MuiFilledInput-underline:hover:before': {
      borderBottom: 'none',
    },
    '& .MuiFilledInput-underline:hover:after':{
      borderBottom: 'none',
    },
  }

  return(
    <div className="page">
      <div className="header-top-race">
        <p className="race-label">Race Director</p>
        <h2 className="header-title">Olympic Mountain 100k</h2>
      </div>


      <div className="director-content">
        <Box sx={{ width: '100%', typography: 'body1' }}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider'}}>
              <TabList onChange={handleChange}>
                <Tab label="Race Info" value="1"/>
                <Tab label="Runners" value="2"/>
                <Tab label="Aid Stations" value="3"/>
              </TabList>
            </Box>

          <TabPanel value="1">
            <div className="race-details">
              <p className='rd-header'>Race details</p>
              <Box
                  component="form"
                  sx={{ '& > :not(style)' : {m: 1, width: '25ch'} }}
                  noValidate
                  autoComplete="off"
                >
                  <TextField id="race-name" label="Race Name" variant="filled" sx={textStyleField}/>
                  <TextField id="race-date" label="Date" variant="filled" sx={textStyleField}/>
                  <TextField id="race-distance" label="Distance" variant="filled" sx={textStyleField}/>
                  <TextField id="race-cutoff" label="Cutoff" variant="filled" sx={textStyleField}/>
                  <div className="saveBtn">
                    <button>Save changes</button>
                  </div>
                </Box>
                </div>
              </TabPanel>
            
              <TabPanel value="2">
                <div className="runner-details">
                  <div className='registered-header'>
                    <p className='rd-header'>Runners ·  </p>
                    <p className='runner-count'> {runner.length} Registered</p>
                  </div>
                  <Box
                    component="form"
                    sx={{ '& > :not(style)' : {m: 1, width: '25ch'} }}
                    noValidate
                    autoComplete="off"
                  >
                    <TextField 
                      id="runner-name" 
                      label="Name" 
                      variant="filled"
                      onChange={handleNameChange}
                      value={runnerName}
                      sx={textStyleField}    
                      />
                    <TextField 
                      id="runner-number" 
                      label="Number" 
                      variant="filled"
                      onChange={handleBibChange}
                      value={bibNumber}
                      sx={textStyleField}
                      />
                        
                    <div className="addRunnerBtn">
                      <button onClick={addRunner}>Add runner</button>
                    </div>
                  </Box>
                </div>

                <div className="added-runners-div">
                    {runner.map((r) => (
                      <div className='registered-runner' key={r.id}>
                        <div className='runner-info'>
                          <span className='bib_number' style={{color: '#B5502E'}}>#{r.bib_number}</span>
                          <span className='runner-name'>{r.name}</span>
                        </div>
                        <div className='buttons'>
                          <FiEdit className='editBtn' style={{ color: '#B5502E', fontSize: '18px'}} />
                          <RiDeleteBinLine className='delBtn' onClick={() => deleteRunner(r.id)} style={{ color: '#B5502E', fontSize: '20px' }}/>
                        </div>
                      </div>
                    ))}
                </div>
              </TabPanel>

            <TabPanel value="3">
                <div className="aid-station-details">
                <p className='aid-header'>Add Aid Station</p>
                <Box
                    component="form"
                    sx={{ '& > :not(style)' : {m: 1, width: '25ch'} }}
                    noValidate
                    autoComplete="off"
                  >
                    <TextField 
                      id="aid-station-name" 
                      label="Name" 
                      variant="filled"
                      onChange={handleAidStationNameChange}
                      value={aidStationName}
                      sx={textStyleField}
                    />
                    
                    <TextField 
                      id="mile-marker" 
                      label="Mile marker" 
                      variant="filled"
                      onChange={handleMileMarkerChange}
                      value={mileMarker}
                      sx={textStyleField}  
                    /> 
                    
                    <div className="addBtn">
                      <button onClick={addAidStation}>Add</button>
                    </div>
                    <FormGroup>
                      <FormControlLabel control={<Checkbox />} label = "Crew access allowed" />
                    </FormGroup>
                  </Box>
                </div>

                <div className='added-aid-station'>
                  <div className='aid-station-header'>
                    <p className='aid-header'>Aid Stations ·  </p>
                    <p className='aid-count'> {aidStation.length} on course</p>
                  </div>
                  {aidStation.map((a) => (
                    <div className='aid-station-div' key={a.id}>
                      <div className='aid-station-info'>
                        <span className='mile-marker' style={{color: '#B5502E'}}>mi {a.mile_marker}</span>
                        <span className='aid-station-name'>{a.name}</span>
                      </div>
                      <div className='buttons'>
                        <FiEdit className='editBtn' style={{ color: '#B5502E', fontSize: '18px'}} />
                        <RiDeleteBinLine className='delBtn' onClick={() => deleteAidStation(a.id)} style={{ color: '#B5502E', fontSize: '20px' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </TabPanel>
            </TabContext>
          </Box>
        </div>
      </div>
  )
}

export default RaceDirector;