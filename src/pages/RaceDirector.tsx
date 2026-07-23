import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../axiosInstance';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import { FiEdit } from "react-icons/fi";
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import { RiDeleteBinLine } from "react-icons/ri";
import { RiGroupLine } from "react-icons/ri";
import "./raceDirector.css";

type Race = {
  id: number;
  name: string;
  date: string;
  distance: string;
  elevation_gain: number;
  cutoff_time: string | {
    hours: number;
    minutes: number;
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
  crew_access: boolean;
}


const RaceDirector = () => {
  const [race, setRace] = useState<Race[]>([]);
  const [runner, setRunner] = useState<Runner[]>([]);
  const [aidStation, setAidStation] = useState<AidStation[]>([]);
  const [raceName, setRaceName] = useState('');
  const [raceDate, setRaceDate] = useState('');
  const [raceDistance, setRaceDistance] = useState('');
  const [raceCutoff, setRaceCutoff] = useState('');
  const [runnerName, setRunnerName] = useState('');
  const [bibNumber, setBibNumber] = useState('');
  const [aidStationName, setAidStationName] = useState('');
  const [mileMarker, setMileMarker] = useState('');
  const [crewAccess, setCrewAccess] = useState(false);
  const [value, setValue] = useState('1');

  
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/races`)
    .then(response => response.json())
    .then(data => setRace(data.race.sort((a: Race, b: Race) => parseFloat(a.distance) - parseFloat(b.distance))));
  }, []);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/runners`)
    .then(response => response.json())
    .then(data => setRunner(data.runner.sort((a: Runner, b: Runner) => a.bib_number - b.bib_number)));
  }, []);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/aid_stations`)
    .then(response => response.json())
    .then(data => setAidStation(data.aid_station.sort((a: AidStation, b: AidStation) => parseFloat(a.mile_marker) - parseFloat(b.mile_marker))))
  }, []);

  const addRace = async() => {
    const token = localStorage.getItem('token');
    await axiosInstance.post(`${import.meta.env.VITE_API_URL}/races`, {
      name: raceName,
      date: new Date(raceDate),
      distance: parseFloat(raceDistance),
      cutoff_time: raceCutoff
      }
    });

    const response = await fetch(`${import.meta.env.VITE_API_URL}/races`)
    const data = await response.json();

    setRace(data.race.sort((a:Race, b: Race ) => parseFloat(a.distance) - parseFloat(b.distance)));
  }

  const deleteRace = async(id : number) => {
    const token = localStorage.getItem('token');
    try{
      await axios.delete(`${import.meta.env.VITE_API_URL}/races/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setRace(race.filter((r) => r.id != id));
    } catch(e){
      console.error(`Race not deleted ${e}`)
    }    
  }

  const addRunner = async () => {
    const token = localStorage.getItem('token');
    await axiosInstance.post(`${import.meta.env.VITE_API_URL}/runners`, {
      name: runnerName,
      bib_number: parseInt(bibNumber),
    }
  });

    const response = await fetch(`${import.meta.env.VITE_API_URL}/runners`)
    const data = await response.json();
    setRunner(data.runner.sort((a: Runner, b: Runner) => a.bib_number - b.bib_number));
  }

  const deleteRunner = async (id: number) => {
    const token  = localStorage.getItem('token')
    try{
      await axios.delete(`${import.meta.env.VITE_API_URL}/runners/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setRunner(runner.filter((r) => r.id !== id));
    } catch(e){
      console.error(`Runner cant be deleted after check-in ${e}`)
    }
  }

  const addAidStation = async () => {
    const token = localStorage.getItem('token');
    console.log('Add aid Station called')
    await axiosInstance.post(`${import.meta.env.VITE_API_URL}/aid_stations`, {
      name: aidStationName,
      mile_marker: mileMarker,
      crew_access: crewAccess,
    }
  });

    const response = await fetch(`${import.meta.env.VITE_API_URL}/aid_stations`);
    const data = await response.json();
    setAidStation(data.aid_station.sort((a: AidStation, b: AidStation) => parseFloat(a.mile_marker) - parseFloat(b.mile_marker)));
  }

  const deleteAidStation = async (id : number) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/aid_stations/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setAidStation(aidStation.filter((a) => a.id != id));
    } catch(e){
      console.error(`Aid Station not deleted ${e}`)
    }
  }

  const handleChange = (_event: React.SyntheticEvent, newValue : string) => {
    setValue(newValue);
  };
  
  const handleRunnerNameChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRunnerName(e.target.value);
  }

  const handleBibChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setBibNumber(e.target.value);
  }

  const handleRaceNameChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRaceName(e.target.value);
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRaceDate(e.target.value);
  }
  
  const handleRaceCutoff = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRaceCutoff(e.target.value);
  }

  const handleDistanceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRaceDistance(e.target.value);
  }

  const handleAidStationNameChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setAidStationName(e.target.value);
  }

  const handleMileMarkerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setMileMarker(e.target.value);
  }


  const handleCrewAccess = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCrewAccess(e.target.checked);
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
                  <TextField id="race-name" label="Race Name" variant="filled" sx={textStyleField} onChange={handleRaceNameChange} value={raceName}/>
                  <TextField id="race-distance" label="Distance" variant="filled" sx={textStyleField} onChange={handleDistanceChange} value={raceDistance}/>
                  <TextField id="race-date" label="Date" variant="filled" sx={textStyleField} onChange={handleDateChange} value={raceDate}/>
                  <TextField id="race-cutoff" label="Cutoff" variant="filled" sx={textStyleField} onChange={handleRaceCutoff} value={raceCutoff} placeholder='e.g 30 hours'/>
                  <div className="saveBtn">
                    <button onClick={addRace}>Save changes</button>
                  </div>
                </Box>
                </div>

                <div className='added-race-div'>
                  {race.map((r) => (
                      <div className='race-info' key={`${r.id}`}>
                        <div className='individual-race-info'>
                          <div className='race-name-heading'>
                            <span className='race-name' style={{fontWeight: 'bold', fontSize: '15px'}}>{r.name}</span>
                          </div>
                        <div className='race-sub-info'>
                          <span className='race-date'> {new Date(r.date).toLocaleDateString()}</span>
                          <span className='race-distance'> · {r.distance} mi · </span>
                          <span className='race-cutoff'>{typeof r.cutoff_time === 'object' ? `${r.cutoff_time.hours} hr cutoff` : r.cutoff_time}</span>  
                        </div>

                        </div>
                        <div className='buttons'>
                            <FiEdit className='editBtn' style={{ color: '#B5502E', fontSize: '18px'}} />
                            <RiDeleteBinLine className='delBtn' onClick={() => deleteRace(r.id)} style={{ color: '#B5502E', fontSize: '20px' }}/>
                          </div>
                      </div>
                    ))}    
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
                      onChange={handleRunnerNameChange}
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
                      <button  type='button' onClick={addRunner}>Add runner</button>
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
                      <button type='button' onClick={addAidStation}>Add</button>
                    </div>
                    <FormGroup>
                      <FormControlLabel control={<Checkbox onChange={handleCrewAccess} checked={crewAccess} />} label = "Crew access allowed" />
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
                        {a.crew_access && <RiGroupLine style={{ color: '#B5502E', fontSize: '16px' }} />}
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