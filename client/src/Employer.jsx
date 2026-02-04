import React, { useEffect, useState } from 'react'

export default function Employer() {
    const [families, setFamilies] = useState([])
    const [people, setPeople] = useState([])
    const [selectedFamilyId, setSelectedFamilyId] = useState('')
    const [selectedFamily, setSelectedFamily] = useState(null)
    const [selectedPersonId, setSelectedPersonId] = useState('')
    const [selectedPerson, setSelectedPerson] = useState(null)
    const [selectedWeek, setSelectedWeek] = useState('1')
    const [onLeaveChecked, setOnLeaveChecked] = useState(false)
    const [firedChecked, setFiredChecked] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [processing, setProcessing] = useState(false)

    useEffect(() => {
        const fetchFamilies = async () => {
            setLoading(true)
            try {
                const res = await fetch('/families/')
                if (!res.ok) throw new Error(`Families fetch failed (${res.status})`)
                const j = await res.json()
                setFamilies(j.data || [])
                if (selectedFamilyId) {
                    const updated = (j.data || []).find(f => f.id === parseInt(selectedFamilyId))
                    if (updated) setSelectedFamily(updated)
                }
                setError(null)
            } catch (e) {
                setError(e.message)
            } finally {
                setLoading(false)
            }
        }

        fetchFamilies()
    }, [selectedFamilyId])

    useEffect(() => {
        const fetchPeople = async () => {
            try {
                const res = await fetch('/people/')
                if (!res.ok) throw new Error(`People fetch failed (${res.status})`)
                const j = await res.json()
                setPeople(j.data || [])
            } catch (e) {
                setError(e.message)
            }
        }

        fetchPeople()
    }, [])

    const handleFamilySelect = (e) => {
        const id = e.target.value
        setSelectedFamilyId(id)
        if (!id) {
            setSelectedFamily(null)
            setSelectedPersonId('')
            setSelectedPerson(null)
        }
    }

    const handlePersonSelect = (e) => {
        const id = e.target.value
        setSelectedPersonId(id)
        const p = people.find(pp => pp.id === parseInt(id))
        setSelectedPerson(p || null)
        setOnLeaveChecked(p?.on_leave ?? false)
        setFiredChecked(p?.fired ?? false)
    }

    const handleWeekSelect = (e) => setSelectedWeek(e.target.value)

    const getWeekPay = (person, week) => {
        if (!person) return 0
        const keys = [`week${week}Pay`, `Week${week}Pay`, `week_${week}_pay`]
        for (const k of keys) {
            if (k in person && person[k] != null) return Number(person[k]) || 0
        }
        return 0
    }


    const handleOnLeaveChange = async (e) => {
        const checked = e.target.checked
        setOnLeaveChecked(checked)
        if (!selectedPerson) return
        try {
            const res = await fetch(`/people/${selectedPerson.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ on_leave: checked ? 1 : 0 })
            })
            if (!res.ok) throw new Error('Update failed')
            setSelectedPerson({ ...selectedPerson, on_leave: checked ? 1 : 0 })
        } catch (e) {
            setError(e.message)
        }
    }

    const handleFiredChange = async (e) => {
        const checked = e.target.checked
        setFiredChecked(checked)
        if (!selectedPerson) return
        try {
            const res = await fetch(`/people/${selectedPerson.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fired: checked ? 1 : 0 })
            })
            if (!res.ok) throw new Error('Update failed')
            setSelectedPerson({ ...selectedPerson, fired: checked ? 1 : 0 })
        } catch (e) {
            setError(e.message)
        }
    }

    const handlePayment = async () => {
        setError(null)
        if (!selectedFamily) { setError('Select a family'); return }
        if (!selectedPerson) { setError('Select a person'); return }

        const fired = selectedPerson.fired ? true : false
        const onLeave = selectedPerson.on_leave ? true : false
        if (fired) { setError('Cannot deposit - person has been fired'); return }
        if (onLeave) { setError('Cannot deposit - person is on leave'); return }

        const amount = getWeekPay(selectedPerson, selectedWeek)
        if (!amount) { setError('No pay for selected week'); return }

        setProcessing(true)
        try {
            const res = await fetch(`/families/${selectedFamily.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bank_total: (selectedFamily.bank_total || 0) + amount })
            })
            if (!res.ok) throw new Error('Update failed')
            setSelectedFamily({ ...selectedFamily, bank_total: (selectedFamily.bank_total || 0) + amount })
        } catch (e) {
            setError(e.message)
        } finally {
            setProcessing(false)
        }
    }

    if (loading) return <div>Loading...</div>

    const familyPeople = people.filter(p => p.Week1Pay > 100)

    return (
        <div style={{ padding: 20 }}>
            <h1>General Employer</h1>
            <div className="container">
                <div className="row">
                    {error && <p style={{ color: 'red' }}>{error}</p>}

                    {/* <div style={{ marginBottom: 30, border: '1px solid #ccc', padding: 20 }}>
                        <label style={{ fontWeight: 'bold', marginRight: 10 }}>Last Name</label>
                        <select value={selectedFamilyId} onChange={handleFamilySelect} style={{ padding: '8px 12px', fontSize: '16px', minWidth: '250px', color: '#333' }}>
                            <option value="">Last Name</option>
                            {families.map(family => (
                                <option key={family.id} value={family.id}>{family.name}</option>
                            ))}
                        </select>
                    </div> */}

                    <div style={{ marginBottom: 30, border: '1px solid #ccc', padding: 20 }}>
                        <label style={{ fontWeight: 'bold', marginRight: 10 }}>Name</label>
                        <select value={selectedPersonId} onChange={handlePersonSelect} style={{ padding: '8px 12px', fontSize: '16px', minWidth: '250px', color: '#333' }}>
                            <option value="">Name</option>
                            {familyPeople.map(person => (
                                <option key={person.id} value={person.id}>{person.first_name} {person.last_name}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ marginBottom: 30, border: '1px solid #ccc', padding: 20 }}>
                        <label style={{ fontWeight: 'bold', marginRight: 10 }}>Week:</label>
                        <select value={selectedWeek} onChange={handleWeekSelect} style={{ padding: '8px 12px', fontSize: '16px', minWidth: '250px', color: '#333' }}>
                            <option value="1">Week 1</option>
                            <option value="2">Week 2</option>
                            <option value="3">Week 3</option>
                            <option value="4">Week 4</option>
                        </select>
                    </div>

                    <div className="col-2">
                        <p>On Leave</p>
                        <input type="checkbox" checked={onLeaveChecked} onChange={handleOnLeaveChange}></input>
                    </div>

                    <div className="col-2">
                        <p>Fired</p>
                        <input type="checkbox" checked={firedChecked} onChange={handleFiredChange}></input>
                    </div>

                    <div className="col-2" style={{ marginTop: 30 }}>
                        <button onClick={handlePayment} disabled={processing}>{processing ? 'Processing...' : 'Paycheck'}</button>
                    </div>
                </div>
            </div>
        </div>
    )
}