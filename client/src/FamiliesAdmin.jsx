import React, { useEffect, useState } from 'react'

export default function FamiliesAdmin() {
  const [families, setFamilies] = useState([])
  const [name, setName] = useState('')
  const [bankTotal, setBankTotal] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editBank, setEditBank] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [nameFilter, setNameFilter] = useState('')
  const [minTotal, setMinTotal] = useState('')
  const [maxTotal, setMaxTotal] = useState('')

  const fetchFamilies = () => {
    setLoading(true)
    fetch('/families/')
      .then((r) => r.json())
      .then((j) => setFamilies(j.data || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchFamilies()
  }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      const res = await fetch('/families/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, bank_total: Number(bankTotal) || 0 })
      })
      if (!res.ok) {
        const txt = await res.text().catch(() => null)
        throw new Error(txt || `Failed to add family (${res.status})`)
      }
      const json = await res.json()
      setFamilies(json.data || [])
      setName('')
      setBankTotal('')
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/families/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const txt = await res.text().catch(() => null)
        throw new Error(txt || `Failed to delete (${res.status})`)
      }
      const json = await res.json()
      setFamilies(json.data || [])
    } catch (err) {
      setError(err.message)
    }
  }

  const startEdit = (f) => {
    setEditingId(f.id)
    setEditName(f.name || '')
    setEditBank(f.bank_total || '')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditName('')
    setEditBank('')
  }

  const saveEdit = async (id) => {
    try {
      const res = await fetch(`/families/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName, bank_total: Number(editBank) || 0 })
      })
      if (!res.ok) {
        const txt = await res.text().catch(() => null)
        throw new Error(txt || `Failed to save (${res.status})`)
      }
      const json = await res.json()
      setFamilies(json.data || [])
      cancelEdit()
    } catch (err) {
      setError(err.message)
    }
  }

  const filtered = families.filter((f) => {
    if (nameFilter && !f.name.toLowerCase().includes(nameFilter.toLowerCase())) return false
    const total = Number(f.bank_total || 0)
    if (minTotal !== '' && !isNaN(minTotal) && total < Number(minTotal)) return false
    if (maxTotal !== '' && !isNaN(maxTotal) && total > Number(maxTotal)) return false
    return true
  })

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin — Families</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleAdd} style={{ marginBottom: 20 }}>
        <div>
          <label>Name</label><br />
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label>Bank total</label><br />
          <input type="number" value={bankTotal} onChange={(e) => setBankTotal(e.target.value)} />
        </div>
        <button type="submit">Add Family</button>
      </form>

      <section style={{ marginBottom: 20 }}>
        <h3>Filter</h3>
        <input placeholder="Name contains" value={nameFilter} onChange={(e) => setNameFilter(e.target.value)} />
        <input placeholder="Min total" type="number" value={minTotal} onChange={(e) => setMinTotal(e.target.value)} style={{ marginLeft: 8 }} />
        <input placeholder="Max total" type="number" value={maxTotal} onChange={(e) => setMaxTotal(e.target.value)} style={{ marginLeft: 8 }} />
        <button onClick={() => { setNameFilter(''); setMinTotal(''); setMaxTotal('') }} style={{ marginLeft: 8 }}>Clear</button>
      </section>

      {loading && <p>Loading families...</p>}
      {!loading && (
        <ul>
          {filtered.map((f) => (
            <li key={f.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                {editingId === f.id ? (
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input value={editName} onChange={(e) => setEditName(e.target.value)} />
                    <input value={editBank} onChange={(e) => setEditBank(e.target.value)} placeholder="bank total" type="number" />
                  </div>
                ) : (
                  <div>{f.name} — ${f.bank_total}</div>
                )}
              </div>
              <div>
                {editingId === f.id ? (
                  <>
                    <button onClick={() => saveEdit(f.id)}>Save</button>
                    <button onClick={cancelEdit} style={{ marginLeft: 8 }}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(f)}>Edit</button>
                    <button onClick={() => handleDelete(f.id)} style={{ marginLeft: 8 }}>Delete</button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
