import { useEffect, useState } from "react";

const Login = () => {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');


  const handleLogin = (e) => {
    e.preventDefault();
  }


  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>
            username
            <input
              type="text"
              value={username}
              onChange={({ target }) => setUserName(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            password
            <input 
              type="text"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </label>
        </div>
        <button className="submitBtn" type="submit">Sign in</button>
      </form>
    </div>
  )
}

export default Login;