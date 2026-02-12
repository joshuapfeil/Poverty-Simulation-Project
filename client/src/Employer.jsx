import React, { useEffect, useState } from 'react'
import useFamilies from './useFamilies'

export default function Employer() {
    const { families, loading: familiesLoading, error: familiesError, updateFamily } = useFamilies()
    const [people, setPeople] = useState([])
    const [selectedFamilyId, setSelectedFamilyId] = useState('')
    const [selectedFamily, setSelectedFamily] = useState(null)
    const [selectedPersonId, setSelectedPersonId] = useState('')
    const [selectedPerson, setSelectedPerson] = useState(null)
    const [selectedWeek, setSelectedWeek] = useState('1')
    const [onLeaveChecked, setOnLeaveChecked] = useState(false)
    const [firedChecked, setFiredChecked] = useState(false)
    const [processing, setProcessing] = useState(false)

    const [error, setError] = useState(null)

    useEffect(() => {
        if (familiesError) setError(familiesError)
    }, [familiesError])

    // Sync selected family when families list updates (live updates)
    useEffect(() => {
        if (selectedFamilyId) {
            const updated = families.find(f => f.id === parseInt(selectedFamilyId))
            if (updated) setSelectedFamily(updated)
        }
    }, [families, selectedFamilyId])

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
            const res = await fetch('/api/transactions/set-status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    person_id: selectedPerson.id,
                    status: 'on_leave',
                    value: checked
                })
            })
            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.message || 'Update failed')
            }

            const json = await res.json()
            const updatedPerson = json.data
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
            const res = await fetch('/api/transactions/set-status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    person_id: selectedPerson.id,
                    status: 'fired',
                    value: checked
                })
            })
            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.message || 'Update failed')
            }

            const json = await res.json()
            const updatedPerson = json.data
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

        const amount = getWeekPay(selectedPerson, selectedWeek)
        if (!amount) {
            setError('No pay for selected week')
            return
        }

        setProcessing(true)
        try {
            const res = await fetch('/api/transactions/pay-employee', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    family_id: selectedFamily.id,
                    person_id: selectedPerson.id,
                    week: Number(selectedWeek),
                    amount: amount
                })
            })

            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.message || 'Payment failed')
            }

            const json = await res.json()
            const { family: updatedFamily, person: updatedPerson } = json.data

            setSelectedFamily(updatedFamily)
            setSelectedPerson(updatedPerson)
            setPeople(people.map(p => p.id === updatedPerson.id ? updatedPerson : p))
            updateFamily(updatedFamily)

            setError(null)
        } catch (e) {
            setError(e.message)
        } finally {
            setProcessing(false)
        }
    }

    if (familiesLoading) return <div style={{ padding: 20 }}>Loading...</div>

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