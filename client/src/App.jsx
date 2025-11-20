/*
  This is the Main React application routes and basic home view. 
  It basically serves as the router and landing page for the app.
  Rn it registers routes for -->
  Home, Admin, Login, Family and Community pages
  and fetches families for the home listing.
  --------
  The way it looks def needs some work
*/

import React, { useEffect, useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import FamiliesAdmin from './FamiliesAdmin'
import Login from './Login'
import FamilyView from './FamilyView'
import CommunityView from './CommunityView'

function Home() {
  const [families, setFamilies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/families/')
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok')
        return res.json()
      })
      .then((data) => setFamilies(data.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  //this return is where the changes to the home page are made
  return (
    <div style={{ padding: 20 }}>
      <h1>Poverty Simulation Website</h1>
  <p> <Link to="/login">Login</Link></p>
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
      <Route path="/community" element={<CommunityView />} />
    </Routes>
  )
}
