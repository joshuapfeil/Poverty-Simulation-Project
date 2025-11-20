/*
  React component (not a page) used inside the Admin UI to list/add/edit/delete people
  (household members) for a selected family. Communicates with the
  backend `/people` API.
*/

import React, { useEffect, useState } from 'react'

export default function PeopleManager({ familyId }) {
  const [people, setPeople] = useState([])
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [isWorking, setIsWorking] = useState(false)
  const [medical, setMedical] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editAge, setEditAge] = useState('')
  const [editWorking, setEditWorking] = useState(false)
  const [editMedical, setEditMedical] = useState('')
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
        body: JSON.stringify({ name, age: Number(age) || null, is_working: isWorking, medical_needs: medical, family_id: familyId })
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
      setName('')
      setAge('')
      setIsWorking(false)
      setMedical('')
    } catch (err) {
      setError(err.message)
    }
  }

  const startEdit = (p) => {
    setEditingId(p.id)
    setEditName(p.name || '')
    setEditAge(p.age || '')
    setEditWorking(Boolean(p.is_working))
    setEditMedical(p.medical_needs || '')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditName('')
    setEditAge('')
    setEditWorking(false)
    setEditMedical('')
  }

  const saveEdit = async (id) => {
    try {
      const res = await fetch(`/people/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, name: editName, age: Number(editAge) || null, is_working: editWorking, medical_needs: editMedical, family_id: familyId })
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
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Age" type="number" value={age} onChange={(e) => setAge(e.target.value)} style={{ marginLeft: 6 }} />
        <label style={{ marginLeft: 6 }}>
          <input type="checkbox" checked={isWorking} onChange={(e) => setIsWorking(e.target.checked)} /> Working
        </label>
        <input placeholder="Medical needs" value={medical} onChange={(e) => setMedical(e.target.value)} style={{ marginLeft: 6 }} />
        <button type="submit" style={{ marginLeft: 6 }}>Add</button>
      </form>

      <ul>
        {people.map((p) => (
          <li key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              {editingId === p.id ? (
                <div>
                  <input value={editName} onChange={(e) => setEditName(e.target.value)} />
                  <input value={editAge} onChange={(e) => setEditAge(e.target.value)} type="number" style={{ marginLeft: 6 }} />
                  <label style={{ marginLeft: 6 }}>
                    <input type="checkbox" checked={editWorking} onChange={(e) => setEditWorking(e.target.checked)} /> Working
                  </label>
                  <input value={editMedical} onChange={(e) => setEditMedical(e.target.value)} style={{ marginLeft: 6 }} />
                </div>
              ) : (
                <div>{p.name} — {p.age} yrs — {p.is_working ? 'Working' : 'Not working'} — {p.medical_needs || 'No medical needs'}</div>
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
