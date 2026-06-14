import { BrowserRouter, Routes, Route } from "react-router-dom";
import VolunteerCheckIn from "./pages/VolunteerCheckIn";
import RaceDirector from "./pages/RaceDirector";
import RunnerTracker from "./pages/RunnerTracker";


const App = () => {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/check_in" element={<VolunteerCheckIn/>}/>
        <Route path="/runner" element={<RaceDirector/>}/>
        <Route path="/race" element={<RunnerTracker/>}/>
      </Routes>
    </BrowserRouter>
  )
}


export default App;
