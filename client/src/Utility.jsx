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
        
        if (!amount || amount <= 0) {
            setError('Please enter a valid amount')
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

    if (familiesLoading) {
        return <div style={{ padding: 20 }}>Loading Utilities...</div>
    }

    return (
        <div style={{ padding: 20 }} className="container">
            <h1>Friendly Utility Company</h1>
            
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
                    
                    <div>
                        <div>
                            
                            <h4>Gas Bill</h4>
                            <p>
                                ${(selectedFamily.utilities_gas || 0).toFixed(2)}
                            </p>
                            <input 
                                type="number"
                                value={gasPayment}
                                onChange={(e) => setGasPayment(e.target.value)}
                                disabled={selectedFamily.utilities_gas === 0 || selectedFamily.utilities_gas === null}
                            />
                            <button 
                                onClick={() => handlePayment('gas')}
                                disabled={selectedFamily.utilities_gas === 0 || selectedFamily.utilities_gas === null}
                            >
                                {selectedFamily.utilities_gas === 0 ? 'PAID' : 'PAY'}
                            </button>
                        </div>

                        <div>
                            <h4>Phone Bill</h4>
                            <p>
                                ${(selectedFamily.utilities_phone || 0).toFixed(2)}
                            </p>
                            <input 
                                type="number"
                                value={phonePayment}
                                onChange={(e) => setPhonePayment(e.target.value)}
                                disabled={selectedFamily.utilities_phone === 0 || selectedFamily.utilities_phone === null}
                            />
                            <button 
                                onClick={() => handlePayment('phone')}
                                disabled={selectedFamily.utilities_phone === 0 || selectedFamily.utilities_phone === null}
                            >
                                {selectedFamily.utilities_phone === 0 ? 'PAID' : 'PAY'}
                            </button>
                        </div>

                        <div>
                            <h4>Electric Bill</h4>
                            <p>
                                ${(selectedFamily.utilities_electric || 0).toFixed(2)}
                            </p>
                            <input 
                                type="number" 
                                value={electricPayment}
                                onChange={(e) => setElectricPayment(e.target.value)}
                                disabled={selectedFamily.utilities_electric === 0 || selectedFamily.utilities_electric === null}  
                            />
                            <button 
                                onClick={() => handlePayment('electric')}
                                disabled={selectedFamily.utilities_electric === 0 || selectedFamily.utilities_electric === null}
                            >
                                {selectedFamily.utilities_electric === 0 ? 'PAID' : 'PAY'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}