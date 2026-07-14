import React, {  useState } from "react";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from 'jwt-decode';
import "./login.css";
import axios from "axios";

interface User {
  id: number;
  username: string;
  password: string;
  role: string;
  token: string;
}


const Login = () => {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  
  const login = async() => {
    try{
      const response = await axios.post<User>(`${import.meta.env.VITE_API_URL}/login`, {
      username,
      password,
    });
      const token = response.data.token;
      const decoded = jwtDecode<User>(token);
      
      if(decoded.role === 'admin') {
        navigate('/race_director')
       } else {
        navigate('/check_in')
       };

      localStorage.setItem('token', token);
      
    } catch (e) {
      console.error(`wrong credentials ${e}`)
    }
    
  }

  const handleLogin = (e : React.FormEvent) => {
    e.preventDefault();
    login();
  }

  return (
    <div>
      <div className="header-login">
        <p className="race-label">Sign in</p> 
        <h2 className="header-title">Olympic Mountain 110k</h2>   
      </div>

      <div className="sign-in-container">
        <form onSubmit={handleLogin}>
          <div className="username">
            <p style={{color: "#1B2D1F", fontFamily: "monospace", fontWeight: "bold"}}>
              Username
              <input
                type="text"
                value={username}
                onChange={({ target }) => setUserName(target.value)}
              />
            </p>
          </div>
          <div className="password">
            <p style={{color: "#1B2D1F", fontFamily: "monospace", fontWeight: "bold"}}>
              Password
              <input 
                type="password"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
              />
            </p>
          </div>
          <div className="submitBtn">
            <button style={{fontWeight: 'bold'}} type="submit">Sign in</button>
          </div>
        </form>
        <div className="footer">
          <p>Race Tracker · Volunteer Access</p>
        </div>
      </div>
    </div>
  )
}

export default Login;