/*
  This page is going to be a community view used for routing. Replace with a real
  community dashboard when building that part of the app.
*/

// Make sure to make user confirm amount before deducting from family's bank_total.

import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'

export default function CommunityView() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Community Pages (Admin View)</h1>
      <p>Community members will be able to access a family's account and record deductions for services here. This is a placeholder for site-building.</p>


      <p><Link to='/quikcash'><button>Quik Cash</button></Link></p>
      <p><Link to='/bank'><button>U Trust US National Bank</button></Link></p>
      <p><Link to='/mortgage'><button>Sweaney Mortgage and Realty</button></Link></p>
      <p><Link to='/utility'><button>Friendly Utility Company</button></Link></p>
      <p><Link to='/employer'><button>General Employer</button></Link></p>
      <p><Link to='/supercenter'><button>Food-A-Rama Super Center</button></Link></p>
      <p><Link to='/healthcare'><button>Community Health Care</button></Link></p>
    </div>
  )
}