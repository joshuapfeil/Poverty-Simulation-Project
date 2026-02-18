// Utility company collects gas, phone, and electric bills from families

import React, { useEffect, useState } from 'react'
import useFamilies from './useFamilies'

export default function Utility() {
    const [selectedFamilyId, setSelectedFamilyId] = useState('')
    const [selectedFamily, setSelectedFamily] = useState(null)
    const [gasPayment, setGasPayment] = useState('')
    const [phonePayment, setPhonePayment] = useState('')
    const [electricPayment, setElectricPayment] = useState('')
    const { families, loading: familiesLoading, error: familiesError, updateFamily } = useFamilies()
    const [error, setError] = useState(null)
    const [processingFee, setProcessingFee] = useState(false)

    useEffect(() => {
        if (familiesError) setError(familiesError)
    }, [familiesError])

    // Sync selectedFamily when families update
    useEffect(() => {
        if (selectedFamilyId) {
            const updated = families.find(f => f.id === parseInt(selectedFamilyId))
            if (updated) setSelectedFamily(updated)
        }
    }, [families, selectedFamilyId])

    // When a family is selected, populate the utility amounts
    const handleFamilySelect = (e) => {
        const familyId = e.target.value
        setSelectedFamilyId(familyId)

        if (familyId) {
            const family = families.find(f => f.id === parseInt(familyId))
            setSelectedFamily(family)
            setGasPayment(family?.utilities_gas || 0)
            setPhonePayment(family?.utilities_phone || 0)
            setElectricPayment(family?.utilities_electric || 0)
        } else {
            setSelectedFamily(null)
            setGasPayment('')
            setPhonePayment('')
            setElectricPayment('')
        }
    }

    const handlePayment = async (billType) => {
        if (!selectedFamily) {
            setError('Please select a family')
            return
        }

        const amount = billType === 'gas' ? Number(gasPayment) :
            billType === 'phone' ? Number(phonePayment) :
                Number(electricPayment)

        if (!amount || amount <= 0 || amount > 1000) {
            setError('Amount must be > 0 and ≤ 1000')
            return
        }

        try {
            const res = await fetch('/api/transactions/pay-bill', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    family_id: selectedFamily.id,
                    bill_type: billType,
                    amount: amount
                })
            })

            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.message || `Failed to process payment (${res.status})`)
            }

            const json = await res.json()
            const updatedFamily = json.data
            setSelectedFamily(updatedFamily)
            updateFamily(updatedFamily)

            if (billType === 'gas') setGasPayment('')
            if (billType === 'phone') setPhonePayment('')
            if (billType === 'electric') setElectricPayment('')

            setError(null)
        } catch (err) {
            setError(err.message)
        }
    }

    // Charge a fixed $50 utility service fee (withdraw from family's bank)
    const handleChargeFee = async () => {
        setError(null)
        if (!selectedFamily) {
            setError('Please select a family')
            return
        }
        const balance = Number(selectedFamily.bank_total || 0)
        if (balance < 50) {
            setError('Insufficient funds for $50 fee')
            return
        }

        setProcessingFee(true)
        try {
            const res = await fetch('/api/transactions/withdraw', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ family_id: selectedFamily.id, amount: 50 })
            })

            if (!res.ok) {
                const err = await res.json().catch(() => null)
                throw new Error(err?.message || `Failed to charge fee (${res.status})`)
            }

            const json = await res.json()
            const updatedFamily = json.data
            setSelectedFamily(updatedFamily)
            updateFamily(updatedFamily)
            setError(null)
        } catch (err) {
            setError(err.message)
        } finally {
            setProcessingFee(false)
        }
    }

    if (familiesLoading) {
        return <div style={{ padding: 20 }}>Loading Utilities...</div>
    }

    return (
        <div style={{ padding: 20 }} className="container">
            <h1>Friendly Utility Company</h1>


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

                    <div style={{ marginBottom: '10px' }}>
                        <button
                            onClick={handleChargeFee}
                            disabled={processingFee}
                            title={Number(selectedFamily.bank_total || 0) < 50 ? 'Clicking will show insufficient funds error' : ''}
                        >
                            {processingFee ? 'Processing...' : 'Charge $50 Fee'}
                        </button>
                    </div>

                    <div className="row">

                        <div className="col-md-8">
                            {selectedFamily.utilities_gas > 0 && (
                                <div>
                                    <h4>Gas Bill</h4>
                                    <p>
                                        Amount Owed: ${(selectedFamily.utilities_gas || 0).toFixed(2)}
                                    </p>
                                    <input
                                        type="number"
                                        min="0.01"
                                        max="1000"
                                        step="0.01"
                                        value={gasPayment}
                                        onChange={(e) => setGasPayment(e.target.value)}
                                    />
                                    <button style={{ marginLeft: 10 }} onClick={() => handlePayment('gas')}>
                                        PAY
                                    </button>
                                </div>
                            )}

                            {selectedFamily.utilities_phone > 0 && (
                                <div>
                                    <h4>Phone Bill</h4>
                                    <p>
                                        Amount Owed: ${(selectedFamily.utilities_phone || 0).toFixed(2)}
                                    </p>
                                    <input
                                        type="number"
                                        min="0.01"
                                        max="1000"
                                        step="0.01"
                                        value={phonePayment}
                                        onChange={(e) => setPhonePayment(e.target.value)}
                                    />
                                    <button style={{ marginLeft: 10 }} onClick={() => handlePayment('phone')}>
                                        PAY
                                    </button>
                                </div>
                            )}

                            {selectedFamily.utilities_electric > 0 && (
                                <div>
                                    <h4>Electric Bill</h4>
                                    <p>
                                        Amount Owed: ${(selectedFamily.utilities_electric || 0).toFixed(2)}
                                    </p>
                                    <input
                                        type="number"
                                        min="0.01"
                                        max="1000"
                                        step="0.01"
                                        value={electricPayment}
                                        onChange={(e) => setElectricPayment(e.target.value)}
                                    />
                                    <button style={{ marginLeft: 10 }} onClick={() => handlePayment('electric')}>
                                        PAY
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="col-md-4">
                            <br></br>
                            <p id="helptext">*Families may pay their utility bills in mulitple installments or all at once.
                                <br></br><br></br>
                                *Do <u>NOT</u> make a bill payment without a family member present.
                            </p>

                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}