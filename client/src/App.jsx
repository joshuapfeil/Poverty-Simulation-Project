/*
  This is the Main React application routes and basic home view. 
  It basically serves as the router and landing page for the app.
  Rn it registers routes for -->
  Home, Admin, Login, Family and Community pages
  and fetches families for the home listing.
  --------
  The way it looks def needs some work
*/

import React from 'react'
import useFamilies from './useFamilies'
import { Routes, Route, Link } from 'react-router-dom'
import FamiliesAdmin from './FamiliesAdmin'
import Login from './Login'
import FamilyView from './FamilyView'
import CommunityView from './CommunityView'
import Utility from './Utility'
import Bank from './Bank'
import Employer from './Employer'
import Mortgage from './Mortgage'
import SuperCenter from './SuperCenter'
import QuikCash from './QuikCash'
import Healthcare from './Healthcare'
import BannerImage from './images/povsim.png'

function Home() {
  useFamilies()
  // Home currently doesn't render the family list; using the hook keeps data fresh for other pages
  

  //this return is where the changes to the home page are made
  return (
    <div>
      <img src={BannerImage}></img>
      <div className="centered" style={{ padding: 20 }}>
        <p style={{ padding: 20 }}>In partnership between the Boise State Nursing program and the Games, Interactive Media and Mobile program, a digitized version of Missouri Community Action's Poverty Simulation. Please press the BEGIN button when the instructor says to.</p>
        <p style={{ padding: 10 }}> <Link to="/login"><button>Begin</button></Link></p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin" element={<FamiliesAdmin />} />
      <Route path="/login" element={<Login />} />
      <Route path="/family" element={<FamilyView />} />
      <Route path="/family/:id" element={<FamilyView />} />
      <Route path="/community" element={<CommunityView />} />
      <Route path="/utility" element={<Utility />} />
      <Route path="/bank" element={<Bank />} />
      <Route path="/employer" element={<Employer />} />
      <Route path="/mortgage" element={<Mortgage />} />
      <Route path="/quikcash" element={<QuikCash />} />
      <Route path="/supercenter" element={<SuperCenter />} />
      <Route path="/healthcare" element={<Healthcare />} />
    </Routes>
  )
}
