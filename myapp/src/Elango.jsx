import { useState } from 'react'
import './App.css'
import Addcase from './Addcase.jsx'
import Updatecase from './Updatecase.jsx'
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import Createprofile from './Createprofile.jsx';
import Loginprofile from './Loginprofile.jsx';
import Home from './Home.jsx';
import Profile from './Profile.jsx'
import Caseview from './Caseview.jsx';

function Elango() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Createprofile/>}></Route>
        <Route path='/login' element={<Loginprofile/>}></Route>
        <Route path='/home/:id' element={<Home/>}></Route>
        <Route path='/profile/:id' element={<Profile/>}></Route>
        <Route path="/addcase/:id" element={<Addcase/>}></Route>
        <Route path="/updatecase/:id" element={<Updatecase/>}></Route>
        <Route path="/caseview/:id" element={<Caseview/>}></Route>
      </Routes>
    </Router>
  )
}

export default Elango
