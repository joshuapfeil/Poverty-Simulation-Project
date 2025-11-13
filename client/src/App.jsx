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

  return (
    <div style={{ padding: 20 }}>
      <h1>Poverty Simulation — Families</h1>
  <p><Link to="/admin">Go to Admin</Link> · <Link to="/login">Login</Link></p>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {!loading && !error && (
        <ul>
          {families.map((f) => (
            <li key={f.id}>{f.name} — ${f.bank_total || 0}</li>
          ))}
        </ul>
      )}
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
