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
                setError(null)
            } catch (e) {
                setError(e.message)
            } finally {
                setLoading(false)
            }
        }

        fetchFamilies()
    }, [])

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

    const handlePersonSelect = (e) => {
        const id = e.target.value
        setSelectedPersonId(id)
        const p = people.find(pp => pp.id === parseInt(id))
        setSelectedPerson(p || null)
        setOnLeaveChecked(p?.on_leave ?? false)
        setFiredChecked(p?.fired ?? false)

        // Auto-select family based on person's last_name
        if (p) {
            const family = families.find(f => f.name === p.last_name)
            if (family) {
                setSelectedFamilyId(family.id.toString())
                setSelectedFamily(family)
            } else {
                setSelectedFamilyId('')
                setSelectedFamily(null)
            }
        } else {
            setSelectedFamilyId('')
            setSelectedFamily(null)
        }
    }

    const handleWeekSelect = (e) => setSelectedWeek(e.target.value)

    const getWeekPay = (person, week) => {
        if (!person) return 0
        const keys = [`Week${week}Pay`, `week${week}Pay`, `week_${week}_pay`]
        for (const k of keys) {
            if (k in person && person[k] != null) return Number(person[k]) || 0
        }
        return 0
    }

    const isWeekPaid = (person, week) => {
        if (!person) return false
        const paidField = `week${week}_paid`
        return person[paidField] === 1
    }

    const handleOnLeaveChange = async (e) => {
        const checked = e.target.checked
        setOnLeaveChecked(checked)
        if (!selectedPerson) return

        try {
            const res = await fetch(`/people/${selectedPerson.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...selectedPerson,
                    on_leave: checked ? 1 : 0
                })
            })
            if (!res.ok) throw new Error('Update failed')

            const updatedPerson = { ...selectedPerson, on_leave: checked ? 1 : 0 }
            setSelectedPerson(updatedPerson)

            // Update in people array
            setPeople(people.map(p => p.id === updatedPerson.id ? updatedPerson : p))
            setError(null)
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
                body: JSON.stringify({
                    ...selectedPerson,
                    fired: checked ? 1 : 0
                })
            })
            if (!res.ok) throw new Error('Update failed')

            const updatedPerson = { ...selectedPerson, fired: checked ? 1 : 0 }
            setSelectedPerson(updatedPerson)

            // Update in people array
            setPeople(people.map(p => p.id === updatedPerson.id ? updatedPerson : p))
            setError(null)
        } catch (e) {
            setError(e.message)
        }
    }

    const handlePayment = async () => {
        setError(null)
        if (!selectedFamily) {
            setError('Select a family')
            return
        }
        if (!selectedPerson) {
            setError('Select a person')
            return
        }

        const fired = selectedPerson.fired ? true : false
        const onLeave = selectedPerson.on_leave ? true : false

        if (fired) {
            setError('Cannot deposit - person has been fired')
            return
        }
        if (onLeave) {
            setError('Cannot deposit - person is on leave')
            return
        }

        const weekPaid = isWeekPaid(selectedPerson, selectedWeek)
        if (weekPaid) {
            setError('This week has already been paid')
            return
        }

        const amount = getWeekPay(selectedPerson, selectedWeek)
        if (!amount) {
            setError('No pay for selected week')
            return
        }

        setProcessing(true)
        try {
            // Update family bank total
            const familyRes = await fetch(`/families/${selectedFamily.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...selectedFamily,
                    bank_total: (selectedFamily.bank_total || 0) + amount
                })
            })
            if (!familyRes.ok) throw new Error('Family update failed')

            // Mark week as paid for person
            const paidField = `week${selectedWeek}_paid`
            const personRes = await fetch(`/people/${selectedPerson.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...selectedPerson,
                    [paidField]: 1
                })
            })
            if (!personRes.ok) throw new Error('Person update failed')

            // Update local state
            const updatedFamily = { ...selectedFamily, bank_total: (selectedFamily.bank_total || 0) + amount }
            const updatedPerson = { ...selectedPerson, [paidField]: 1 }

            setSelectedFamily(updatedFamily)
            setSelectedPerson(updatedPerson)
            setPeople(people.map(p => p.id === updatedPerson.id ? updatedPerson : p))

            setError(null)
        } catch (e) {
            setError(e.message)
        } finally {
            setProcessing(false)
        }
    }

    if (loading) return <div style={{ padding: 20 }}>Loading...</div>

    const familyPeople = people.filter(p => p.Week1Pay > 100)

    // Determine button state and text
    const getButtonState = () => {
        if (!selectedPerson) {
            return { disabled: true, text: 'Paycheck' }
        }

        if (selectedPerson.fired) {
            return { disabled: true, text: 'FIRED' }
        }

        if (selectedPerson.on_leave) {
            return { disabled: true, text: 'ON LEAVE' }
        }

        if (isWeekPaid(selectedPerson, selectedWeek)) {
            return { disabled: true, text: 'PAID' }
        }

        if (processing) {
            return { disabled: true, text: 'Processing...' }
        }

        return { disabled: false, text: 'Paycheck' }
    }

    const buttonState = getButtonState()

    return (
        <div style={{ padding: 20 }}>
            <h1>General Employer</h1>
            <div className="container">
                <div className="row">
                    {error && <p style={{ color: 'red' }}>{error}</p>}

                    <div style={{ marginBottom: 30, border: '1px solid #ccc', padding: 20 }}>
                        <label style={{ fontWeight: 'bold', marginRight: 10 }}>Name</label>
                        <select
                            value={selectedPersonId}
                            onChange={handlePersonSelect}
                            style={{ padding: '8px 12px', fontSize: '16px', minWidth: '250px', color: '#333' }}
                        >
                            <option value="">-- Select Employee --</option>
                            {familyPeople.map(person => (
                                <option key={person.id} value={person.id}>
                                    {person.first_name} {person.last_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedPerson && selectedFamily && (
                        <div style={{ marginBottom: 20 }}>
                            <p><strong>Family:</strong> {selectedFamily.name}</p>
                            <p><strong>Bank Balance:</strong> ${(selectedFamily.bank_total || 0).toFixed(2)}</p>
                        </div>
                    )}

                    <div style={{ marginBottom: 30, border: '1px solid #ccc', padding: 20 }}>
                        <label style={{ fontWeight: 'bold', marginRight: 10 }}>Week:</label>
                        <select
                            value={selectedWeek}
                            onChange={handleWeekSelect}
                            style={{ padding: '8px 12px', fontSize: '16px', minWidth: '250px', color: '#333' }}
                        >
                            <option value="1">Week 1</option>
                            <option value="2">Week 2</option>
                            <option value="3">Week 3</option>
                            <option value="4">Week 4</option>
                        </select>
                    </div>

                    {selectedPerson && (
                        <div style={{ marginBottom: 20 }}>
                            <p><strong>Week {selectedWeek} Pay:</strong> ${getWeekPay(selectedPerson, selectedWeek).toFixed(2)}</p>
                        </div>
                    )}

                    <div className="col-2">
                        <p>On Leave</p>
                        <input
                            type="checkbox"
                            checked={onLeaveChecked}
                            onChange={handleOnLeaveChange}
                            disabled={!selectedPerson}
                        />
                    </div>

                    <div className="col-2">
                        <p>Fired</p>
                        <input
                            type="checkbox"
                            checked={firedChecked}
                            onChange={handleFiredChange}
                            disabled={!selectedPerson}
                        />
                    </div>

                    <div className="col-2" style={{ marginTop: 30 }}>
                        <button
                            onClick={handlePayment}
                            disabled={buttonState.disabled}
                        >
                            {buttonState.text}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}