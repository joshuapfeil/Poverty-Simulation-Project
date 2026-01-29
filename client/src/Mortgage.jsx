// Mortgage office takes mortgage payments from homeowners

import React, { useEffect, useState } from 'react'

export default function Mortgage() {
    const [families, setFamilies] = useState([])
    const [selectedFamilyId, setSelectedFamilyId] = useState('')
    const [selectedFamily, setSelectedFamily] = useState(null)
    const [mortgagePayment, setMortgagePayment] = useState('')
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
                    // Update selected family if it exists in the new data
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

        const interval = setInterval(fetchFamilies, 10000) // Polling Rate in Milliseconds ie 1000 = 1 second
        return () => clearInterval(interval)
    }, [selectedFamilyId])

    // When a family is selected, populate the mortgage amount
    const handleFamilySelect = (e) => {
        const familyId = e.target.value
        setSelectedFamilyId(familyId)

        if (familyId) {
            const family = families.find(f => f.id === parseInt(familyId))
            setSelectedFamily(family)
            setMortgagePayment(family?.housing_mortgage || 0)
        } else {
            setSelectedFamily(null)
            setMortgagePayment('')
        }
    }

    const handlePayment = async () => {
        if (!selectedFamily) {
            setError('Please select a family')
            return
        }

        const amount = Number(mortgagePayment)

        if (!amount || amount <= 0) {
            setError('Please enter a valid amount')
            return
        }

        const currentBalance = Number(selectedFamily.bank_total || 0)
        if (amount > currentBalance) {
            setError(`Insufficient funds. Available: $${currentBalance.toFixed(2)}, Required: $${amount.toFixed(2)}`)
            return
        }

        try {
            const res = await fetch(`/families/${selectedFamily.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...selectedFamily,
                    bank_total: currentBalance - amount,
                    housing_mortgage: Math.max(0, selectedFamily.housing_mortgage - amount)
                })
            })

            if (!res.ok) {
                const txt = await res.text().catch(() => null)
                throw new Error(txt || `Failed to process payment (${res.status})`)
            }

            const json = await res.json()
            const updatedFamily = json.data?.find(f => f.id === selectedFamily.id)
            setSelectedFamily(updatedFamily)
            setMortgagePayment('')
            setError(null)
        } catch (err) {
            setError(err.message)
        }
    }

    if (loading) {
        return <div style={{ padding: 20 }}>Loading Mortgage & Realty...</div>
    }

    // Filter to only show families with mortgages (homeowners)
    const homeowners = families.filter(f => f.housing_mortgage && f.housing_mortgage > 0)

    return (
        <div style={{ padding: 20 }} className="container">
            <h1>Sweaney Mortgage & Realty</h1>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div style={{ marginBottom: 30, border: '1px solid #ccc', padding: 20, backgroundColor: '#f9f9f9' }}>
                <label style={{ fontWeight: 'bold', marginRight: 10 }}>Select Family:</label>
                <select
                    value={selectedFamilyId}
                    onChange={handleFamilySelect}
                    style={{ padding: '8px 12px', fontSize: '16px', minWidth: '250px', color: '#333' }}
                >
                    <option value="">-- Choose a family --</option>
                    {homeowners.map(family => (
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

                    <div>
                        <div>
                            <h4>Mortgage Payment</h4>
                            <p>
                                ${(selectedFamily.housing_mortgage || 0).toFixed(2)}
                            </p>
                            <input
                                type="number"
                                value={mortgagePayment}
                                onChange={(e) => setMortgagePayment(e.target.value)}
                                disabled={selectedFamily.housing_mortgage === 0 || selectedFamily.housing_mortgage === null}
                            />
                            <button
                                onClick={handlePayment}
                                disabled={selectedFamily.housing_mortgage === 0 || selectedFamily.housing_mortgage === null}
                            >
                                {selectedFamily.housing_mortgage === 0 ? 'PAID' : 'PAY'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}