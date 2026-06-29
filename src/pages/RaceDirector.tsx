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
  name: string;
  bib_number: number;
}

type AidStation = {
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
  const [aidStation, setAidStations] = useState<AidStation[]>([]);
  const [value, setValue] = useState('1');

  const handleChange = (event: React.SyntheticEvent, newValue : string) => {
    setValue(newValue);
  };  
  
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
              <p>Race details</p>
              <Box
                  component="form"
                  sx={{ '& > :not(style)' : {m: 1, width: '25ch'} }}
                  noValidate
                  autoComplete="off"
                >
                  <TextField id="race-name" label="Race Name" variant="filled"/>
                  <TextField id="race-date" label="Date" variant="filled"/>
                  <TextField id="race-distance" label="Distance" variant="filled"/>
                  <TextField id="race-cutoff" label="Cutoff" variant="filled"/>
                  <div className="saveBtn">
                    <button>Save changes</button>
                  </div>
                </Box>
                </div>
              </TabPanel>
            
              <TabPanel value="2">
                <div className="runner-details">
                  <p>Runners · 3 registered </p>
                  <Box
                    component="form"
                    sx={{ '& > : not(style)' : {m: 1, width: '25ch'} }}
                    noValidate
                    autoComplete="off"
                  >
                    <TextField id="runner-name" label="Name" variant="filled"/>
                    <TextField id="runner-number" label="Number" variant="filled"/>
                    <div className="addRunnerBtn">
                      <button>Add runner</button>
                    </div>
                  </Box>
                </div>
                <div className="added-runners-div">
                    {runner.map((r) => (
                      <div className='runner-card'>
                        <div className='runner-info'>
                          <span className='bib_number'>#{r.bib_number}</span>
                          <span className='runner-name'>{r.name}</span>
                        </div>
                        <div className='buttons'>
                          <button className='editBtn'><FiEdit /></button>
                          
                        </div>
                      </div>
                    ))}
                </div>
              </TabPanel>

            <TabPanel value="3">
                <div className="aid-station-details">
                <p>Add Aid Station</p>
                <Box
                    component="form"
                    sx={{ '& > :not(style)' : {m: 1, width: '25ch'} }}
                    noValidate
                    autoComplete="off"
                  >
                    <TextField id="aid-station-name" label="Name" variant="filled"/>
                    <TextField id="mile-marker" label="Mile marker" variant="filled"/> 
                    <div className="addBtn">
                      <button>Add</button>
                    </div>
                    <FormGroup>
                      <FormControlLabel control={<Checkbox />} label = "Crew access allowed" />
                    </FormGroup>
                  </Box>
                </div>
              </TabPanel>
            </TabContext>
          </Box>
        </div>
      </div>
  )
}

export default RaceDirector;