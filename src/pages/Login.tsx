import { useEffect, useState } from "react";
import "./login.css";

const Login = () => {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');


  const handleLogin = (e) => {
    e.preventDefault();
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
                type="text"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
              />
            </p>
          </div>
        </form>
        <div className="submitBtn">
          <button style={{fontWeight: 'bold'}} type="submit">Sign in</button>
        </div>
        <div className="footer">
          <p>Race Tracker · Volunteer Access</p>
        </div>
      </div>
    </div>
  )
}

export default Login;