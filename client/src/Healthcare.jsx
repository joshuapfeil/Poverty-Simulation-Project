// Utility company collects gas, phone, and electric bills from families

import React, { useEffect, useState } from 'react'
import useFamilies from './useFamilies'

export default function HealthCare() {
    const [selectedFamilyId, setSelectedFamilyId] = useState('')
    const [selectedFamily, setSelectedFamily] = useState(null)
    const [selectedInsurance, setselectedInsurance] = useState('80')
    const { families, loading: familiesLoading, error: familiesError, updateFamily } = useFamilies()
    const [error, setError] = useState(null)
    const [processing, setProcessing] = useState(false)

    useEffect(() => {
        if (familiesError) setError(familiesError)
    }, [familiesError])

    // Keep selected family updated when families change
    useEffect(() => {
        if (selectedFamilyId) {
            const updated = families.find(f => f.id === parseInt(selectedFamilyId))
            if (updated) setSelectedFamily(updated)
        }
    }, [families, selectedFamilyId])

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

    const handleInsuranceSelect = (e) => {
        setselectedInsurance(e.target.value)
    }

    const handlePayment = async () => {
        if (!selectedFamily) {
            setError('Please select a family')
            return
        }

        const amount = Number(selectedInsurance)

        if (!amount || amount <= 0 || amount > 1000) {
            setError('Amount must be > 0 and ≤ 1000')
            return
        }

        setProcessing(true)
        try {
            const res = await fetch('/api/transactions/withdraw', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    family_id: selectedFamily.id,
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

            setError(null)
        } catch (err) {
            setError(err.message)
        } finally {
            setProcessing(false)
        }
    }

    if (familiesLoading) {
        return <div style={{ padding: 20 }}>Loading Healthcare...</div>
    }

    return (
        <div style={{ padding: 20 }} className="container">
            <h1>Community Healthcare</h1>



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
                                <div>
                                    <label style={{ fontWeight: 'bold', marginRight: 10 }}>Insurance:</label>
                                    <select value={selectedInsurance} onChange={handleInsuranceSelect} style={{ padding: '8px 12px', fontSize: '16px', minWidth: '250px', borderRadius: '8px' }}>
                                        <option value="80">Uninsured: $80</option>
                                        <option value="40">Medicare $40</option>
                                        <option value="20">Insured $20</option>
                                        <option value="1">Medicaid $1</option>
                                    </select>
                                </div>

                                <div style={{ marginTop: 30 }}>
                                    <button onClick={handlePayment} disabled={processing}>{processing ? 'Processing...' : 'Pay Healthcare Bill'}</button>
                                </div>

                            </div>
                        </div>

                        <div className="col-md-4">
                            <br></br>
                            <p id="helptext">*<u>Before</u> treating patients, ask them for proof of insurance.
                                <br></br><br></br>
                                *If they do not have insurance, or are unsure of their status, charge them as <u>uninsured</u>.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}