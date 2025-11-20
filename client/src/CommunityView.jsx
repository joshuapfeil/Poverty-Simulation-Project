/*
  This page is going to be a community view used for routing. Replace with a real
  community dashboard when building that part of the app.
*/

import React from 'react'

export default function CommunityView() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Community View (placeholder)</h1>
      <p>Community members will be able to access a family's account and record deductions for services here. This is a placeholder for now.</p>
      <p>Example flow to implement later:</p>
      <ol>
        <li>Select family</li>
        <li>Choose service and amount</li>
        <li>Submit – server will deduct from family's bank_total</li>
      </ol>
    </div>
  )
}
