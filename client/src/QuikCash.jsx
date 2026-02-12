//The bank is in charge of depositing checks and cash, withdrawing money, collecting loan amounts due, and credit card payments.

import React, { useEffect, useState } from 'react'
import useFamilies from './useFamilies'

export default function QuikCash() {
    const [selectedFamilyId, setSelectedFamilyId] = useState('')
    const [selectedFamily, setSelectedFamily] = useState(null)

    const [withdrawAmount, setWithdrawAmount] = useState('')

    const { families, loading: familiesLoading, error: familiesError, updateFamily } = useFamilies()
    const [error, setError] = useState(null)

    useEffect(() => {
        if (familiesError) setError(familiesError)
    }, [familiesError])

    // Keep selectedFamily in sync when families update
    useEffect(() => {
        if (selectedFamilyId) {
            const updated = families.find(f => f.id === parseInt(selectedFamilyId))
            if (updated) setSelectedFamily(updated)
        }
    }, [families, selectedFamilyId])

    // When a family is selected, populate the amounts
    const handleFamilySelect = (e) => {
        const familyId = e.target.value
        setSelectedFamilyId(familyId)

        if (familyId) {
            const family = families.find(f => f.id === parseInt(familyId))
            setSelectedFamily(family)

        } else {
            setSelectedFamily(null)

        }
    }

    const handlePayment = async (billType) => {
        if (!selectedFamily) {
            setError('Please select a family')
            return
        }

        const amount = billType === 'withdraw' ? Number(withdrawAmount) : 0

        if (!amount || amount <= 0) {
            setError('Please enter a valid amount')
            return
        }

        const currentBalance = Number(selectedFamily.bank_total || 0)

        // Validation: Check for overdraft (except deposits)
        if (billType == 'withdraw') {
            if (amount > currentBalance) {
                setError(`Insufficient funds. Available: $${currentBalance.toFixed(2)}, Required: $${amount.toFixed(2)}`)
                return
            }
        }

        

        try {
            const res = await fetch(`/families/${selectedFamily.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...selectedFamily,
                    bank_total: billType === 'deposit'
                        ? currentBalance + amount
                        : currentBalance - amount,
                })
            })

            if (!res.ok) {
                const txt = await res.text().catch(() => null)
                throw new Error(txt || `Failed to process payment (${res.status})`)
            }

            const json = await res.json()
            const updatedFamily = json.data?.find(f => f.id === selectedFamily.id)
            setSelectedFamily(updatedFamily)
            updateFamily(updatedFamily)

           

            
            if (billType === 'withdraw') setWithdrawAmount('')

            setError(null)
        } catch (err) {
            setError(err.message)
        }
    }

    if (familiesLoading) {
        return <div style={{ padding: 20 }}>Loading Bank...</div>
    }

    return (
        <div style={{ padding: 20 }} className='container'>
            <h1>QuikCash</h1>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div style={{ marginBottom: 30, border: '1px solid #ccc', padding: 20, backgroundColor: '#f9f9f9' }}>
                <label style={{ fontWeight: 'bold', marginRight: 10 }}>Select Family:</label>
                <select
                    value={selectedFamilyId}
                    onChange={handleFamilySelect}
                    style={{ padding: '8px 12px', fontSize: '16px', minWidth: '250px', color: '#333' }}>

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

                    <div>
                        

                        <div>
                            <h4>Travel Tickets</h4>
                            <input
                                type="number"
                                value={withdrawAmount}
                                onChange={(e) => setWithdrawAmount(e.target.value)}
                                placeholder="Enter amount"
                            />
                            <button onClick={() => handlePayment('withdraw')}>Withdraw</button>
                        </div>

                        
                    </div>
                </div>
            )}
        </div>
    )
}