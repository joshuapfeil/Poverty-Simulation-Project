// Mortgage office takes mortgage, tax, and maintenance payments from families

import React, { useEffect, useState } from 'react'
import useFamilies from './useFamilies'

export default function Mortgage() {
    const [selectedFamilyId, setSelectedFamilyId] = useState('')
    const [selectedFamily, setSelectedFamily] = useState(null)
    const [mortgagePayment, setMortgagePayment] = useState('')
    const [taxesPayment, setTaxesPayment] = useState('')
    const [maintenancePayment, setMaintenancePayment] = useState('')
    const { families, loading: familiesLoading, error: familiesError, updateFamily } = useFamilies()
    const [error, setError] = useState(null)

    useEffect(() => {
        if (familiesError) setError(familiesError)
    }, [familiesError])

    // Keep selectedFamily in sync when families list updates (real-time updates)
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
            setMortgagePayment(family?.housing_mortgage || 0)
            setTaxesPayment(family?.housing_taxes || 0)
            setMaintenancePayment(family?.housing_maintenance || 0)
        } else {
            setSelectedFamily(null)
            setMortgagePayment('')
            setTaxesPayment('')
            setMaintenancePayment('')
        }
    }

    const handlePayment = async (billType) => {
        if (!selectedFamily) {
            setError('Please select a family')
            return
        }

        const amount = billType === 'mortgage' ? Number(mortgagePayment) :
            billType === 'taxes' ? Number(taxesPayment) :
                Number(maintenancePayment)

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

            if (billType === 'mortgage') setMortgagePayment('')
            if (billType === 'taxes') setTaxesPayment('')
            if (billType === 'maintenance') setMaintenancePayment('')

            setError(null)
        } catch (err) {
            setError(err.message)
        }
    }

    if (familiesLoading) {
        return <div style={{ padding: 20 }}>Loading Mortgage & Realty...</div>
    }

    return (
        <div style={{ padding: 20 }} className="container">
            <h1>Sweaney Mortgage & Realty</h1>


            <div style={{ maxWidth: 450, margin: "0 auto" }} className="centered" id="section">
                <label style={{ fontWeight: 'bold', marginRight: 10 }}>Select Family:</label>
                <select
                    value={selectedFamilyId}
                    onChange={handleFamilySelect}
                    style={{ padding: '8px 12px', fontSize: '16px', minWidth: '250px', borderRadius: '8px' }}
                >
                    <option value="">-- Choose a family --</option>
                    {families
                        .filter(family => Number(family.housing_mortgage) > 0 || Number(family.housing_taxes) > 0 || Number(family.housing_maintenance) > 0)
                        .map(family => (
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
                                {selectedFamily.housing_mortgage > 0 && (
                                    <div>
                                        <h4>Mortgage Payment</h4>
                                        <p>
                                            Amount Owed: ${(selectedFamily.housing_mortgage || 0).toFixed(2)}
                                        </p>
                                        <input
                                            type="number"
                                            min="0.01"
                                            max="1000"
                                            step="0.01"
                                            value={mortgagePayment}
                                            onChange={(e) => setMortgagePayment(e.target.value)}
                                        />
                                        <button style={{ marginLeft: 10 }} onClick={() => handlePayment('mortgage')}>
                                            PAY
                                        </button>
                                        <br></br><br></br>
                                    </div>
                                )}

                                {selectedFamily.housing_taxes > 0 && (
                                    <div>
                                        <h4>Property Taxes</h4>
                                        <p>
                                            Amount Owed: ${(selectedFamily.housing_taxes || 0).toFixed(2)}
                                        </p>
                                        <input
                                            type="number"
                                            min="0.01"
                                            max="1000"
                                            step="0.01"
                                            value={taxesPayment}
                                            onChange={(e) => setTaxesPayment(e.target.value)}
                                        />
                                        <button style={{ marginLeft: 10 }} onClick={() => handlePayment('taxes')}>
                                            PAY
                                        </button>
                                        <br></br><br></br>
                                    </div>
                                )}

                                {selectedFamily.housing_maintenance > 0 && (
                                    <div>
                                        <h4>Maintenance</h4>
                                        <p>
                                            Amount Owed: ${(selectedFamily.housing_maintenance || 0).toFixed(2)}
                                        </p>
                                        <input
                                            type="number"
                                            min="0.01"
                                            max="1000"
                                            step="0.01"
                                            value={maintenancePayment}
                                            onChange={(e) => setMaintenancePayment(e.target.value)}
                                        />
                                        <button style={{ marginLeft: 10 }} onClick={() => handlePayment('maintenance')}>
                                            PAY
                                        </button>
                                        <br></br><br></br>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="col-md-4">
                            <br></br>
                            <p id="helptext">*Families may make their payments in partial installments during Weeks 1 and 2.
                                <br></br><br></br>
                                *During Weeks 3 and 4, demand the remaining total. 
                                <br></br><br></br>
                                *Do <u>NOT</u> take any payments without a family member present.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}