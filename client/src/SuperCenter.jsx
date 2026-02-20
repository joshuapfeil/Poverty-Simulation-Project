//Supercenter sells groceries, clothing, misc, and prescriptions. They also hire teens/young adults for part-time work

//Part-time work will be entirely handled cash-only.

//Food, clothing, misc, and prescriptions must be paid IN FULL. Boxes only allow editing because of Luck of the Draw scenarios, where money might be added/subtracted from this total. The fields should be autopopulated with that family's regular amount. When the amount is paid, the box should gray out, and it should say 'paid.'

//Families that don't have prescription, misc., or clothes payments should have nothing return in those columns.

import React, { useEffect, useState } from 'react'
import useFamilies from './useFamilies'

export default function SuperCenter() {
    const [selectedFamilyId, setSelectedFamilyId] = useState('')
    const [selectedFamily, setSelectedFamily] = useState(null)
    const [selectedWeek, setSelectedWeek] = useState('1')
    const [foodPayment, setFoodPayment] = useState('')
    const [clothingPayment, setClothingPayment] = useState('')
    const [miscPayment, setMiscPayment] = useState('')
    const [prescriptionsPayment, setPrescriptionsPayment] = useState('')
    const { families, loading: familiesLoading, error: familiesError, updateFamily } = useFamilies()
    const [error, setError] = useState(null)

    useEffect(() => {
        if (familiesError) setError(familiesError)
    }, [familiesError])

    // Keep selected family in sync with live updates
    useEffect(() => {
        if (selectedFamilyId) {
            const updated = families.find(f => f.id === parseInt(selectedFamilyId))
            if (updated) setSelectedFamily(updated)
        }
    }, [families, selectedFamilyId])

    // When a family is selected, populate the payment amounts
    const handleFamilySelect = (e) => {
        const familyId = e.target.value
        setSelectedFamilyId(familyId)

        if (familyId) {
            const family = families.find(f => f.id === parseInt(familyId))
            setSelectedFamily(family)
            setFoodPayment(family?.food_weekly || 0)
            setClothingPayment(family?.clothing || 0)
            setMiscPayment(family?.misc_supercenter || 0)
            setPrescriptionsPayment(family?.prescriptions || 0)
        } else {
            setSelectedFamily(null)
            setFoodPayment('')
            setClothingPayment('')
            setMiscPayment('')
            setPrescriptionsPayment('')
        }
    }

    const handleWeekSelect = (e) => {
        setSelectedWeek(e.target.value)
    }

    const handlePayment = async (billType) => {
        if (!selectedFamily) {
            setError('Please select a family')
            return
        }

        const amount = billType === 'food' ? Number(foodPayment) :
            billType === 'clothing' ? Number(clothingPayment) :
                billType === 'misc_supercenter' ? Number(miscPayment) :
                    Number(prescriptionsPayment)

if (!amount || amount <= 0 || amount > 1000) {
            setError('Amount must be > 0 and ≤ 1000')
            return
        }

        try {
            // Build request body
            const body = {
                family_id: selectedFamily.id,
                bill_type: billType === 'misc_supercenter' ? 'quikCash' : billType,
                amount: amount
            }

            // Add week parameter for food payments
            if (billType === 'food') {
                body.week = Number(selectedWeek)
            }

            const res = await fetch('/api/transactions/pay-bill', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            })

            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.message || `Failed to process payment (${res.status})`)
            }

            const json = await res.json()
            const updatedFamily = json.data
            setSelectedFamily(updatedFamily)
            updateFamily(updatedFamily)

            if (billType === 'food') setFoodPayment(updatedFamily?.food_weekly || 0)
            if (billType === 'clothing') setClothingPayment('')
            if (billType === 'misc_supercenter') setMiscPayment('')
            if (billType === 'prescriptions') setPrescriptionsPayment('')

            setError(null)
        } catch (err) {
            setError(err.message)
        }
    }

    if (familiesLoading) {
        return <div style={{ padding: 20 }}>Loading Food-A-Rama Super Center...</div>
    }

    // Check if current week is paid
    const weekField = `food_week${selectedWeek}_paid`
    const isWeekPaid = selectedFamily?.[weekField] === 1

    return (
        <div style={{ padding: 20 }} className="container">
            <h1>Food-A-Rama SuperCenter</h1>

            <div style={{ maxWidth: 450, margin: "0 auto" }} className="centered" id="section">
                <label style={{ fontWeight: 'bold', marginRight: 10 }}>Select Family:</label>
                <select
                    value={selectedFamilyId}
                    onChange={handleFamilySelect}
                    style={{ padding: '8px 12px', fontSize: '16px', minWidth: '250px', borderRadius: '8px' }}
                >
                    <option value="">-- Choose a family --</option>
                    {families.map(family => (
                        <option key={family.id} value={family.id}>
                            {family.name}
                        </option>
                    ))}
                </select>
            </div>
            <br></br>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {selectedFamily && (
                <div id="section">
                    <h2>{selectedFamily.name}</h2>
                    <p style={{ marginBottom: '20px', paddingBottom: '15px', borderBottom: '1px solid #eee' }}><strong>Bank Balance:</strong> ${(selectedFamily.bank_total || 0).toFixed(2)}</p>

                    <div className="row">
                        <div className="col-md-8">


                            <div>
                                <label style={{ fontWeight: 'bold', marginRight: 10 }}>Select Week:</label>
                                <select
                                    value={selectedWeek}
                                    onChange={handleWeekSelect}
                                    style={{ padding: '8px 12px', fontSize: '16px', minWidth: '150px', borderRadius: '8px' }}
                                >
                                    <option value="1">Week 1</option>
                                    <option value="2">Week 2</option>
                                    <option value="3">Week 3</option>
                                    <option value="4">Week 4</option>
                                </select>
                            </div>

                            <br></br>

                            <div>
                                <div>
                                    <h4>Food - Week {selectedWeek}</h4>
                                    <p>
                                        Amount Owed: ${(selectedFamily.food_weekly || 0).toFixed(2)}
                                    </p>
                                    <input
                                        type="number"
                                        value={foodPayment}
                                        onChange={(e) => setFoodPayment(e.target.value)}
                                        disabled={isWeekPaid}
                                    />
                                    <button style={{ marginLeft: 10 }}
                                        onClick={() => handlePayment('food')}
                                        disabled={isWeekPaid}
                                    >
                                        {isWeekPaid ? 'PAID' : 'PAY'}
                                    </button>
                                    <br></br><br></br>
                                </div>

                                {selectedFamily.clothing > 0 && (
                                    <div>
                                        <h4>Clothing</h4>
                                        <p>
                                            Amount Owed: ${(selectedFamily.clothing || 0).toFixed(2)}
                                        </p>
                                        <input
                                            type="number"
                                            min="0.01"
                                            max="1000"
                                            step="0.01"
                                            value={clothingPayment}
                                            onChange={(e) => setClothingPayment(e.target.value)}
                                        />
                                        <button style={{ marginLeft: 10 }} onClick={() => handlePayment('clothing')}>
                                            PAY
                                        </button>
                                        <br></br><br></br>
                                    </div>
                                )}

                                {selectedFamily.misc_supercenter > 0 && (
                                    <div>
                                        <h4>Miscellaneous</h4>
                                        <p>
                                            ${(selectedFamily.misc_supercenter || 0).toFixed(2)}
                                        </p>
                                        <input
                                            type="number"                                            min="0.01"
                                            max="1000"
                                            step="0.01"                                            value={miscPayment}
                                            onChange={(e) => setMiscPayment(e.target.value)}
                                        />
                                        <button style={{ marginLeft: 10 }} onClick={() => handlePayment('misc')}>
                                            PAY
                                        </button>
                                        <br></br><br></br>
                                    </div>
                                )}

                                {selectedFamily.prescriptions > 0 && (
                                    <div>
                                        <h4>Fill Prescription</h4>
                                        <p>
                                            ${(selectedFamily.prescriptions || 0).toFixed(2)}
                                        </p>
                                        <input
                                            type="number"
                                            min="0.01"
                                            max="1000"
                                            step="0.01"
                                            value={prescriptionsPayment}
                                            onChange={(e) => setPrescriptionsPayment(e.target.value)}
                                        />
                                        <button style={{ marginLeft: 10 }} onClick={() => handlePayment('prescriptions')}>
                                            PAY
                                        </button>
                                        <br></br><br></br>
                                    </div>
                                )}

                            </div>
                        </div>
                        <div className="col-md-4">
                            <br></br>
                            <p id="helptext">*Do <u>NOT</u> make any payments without a family member present.
                            <br></br><br></br>
                            *If a family member gives you a prescription, fill it for $20.
                            <br></br><br></br>
                            *Your part-time employees are paid in <u>cash only</u>.</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}