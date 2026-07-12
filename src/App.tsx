import { BrowserRouter, Routes, Route } from "react-router-dom";
import VolunteerCheckIn from "./pages/VolunteerCheckIn";
import RaceDirector from "./pages/RaceDirector";
import RunnerTracker from "./pages/RunnerTracker";
import Login from "./pages/Login";


const App = () => {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RunnerTracker />} />
        <Route path="/check_in" element={<VolunteerCheckIn/>}/>
        <Route path="/race_director" element={<RaceDirector/>}/>
        <Route path="/runner_tracker" element={<RunnerTracker/>}/>
        <Route path="/login" element={<Login/>}/>
      </Routes>
    </BrowserRouter>
  )
}


export default App;
