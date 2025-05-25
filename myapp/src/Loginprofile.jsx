import { useState } from "react";
import './Login.css'
import axios from "axios";
import {useNavigate} from 'react-router-dom'
import { SnackbarProvider,enqueueSnackbar } from 'notistack';

function Loginprofile() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigate=useNavigate()

  const sub = (e) => {
      e.preventDefault();
      console.log("Login submitted:", { email, password });
      axios.get(`http://localhost:5000/api/profile/login/${email}/${password}`)  // Change GET to POST
      .then((res) => {
        console.log("Response:", res.data);  // Debugging response
  
        if (res.data.message === "Login successful") {
          enqueueSnackbar(res.data.message, { variant: "success" });
          navigate(`/home/${res.data.id}`);
        } else if (res.data.message === "Password Incorrect") {
          enqueueSnackbar(res.data.message, { variant: "warning" });
        } else {
          enqueueSnackbar(res.data.message, { variant: "warning" });
        }
      })
      .catch((err) => {
          console.error("Error logging in:", err);
          alert("Login failed. Please check your credentials.");
      });
  };



  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <SnackbarProvider maxSnack={3}>
    <div class="login-container">
      <div class="login-card">
        <div class="logo-container">
          <div class="logo">
            <span>ES</span>
          </div>
        </div>
        
        <div class="login-header">
          <h1>LawManager</h1>
          <p>Sign in to your account</p>
        </div>
        
        
        <form onSubmit={sub} class="login-form">
          <div class="input-group">
            <div class="input-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </div>
            <input 
              type="email" 
              id="username"
              value={email} 
              onChange={(e) => {setEmail(e.target.value)}}
              placeholder="Email"
              class="input-with-icon"
            />
          </div>
          
          <div class="input-group">
            <div class="input-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            </div>
            <input 
              type={isPasswordVisible ? "text" : "password"}
              id="password"
              value={password} 
              onChange={(e) => {setPassword(e.target.value)}}
              placeholder="Password"
              class="input-with-icon"
            />
            <button 
              type="button" 
              class="password-toggle" 
              onClick={togglePasswordVisibility}
            >
              {isPasswordVisible ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path><line x1="2" x2="22" y1="2" y2="22"></line></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              )}
            </button>
          </div>
          
          <div class="form-footer">
            <div class="remember-me">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>
            <a href="#" class="forgot-password">Forgot Password?</a>
          </div>
          
          <button type="submit" class="login-button">
            <span>LOGIN</span>
          </button>
        </form>
        
        <div class="signup-link">
          <p>Don't have an account? <a href="/">Sign up</a></p>
        </div>
      </div>
    </div>
    </SnackbarProvider>
  );
}

export default Loginprofile;