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
import ProtectedRoute from './ProtectedRoute'
import BannerImage from './images/povsim.png'

function Home() {
  useFamilies()
  // Home currently doesn't render the family list; using the hook keeps data fresh for other pages
  

  //this return is where the changes to the home page are made
  return (
    <div>
      <img src={BannerImage}></img>
      <div className="centered" style={{ padding: 20 }}>
        <p style={{ padding: 20 }}>Welcome to the digital banking system for Boise State University's Poverty Simulation. <br></br>This system was created in partnership between the Nursing program and the Games, Interactive Media and Mobile program.</p>
        <p style={{ padding: 20 }}>Please press BEGIN when instructed.</p>
        <p style={{ padding: 10 }}> <Link to="/login"><button>BEGIN</button></Link></p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/family" element={<FamilyView />} />
      {/* Support both numeric id and username routes for backward compatibility */}
      <Route path="/family/:id" element={<FamilyView />} />
      <Route path="/family/:username" element={<FamilyView />} />
      <Route path="/community" element={<ProtectedRoute allowedRoles="community"><CommunityView /></ProtectedRoute>} />

      {/* Protected routes — only accessible after logging in with the matching role */}
      <Route path="/admin" element={<ProtectedRoute allowedRoles="admin"><FamiliesAdmin /></ProtectedRoute>} />
      <Route path="/utility" element={<ProtectedRoute allowedRoles="utility"><Utility /></ProtectedRoute>} />
      <Route path="/bank" element={<ProtectedRoute allowedRoles="bank"><Bank /></ProtectedRoute>} />
      <Route path="/employer" element={<ProtectedRoute allowedRoles="employer"><Employer /></ProtectedRoute>} />
      <Route path="/mortgage" element={<ProtectedRoute allowedRoles="mortgage"><Mortgage /></ProtectedRoute>} />
      <Route path="/quikcash" element={<ProtectedRoute allowedRoles="quikcash"><QuikCash /></ProtectedRoute>} />
      <Route path="/supercenter" element={<ProtectedRoute allowedRoles="supercenter"><SuperCenter /></ProtectedRoute>} />
      <Route path="/healthcare" element={<ProtectedRoute allowedRoles="healthcare"><Healthcare /></ProtectedRoute>} />
    </Routes>
  )
}
