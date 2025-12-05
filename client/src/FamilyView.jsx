  /*
    This will be the page for a family user. 
    They need to be able to see their bank total,
    record deductions for services,
    and possibly see upcoming bills/pay them.
  */


import React, { useEffect, useState, } from 'react'
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

  const [foodWeeks, setFoodWeeks] = useState([false, false, false, false, false])

  useEffect(() => {
    if (!family) return
    try {
      const src = family.food_weeks
      if (!src) return
      let parsed = src
      if (typeof src === 'string') {
        parsed = JSON.parse(src)
      }
      if (Array.isArray(parsed)) {
        const next = [false, false, false, false, false]
        for (let i = 1; i <= 4; i++) {
          next[i] = !!parsed[i - 1]
        }
        setFoodWeeks(next)
      }
    } catch (e) {
    }
  }, [family])

  function toggleWeek(i) {
    if (i < 1 || i > 4) return
    setFoodWeeks((prev) => {
      const next = prev.slice()
      next[i] = !next[i]
      return next
    })
  }

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
      <h1>Family Account View</h1>
      {!id && <p>No family selected. Use <code>?id=1</code> in the URL to view a family (placeholder).</p>}
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {family && (
        <div>
          <h2>{family.name}</h2>
          <p>Bank account total: ${family.bank_total}</p>
          <p>Monthly bills: ${family.monthly_bills}</p>
          //Monthly totals need to be broken down into individual bills ?
          <div style={{ marginBottom: 8 }}>
            <p>Food</p>
            <div style={{ display: 'flex', gap: 12 }}>
              <label>
                <input type="checkbox" checked={foodWeeks[1]} onChange={() => toggleWeek(1)} /> Week 1
              </label>
              <label>
                <input type="checkbox" checked={foodWeeks[2]} onChange={() => toggleWeek(2)} /> Week 2
              </label>
              <label>
                <input type="checkbox" checked={foodWeeks[3]} onChange={() => toggleWeek(3)} /> Week 3
              </label>
              <label>
                <input type="checkbox" checked={foodWeeks[4]} onChange={() => toggleWeek(4)} /> Week 4
              </label>
            </div>
          </div>

          <p>(what else needs to be here??)</p>
        </div>
      )}
    </div>
  )
}
