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

    // Keep selected person synced when the people list updates (handles flags set before page load)
    useEffect(() => {
        if (!selectedPersonId) return
        const updated = people.find(p => p.id === parseInt(selectedPersonId))
        if (updated) {
            setSelectedPerson(updated)
            setOnLeaveChecked(Boolean(updated.OnLeave ?? updated.on_leave ?? false))
            setFiredChecked(Boolean(updated.Fired ?? updated.fired ?? false))
        }
    }, [people, selectedPersonId])

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

        // support both capitalized and snake_case fields returned by the API
        setOnLeaveChecked(Boolean(p?.OnLeave ?? p?.on_leave ?? false))
        setFiredChecked(Boolean(p?.Fired ?? p?.fired ?? false))

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

    // Return true for a variety of stored values (1, '1', true)
    const isWeekPaid = (person, week) => {
        if (!person) return false
        const candidates = [
            `week${week}_paid`,
            `week${week}paid`,
            `week${week}Paid`,
            `Week${week}Paid`
        ]
        for (const key of candidates) {
            if (typeof person[key] !== 'undefined' && person[key] !== null) {
                const v = person[key]
                if (v === 1 || v === '1' || v === true) return true
                // numeric-like strings should be treated as numbers
                if (!Number.isNaN(Number(v)) && Number(v) === 1) return true
            }
        }
        return false
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
                    status: 'OnLeave',
                    value: checked ? 1 : 0
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
                    status: 'Fired',
                    value: checked ? 1 : 0
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
            return { disabled: true, text: 'Pay' }
        }

        // Support multiple property namings returned by the API
        const isFired = Boolean(selectedPerson.Fired ?? selectedPerson.fired ?? firedChecked)
        const isOnLeave = Boolean(selectedPerson.OnLeave ?? selectedPerson.on_leave ?? onLeaveChecked)

        if (isFired) {
            return { disabled: true, text: 'FIRED' }
        }

        if (isOnLeave) {
            return { disabled: true, text: 'ON LEAVE' }
        }

        if (isWeekPaid(selectedPerson, selectedWeek)) {
            return { disabled: true, text: 'PAID' }
        }

        if (processing) {
            return { disabled: true, text: 'Processing...' }
        }

        return { disabled: false, text: 'Pay' }
    }

    const buttonState = getButtonState()

    return (
        <div style={{ padding: 20 }} className="container">
            <h1>General Employer</h1>

            <div style={{ maxWidth: 450, margin: "0 auto" }} className="centered" id="section">
                <label style={{ fontWeight: 'bold', marginRight: 10 }}>Select Employee</label>
                <select
                    value={selectedPersonId}
                    onChange={handlePersonSelect}
                    style={{ padding: '8px 12px', fontSize: '16px', minWidth: '250px', borderRadius: '8px' }}
                >
                    <option value="">-- Select Employee --</option>
                    {familyPeople.map(person => (
                        <option key={person.id} value={person.id}>
                            {person.first_name} {person.last_name}
                        </option>
                    ))}
                </select>
            </div>

            <br></br>

            {error && <p style={{ color: 'red' }}>{error}</p>}


            {selectedPerson && selectedFamily && (
                <div id='section'>
                    <div>
                        <h2>{selectedFamily.name}</h2>
                        <p style={{ marginBottom: '20px', paddingBottom: '15px', borderBottom: '1px solid #eee' }}><strong>Bank Balance:</strong> ${(selectedFamily.bank_total || 0).toFixed(2)}</p>
                    </div>

                    <div className="row">
                        <div className="col-md-8">
                            <div>
                                <label style={{ fontWeight: 'bold', marginRight: 10 }}>Week:</label>
                                <select
                                    value={selectedWeek}
                                    onChange={handleWeekSelect}
                                    style={{ padding: '8px 12px', fontSize: '16px', minWidth: '250px', borderRadius: '8px' }}
                                >
                                    <option value="1">Week 1</option>
                                    <option value="2">Week 2</option>
                                    <option value="3">Week 3</option>
                                    <option value="4">Week 4</option>
                                </select>
                            </div>
                            <br></br>

                            {selectedPerson && (
                                <div style={{ marginBottom: 20 }}>
                                    <p><strong>Week {selectedWeek} Pay:</strong> ${getWeekPay(selectedPerson, selectedWeek).toFixed(2)}</p>
                                </div>
                            )}

                            <div className="row">

                                <div className="col-auto">
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={onLeaveChecked}
                                            onChange={handleOnLeaveChange}
                                            disabled={!selectedPerson}
                                            style={{ marginRight: '8px' }}
                                        />
                                        On Leave
                                    </label>

                                </div>

                                <div className="col-auto">
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={firedChecked}
                                            onChange={handleFiredChange}
                                            disabled={!selectedPerson}
                                            style={{ marginRight: '8px' }}
                                        />
                                        Fired
                                    </label>
                                </div>
                            </div>

                            <br></br>
                            <div >
                                <button
                                    onClick={handlePayment}
                                    disabled={buttonState.disabled}
                                >
                                    {buttonState.text}
                                </button>
                            </div>

                        </div>
                        <div className="col-md-4">
                            <br></br>
                            <p id="helptext">*Employees that are on leave <u>do not get paid</u> for the weeks they are absent. Employees who are fired do not get paid for the rest of the simulation, unless they are re-hired.
                                <br></br><br></br>
                                *Any and all new hires, regardless of bank account status, are paid using <u>paper checks</u>.
                                <br></br><br></br>
                                *Do <u>NOT</u> pay an employee until they have clocked out for the week.
                            </p>
                        </div>

                    </div>
                </div>
            )}
        </div>
    )
}