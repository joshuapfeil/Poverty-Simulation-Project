/*
  Login page. Def gonna need to work on that functionality. Also how/where do we wanna
  manage user accounts and roles? Credentials storage?
*/

import React from 'react'
import { Link } from 'react-router-dom'

export default function Login() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Login (placeholder)</h1>
      <p>This is a non-functional login page placeholder. Choose a role to continue:</p>
      <div style={{ display: 'flex', gap: 8 }}>
        <Link to="/family"><button>Family</button></Link>
        <Link to="/community"><button>Community</button></Link>
        <Link to="/admin"><button>Admin</button></Link>
      </div>
    </div>
  )
}
