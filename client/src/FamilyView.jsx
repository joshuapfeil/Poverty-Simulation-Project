  /*
    This will be the page for a family user. 
  */

import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

export default function FamilyView() {
  const query = useQuery()
  const id = query.get('id')
  const [family, setFamily] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    fetch(`/families/${id}`)
      .then((r) => r.json())
      .then((j) => setFamily((j.data && j.data[0]) || null))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  return (
    <div style={{ padding: 20 }}>
      <h1>Family View</h1>
      {!id && <p>No family selected. Use <code>?id=1</code> in the URL to view a family (placeholder).</p>}
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {family && (
        <div>
          <h2>{family.name}</h2>
          <p>Bank account total: ${family.bank_total}</p>
          <p>(This page is a placeholder — banking actions will be added later.)</p>
        </div>
      )}
    </div>
  )
}
