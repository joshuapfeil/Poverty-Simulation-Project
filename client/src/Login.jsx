/*
  Login page with username-based routing to different pages/roles
*/

import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function Login() {
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // Map of special usernames to their respective routes
  const specialUsers = {
    'gimmroot_a': '/admin',
    'comhealth5': '/healthcare',
    'employgen4': '/employer',
    'utilcom2': '/utility',
    'swynmort6': '/mortgage',
    'foodramsup1': '/supercenter',
    'quik7': '/quikcash',
    'utunat9': '/bank'
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!username.trim()) {
      setError('Please enter a username')
      return
    }

    // Check if it's a special user
    if (specialUsers[username]) {
      const path = specialUsers[username]
      const role = path.replace(/^\//, '')
      // persist simple client-side session (username + role)
      localStorage.setItem('currentUser', JSON.stringify({ username, role }))
      navigate(path)
      return
    }

    // Otherwise, search for family by name
    setLoading(true)
    try {
      const response = await fetch(`/families/search/${encodeURIComponent(username)}`)
      const data = await response.json()
      
      if (data.data && data.data.length > 0) {
        // Family found, persist session and navigate to family view by username
        const family = data.data[0]
        localStorage.setItem('currentUser', JSON.stringify({ username: family.name, role: 'family' }))
        navigate(`/family/${encodeURIComponent(family.name)}`)
      } else {
        setError('Invalid username. Please try again.')
      }
    } catch (err) {
      console.error(err)
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Login</h1>
      <br></br>
      <div>
        <form className="centered" id="login" onSubmit={handleLogin}>
          <br></br>
          <p>
            Username:{" "}
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
          </p>
          
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <br></br>
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <br></br><br></br>
        </form>
      </div>
    
    </div>
  )
}