import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import './Profile.css'; // Renamed CSS file for uniqueness
import { enqueueSnackbar, SnackbarProvider } from "notistack";

function UserProfile() { // Changed component name for uniqueness
    const { id } = useParams();
    const [userData, setUserData] = useState({ name: "", password: "", age: "", phone: "", email: "" });

    const navigate=useNavigate()
    useEffect(() => {
        axios.get(`http://localhost:5000/api/profile/view/${id}`)
            .then((res) => {
                if (res.data.message) {
                    setUserData(res.data.message); // Assuming 'message' contains user details
                }
            })
            .catch((error) => {
                console.error("Error fetching profile:", error);
            });
    }, [id]);
    const home=()=>{
        navigate(`/home/${id}`)
    }

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:5000/api/profile/update/${id}`,{userData})
        .then((res)=>{
            if(res.data.message=="Success")
            {
                enqueueSnackbar(`${userData.name} Details Updated Successfully`, { variant: "success" })
            }
            else{
                enqueueSnackbar("Details not Updated", { variant: "warning" })
            }
        })
        .catch((error)=>{
            enqueueSnackbar("Invalid", { variant: "warning" })
        })
    };

    return (
        <SnackbarProvider maxSnack={3}>
        <div className="top">
                <img className="home-logo" src="/src/assets/logo.png" alt="Law Firm Logo"></img>
                <h2>LawManager</h2>
                <div className="topbs">
                    <button className="tbutton" onClick={home}>Home</button>
                    <button className="tbutton" onClick={()=>{navigate('/')}}>Logout</button>
                </div>
            </div>
            <h1 className="user-profile-heading">User Profile</h1>
            <form className="user-profile-form" onSubmit={handleSubmit}>
                <label className="user-profile-label">Name:</label>
                <input
                    type="text"
                    name="name"
                    className="user-profile-input"
                    value={userData.name}
                    onChange={handleChange}
                />

                <label className="user-profile-label">Password:</label>
                <input
                    type="password"
                    name="password"
                    className="user-profile-input"
                    value={userData.password}
                    onChange={handleChange}
                />

                <label className="user-profile-label">Age:</label>
                <input
                    type="text"
                    name="age"
                    maxLength="2"
                    className="user-profile-input"
                    value={userData.age}
                    onChange={handleChange}
                />

                <label className="user-profile-label">Phone:</label>
                <input
                    type="tel"
                    minLength="10"
                    maxLength="10"
                    name="phone"
                    className="user-profile-input"
                    value={userData.phone}
                    onChange={handleChange}
                />

                <label className="user-profile-label">Email:</label>
                <input
                    type="email"
                    name="email"
                    className="user-profile-input"
                    value={userData.email}
                    onChange={handleChange}
                />

                <button type="submit" className="user-profile-button">Submit</button>
            </form>
        </SnackbarProvider>
    );
}

export default UserProfile;
