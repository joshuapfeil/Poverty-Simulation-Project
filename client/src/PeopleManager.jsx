/*
  React component (not a page) used inside the Admin UI to list/add/edit/delete people
  (household members) for a selected family. Communicates with the
  backend `/people` API.
*/

import React, { useEffect, useState } from 'react'

export default function PeopleManager({ familyId }) {
  const [people, setPeople] = useState([])
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [week1, setWeek1] = useState('')
  const [week2, setWeek2] = useState('')
  const [week3, setWeek3] = useState('')
  const [week4, setWeek4] = useState('')
  const [onLeave, setOnLeave] = useState(false)
  const [fired, setFired] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editFirstName, setEditFirstName] = useState('')
  const [editLastName, setEditLastName] = useState('')
  const [editWeek1, setEditWeek1] = useState('')
  const [editWeek2, setEditWeek2] = useState('')
  const [editWeek3, setEditWeek3] = useState('')
  const [editWeek4, setEditWeek4] = useState('')
  const [editOnLeave, setEditOnLeave] = useState(false)
  const [editFired, setEditFired] = useState(false)
  const [error, setError] = useState(null)

  const fetchPeople = () => {
    setError(null)
    fetch(`/people?family_id=${familyId}`)
        .then(async (r) => {
          const text = await r.text()
          if (!r.ok) {
            throw new Error(text || `Failed to fetch people (${r.status})`)
          }
          try {
            const json = JSON.parse(text)
            setPeople(json.data || [])
          } catch (parseErr) {
            throw new Error(`Expected JSON but received:\n${text.substring(0, 1000)}`)
          }
        })
        .catch((e) => setError(e.message))
  }

  useEffect(() => {
    if (familyId) fetchPeople()
  }, [familyId])

  const handleAdd = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      const res = await fetch('/people', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          family_id: familyId,
          Week1Pay: Number(week1) || 0,
          Week2Pay: Number(week2) || 0,
          Week3Pay: Number(week3) || 0,
          Week4Pay: Number(week4) || 0,
          OnLeave: onLeave,
          Fired: fired
        })
      })
        const text = await res.text()
        if (!res.ok) {
          throw new Error(text || `Failed to add person (${res.status})`)
        }
        try {
          const json = JSON.parse(text)
          setPeople(json.data || [])
        } catch (parseErr) {
          throw new Error(`Expected JSON but received:\n${text.substring(0, 1000)}`)
        }
      setFirstName('')
      setLastName('')
      setWeek1('')
      setWeek2('')
      setWeek3('')
      setWeek4('')
      setOnLeave(false)
      setFired(false)
    } catch (err) {
      setError(err.message)
    }
  }

  const startEdit = (p) => {
    setEditingId(p.id)
    setEditFirstName(p.first_name || '')
    setEditLastName(p.last_name || '')
    setEditWeek1(p.Week1Pay != null ? String(p.Week1Pay) : '')
    setEditWeek2(p.Week2Pay != null ? String(p.Week2Pay) : '')
    setEditWeek3(p.Week3Pay != null ? String(p.Week3Pay) : '')
    setEditWeek4(p.Week4Pay != null ? String(p.Week4Pay) : '')
    setEditOnLeave(Boolean(p.OnLeave))
    setEditFired(Boolean(p.Fired))
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditFirstName('')
    setEditLastName('')
    setEditWeek1('')
    setEditWeek2('')
    setEditWeek3('')
    setEditWeek4('')
    setEditOnLeave(false)
    setEditFired(false)
  }

  const saveEdit = async (id) => {
    try {
      const res = await fetch(`/people/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          first_name: editFirstName,
          last_name: editLastName,
          family_id: familyId,
          Week1Pay: Number(editWeek1) || 0,
          Week2Pay: Number(editWeek2) || 0,
          Week3Pay: Number(editWeek3) || 0,
          Week4Pay: Number(editWeek4) || 0,
          OnLeave: editOnLeave,
          Fired: editFired
        })
      })
        const text = await res.text()
        if (!res.ok) {
          throw new Error(text || `Failed to save (${res.status})`)
        }
        try {
          const json = JSON.parse(text)
          setPeople(json.data || [])
        } catch (parseErr) {
          throw new Error(`Expected JSON but received:\n${text.substring(0, 1000)}`)
        }
      cancelEdit()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/people/${id}`, { method: 'DELETE' })
        const text = await res.text()
        if (!res.ok) {
          throw new Error(text || `Failed to delete (${res.status})`)
        }
      // after delete just refresh the list
      fetchPeople()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div style={{ border: '1px solid #ccc', padding: 10, marginTop: 10 }}>
      <h4>People</h4>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleAdd} style={{ marginBottom: 10 }}>
        <input placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        <input placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} style={{ marginLeft: 6 }} />
        <input placeholder="Week1 pay" type="number" value={week1} onChange={(e) => setWeek1(e.target.value)} style={{ marginLeft: 6, width: 100 }} />
        <input placeholder="Week2 pay" type="number" value={week2} onChange={(e) => setWeek2(e.target.value)} style={{ marginLeft: 6, width: 100 }} />
        <input placeholder="Week3 pay" type="number" value={week3} onChange={(e) => setWeek3(e.target.value)} style={{ marginLeft: 6, width: 100 }} />
        <input placeholder="Week4 pay" type="number" value={week4} onChange={(e) => setWeek4(e.target.value)} style={{ marginLeft: 6, width: 100 }} />
        <label style={{ marginLeft: 6 }}>
          <input type="checkbox" checked={onLeave} onChange={(e) => setOnLeave(e.target.checked)} /> On leave
        </label>
        <label style={{ marginLeft: 6 }}>
          <input type="checkbox" checked={fired} onChange={(e) => setFired(e.target.checked)} /> Fired
        </label>
        <button type="submit" style={{ marginLeft: 6 }}>Add</button>
      </form>

      <ul>
        {people.map((p) => (
          <li key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              {editingId === p.id ? (
                <div>
                  <input value={editFirstName} onChange={(e) => setEditFirstName(e.target.value)} />
                  <input value={editLastName} onChange={(e) => setEditLastName(e.target.value)} style={{ marginLeft: 6 }} />
                  <input value={editWeek1} onChange={(e) => setEditWeek1(e.target.value)} type="number" style={{ marginLeft: 6, width: 100 }} />
                  <input value={editWeek2} onChange={(e) => setEditWeek2(e.target.value)} type="number" style={{ marginLeft: 6, width: 100 }} />
                  <input value={editWeek3} onChange={(e) => setEditWeek3(e.target.value)} type="number" style={{ marginLeft: 6, width: 100 }} />
                  <input value={editWeek4} onChange={(e) => setEditWeek4(e.target.value)} type="number" style={{ marginLeft: 6, width: 100 }} />
                  <label style={{ marginLeft: 6 }}>
                    <input type="checkbox" checked={editOnLeave} onChange={(e) => setEditOnLeave(e.target.checked)} /> On leave
                  </label>
                  <label style={{ marginLeft: 6 }}>
                    <input type="checkbox" checked={editFired} onChange={(e) => setEditFired(e.target.checked)} /> Fired
                  </label>
                </div>
              ) : (
                <div>
                  {p.first_name} {p.last_name} — W1: {p.Week1Pay || 0} W2: {p.Week2Pay || 0} W3: {p.Week3Pay || 0} W4: {p.Week4Pay || 0} — {p.OnLeave ? 'On Leave' : 'Not On Leave'} — {p.Fired ? 'Fired' : 'Not Fired'}
                </div>
              )}
            </div>
            <div>
              {editingId === p.id ? (
                <>
                  <button onClick={() => saveEdit(p.id)}>Save</button>
                  <button onClick={cancelEdit} style={{ marginLeft: 6 }}>Cancel</button>
                </>
              ) : (
                <>
                  <button onClick={() => startEdit(p)}>Edit</button>
                  <button onClick={() => handleDelete(p.id)} style={{ marginLeft: 6 }}>Delete</button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
