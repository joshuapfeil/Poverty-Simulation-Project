//Supercenter sells groceries, clothing, misc, and prescriptions. They also hire teens/young adults for part-time work

//Part-time work will be entirely handled cash-only.

//Food, clothing, misc, and prescriptions must be paid IN FULL. Boxes only allow editing because of Luck of the Draw scenarios, where money might be added/subtracted from this total. The fields should be autopopulated with that family's regular amount. When the amount is paid, the box should gray out, and it should say 'paid.'

//Families that don't have prescription, misc., or clothes payments should have nothing return in those columns.

import React, { useEffect, useState } from 'react'

export default function SuperCenter() {
    const [families, setFamilies] = useState([])
    const [selectedFamilyId, setSelectedFamilyId] = useState('')
    const [selectedFamily, setSelectedFamily] = useState(null)
    const [selectedWeek, setSelectedWeek] = useState('1')
    const [foodPayment, setFoodPayment] = useState('')
    const [clothingPayment, setClothingPayment] = useState('')
    const [miscPayment, setMiscPayment] = useState('')
    const [prescriptionsPayment, setPrescriptionsPayment] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Fetch families on mount
    useEffect(() => {
        const fetchFamilies = () => {
            setLoading(true)
            fetch('/families/')
                .then((r) => r.json())

                //Polling Reload 
                .then((j) => {
                    setFamilies(j.data || [])
                    if (selectedFamilyId) {
                        const updated = (j.data || []).find(f => f.id === parseInt(selectedFamilyId))
                        if (updated) {
                            setSelectedFamily(updated)
                        }
                    }
                })
                .catch((e) => setError(e.message))
                .finally(() => setLoading(false))
        }

        fetchFamilies()

        const interval = setInterval(fetchFamilies, 10000) // Polling Rate in Milliseconds
        return () => clearInterval(interval)
    }, [selectedFamilyId])

    // When a family is selected, populate the payment amounts
    const handleFamilySelect = (e) => {
        const familyId = e.target.value
        setSelectedFamilyId(familyId)

        if (familyId) {
            const family = families.find(f => f.id === parseInt(familyId))
            setSelectedFamily(family)
            setFoodPayment(family?.food_weekly || 0)
            setClothingPayment(family?.clothing || 0)
            setMiscPayment(family?.misc || 0)
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
                billType === 'misc' ? Number(miscPayment) :
                    Number(prescriptionsPayment)

        if (!amount || amount <= 0) {
            setError('Please enter a valid amount')
            return
        }

        try {
            // Build request body
            const body = {
                family_id: selectedFamily.id,
                bill_type: billType === 'misc' ? 'quikCash' : billType,
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

            if (billType === 'food') setFoodPayment(updatedFamily?.food_weekly || 0)
            if (billType === 'clothing') setClothingPayment('')
            if (billType === 'misc') setMiscPayment('')
            if (billType === 'prescriptions') setPrescriptionsPayment('')

            setError(null)
        } catch (err) {
            setError(err.message)
        }
    }

    if (loading) {
        return <div style={{ padding: 20 }}>Loading SuperCenter...</div>
    }

    // Check if current week is paid
    const weekField = `food_week${selectedWeek}_paid`
    const isWeekPaid = selectedFamily?.[weekField] === 1

    return (
        <div style={{ padding: 20 }} className="container">
            <h1>Food-A-Rama SuperCenter</h1>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div style={{ marginBottom: 30, border: '1px solid #ccc', padding: 20, backgroundColor: '#f9f9f9' }}>
                <label style={{ fontWeight: 'bold', marginRight: 10 }}>Select Family:</label>
                <select
                    value={selectedFamilyId}
                    onChange={handleFamilySelect}
                    style={{ padding: '8px 12px', fontSize: '16px', minWidth: '250px', color: '#333' }}
                >
                    <option value="">-- Choose a family --</option>
                    {families.map(family => (
                        <option key={family.id} value={family.id}>
                            {family.name}
                        </option>
                    ))}
                </select>
            </div>

            {selectedFamily && (
                <div>
                    <h2>{selectedFamily.name}</h2>
                    <p>Bank Balance: ${(selectedFamily.bank_total || 0).toFixed(2)}</p>

                    <div style={{ marginBottom: 20, border: '1px solid #ccc', padding: 20, backgroundColor: '#f0f0f0' }}>
                        <label style={{ fontWeight: 'bold', marginRight: 10 }}>Select Week:</label>
                        <select
                            value={selectedWeek}
                            onChange={handleWeekSelect}
                            style={{ padding: '8px 12px', fontSize: '16px', minWidth: '150px', color: '#333' }}
                        >
                            <option value="1">Week 1</option>
                            <option value="2">Week 2</option>
                            <option value="3">Week 3</option>
                            <option value="4">Week 4</option>
                        </select>
                    </div>

                    <div>
                        <div>
                            <h4>Food - Week {selectedWeek}</h4>
                            <p>
                                ${(selectedFamily.food_weekly || 0).toFixed(2)}
                            </p>
                            <input
                                type="number"
                                value={foodPayment}
                                onChange={(e) => setFoodPayment(e.target.value)}
                                disabled={isWeekPaid}
                            />
                            <button
                                onClick={() => handlePayment('food')}
                                disabled={isWeekPaid}
                            >
                                {isWeekPaid ? 'PAID' : 'PAY'}
                            </button>
                        </div>

                        {selectedFamily.clothing > 0 && (
                            <div>
                                <h4>Clothing</h4>
                                <p>
                                    ${(selectedFamily.clothing || 0).toFixed(2)}
                                </p>
                                <input
                                    type="number"
                                    value={clothingPayment}
                                    onChange={(e) => setClothingPayment(e.target.value)}
                                    disabled={selectedFamily.clothing === 0 || selectedFamily.clothing === null}
                                />
                                <button
                                    onClick={() => handlePayment('clothing')}
                                    disabled={selectedFamily.clothing === 0 || selectedFamily.clothing === null}
                                >
                                    {selectedFamily.clothing === 0 ? 'PAID' : 'PAY'}
                                </button>
                            </div>
                        )}

                        {selectedFamily.misc > 0 && (
                            <div>
                                <h4>Miscellaneous</h4>
                                <p>
                                    ${(selectedFamily.misc || 0).toFixed(2)}
                                </p>
                                <input
                                    type="number"
                                    value={miscPayment}
                                    onChange={(e) => setMiscPayment(e.target.value)}
                                    disabled={selectedFamily.misc === 0 || selectedFamily.misc === null}
                                />
                                <button
                                    onClick={() => handlePayment('misc')}
                                    disabled={selectedFamily.misc === 0 || selectedFamily.misc === null}
                                >
                                    {selectedFamily.misc === 0 ? 'PAID' : 'PAY'}
                                </button>
                            </div>
                        )}

                        {selectedFamily.prescriptions > 0 && (
                            <div>
                                <h4>Prescriptions</h4>
                                <p>
                                    ${(selectedFamily.prescriptions || 0).toFixed(2)}
                                </p>
                                <input
                                    type="number"
                                    value={prescriptionsPayment}
                                    onChange={(e) => setPrescriptionsPayment(e.target.value)}
                                    disabled={selectedFamily.prescriptions === 0 || selectedFamily.prescriptions === null}
                                />
                                <button
                                    onClick={() => handlePayment('prescriptions')}
                                    disabled={selectedFamily.prescriptions === 0 || selectedFamily.prescriptions === null}
                                >
                                    {selectedFamily.prescriptions === 0 ? 'PAID' : 'PAY'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}