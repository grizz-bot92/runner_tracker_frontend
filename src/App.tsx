import { BrowserRouter, Routes, Route } from "react-router-dom";
import VolunteerCheckIn from "./pages/VolunteerCheckIn";
import RaceDirector from "./pages/RaceDirector";
import RunnerTracker from "./pages/RunnerTracker";
import Login from "./pages/Login";
import ProtectedRoutes from "./components/ProtectedRoutes";


const App = () => {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RunnerTracker />} />
        <Route path="/check_in" element={
          <ProtectedRoutes>
            <VolunteerCheckIn/>
          </ProtectedRoutes>  
        }/>
        <Route path="/race_director" element={
          <ProtectedRoutes>
            <RaceDirector/>
          </ProtectedRoutes>
          }/>
        <Route path="/runner_tracker" element={<RunnerTracker/>}/>
        <Route path="/login" element={<Login/>}/>
      </Routes>
    </BrowserRouter>
  )
}


export default App;
