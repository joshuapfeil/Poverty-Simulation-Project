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



            <div style={{ maxWidth: 450, margin: "0 auto" }} className="centered" id="section">
                <label style={{ fontWeight: 'bold', marginRight: 10 }}>Select Family:</label>
                <select
                    value={selectedFamilyId}
                    onChange={handleFamilySelect}
                    style={{ padding: '8px 12px', fontSize: '16px', minWidth: '250px', borderRadius: '8px' }}>

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
                                <div>
                                    <h4>Buy Transportation Passes</h4>
                                    <input
                                        type="number"
                                        value={withdrawAmount}
                                        onChange={(e) => setWithdrawAmount(e.target.value)}
                                        placeholder="Enter amount"
                                    />
                                    <button style={{ marginLeft: 10 }}
                                        onClick={() => handlePayment('withdraw')}>Buy</button>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <br></br>
                            <p id="helptext">
                                *Each transportation pass is worth $1. There are <u>no</u> discounts or special deals.
                                <br></br><br></br>
                                *Families that wish to cash checks will receive their payment in <u>cash only</u>.
                                <br></br><br></br>
                                *Families that are granted a payday loan will receive that loan in <u>cash only</u>.
                            </p>
                        </div>
                    </div>

                </div>
            )}
        </div>
    )
}