import React from 'react'
import { Navigate } from 'react-router-dom'

// Simple client-side guard. Checks localStorage.currentUser for { username, role }.
// - allowedRoles: string or array of allowed role names
// On failure, redirect to /login.

export default function ProtectedRoute({ allowedRoles, children }) {
  const raw = localStorage.getItem('currentUser')
  if (!raw) return <Navigate to="/login" replace />

  let user
  try {
    user = JSON.parse(raw)
  } catch (e) {
    return <Navigate to="/login" replace />
  }

  const role = user?.role
  if (!role) return <Navigate to="/login" replace />

  const allowed = Array.isArray(allowedRoles)
    ? allowedRoles.includes(role)
    : role === allowedRoles

  if (!allowed) return <Navigate to="/login" replace />

  return children
}
