/*
  This page is going to be a community view used for routing. Replace with a real
  community dashboard when building that part of the app.
*/

// Make sure to make user confirm amount before deducting from family's bank_total.

import React from 'react'

export default function CommunityView() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Community View (placeholder)</h1>
      <p>Community members will be able to access a family's account and record deductions for services here. This is a placeholder for now.</p>
      <p>Example flow to implement later:</p>
      <ol>
        <li>Select service</li>
        <li>Choose family and amount</li>
        <li>Confirm amount</li>
        <li>Submit – server will deduct from family's bank_total</li>
      </ol>
      <button type="submit" style={{ marginLeft: 60 }}>Food-a-Rama Super Center</button>
      <button type="submit" style={{ marginLeft: 60 }}>Building Block Child Care Center</button>
      <button type="submit" style={{ marginLeft: 60 }}>Sweaney Mortgage and Realty</button>
      <button type="submit" style={{ marginLeft: 60 }}>Friendly Utility Company</button>
      <button type="submit" style={{ marginLeft: 60 }}>Trust US National Bank</button>
      <button type="submit" style={{ marginLeft: 60 }}>Quik Cash</button>
    </div>
  )
}
