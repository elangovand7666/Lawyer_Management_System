import { useState } from "react";
import './Login.css';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar, SnackbarProvider } from "notistack";

function Createprofile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(`http://localhost:5000/api/profile/add`, { name, email, password, age, phone })
    .then((res) => {
        if(res.data.message=="Success")
        {
          alert("Account created successfully!");
          enqueueSnackbar("Account Created Successfully", { variant: "success" })
          navigate(`/home/${res.data.id}`);
        }
        else if(res.data.message=="User already exists")
        {
           enqueueSnackbar(res.data.message, { variant: "warning" })
        }
        else{
          enqueueSnackbar("Invalid details", { variant: "warning" })
        }
    })
    .catch((err) => {
        console.error("Error creating profile:", err);
        alert("Failed to create account. Please try again.");
    });
  };

  return (
    <SnackbarProvider maxSnack={3}>
    <div className="login-container">
      <div className="register-card">
        <div className="logo-container">
          <div className="logo">
            <span>ES</span>
          </div>
        </div>
        <div className="register-header">
          <h1>LawManager</h1>
          <p>Create an account</p>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" />
          </div>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />
          </div>
          <div className="input-group">
            <label htmlFor="age">Age</label>
            <input type="number" id="age" value={age} onChange={(e) => setAge(e.target.value)} placeholder="Enter your age" />
          </div>
          <div className="input-group">
            <label htmlFor="phone">Phone</label>
            <input type="text" minLength="10" maxLength="10" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter your phone number" />
          </div>
          <button type="submit" className="register-button">REGISTER</button>
        </form>
        <div className="login-link">
          <p>Already have an account? <a href="/login">Sign in</a></p>
        </div>
      </div>
    </div>
    </SnackbarProvider>
  );
}

export default Createprofile;
