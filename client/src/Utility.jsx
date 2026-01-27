// Utility company collects gas, phone, and electric bills from families

import React, { useEffect, useState } from 'react'

export default function Utility() {
    const [families, setFamilies] = useState([])
    const [selectedFamilyId, setSelectedFamilyId] = useState('')
    const [selectedFamily, setSelectedFamily] = useState(null)
    const [gasPayment, setGasPayment] = useState('')
    const [phonePayment, setPhonePayment] = useState('')
    const [electricPayment, setElectricPayment] = useState('')
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
                    utilities_gas: billType === 'gas' ? 0 : selectedFamily.utilities_gas,
                    utilities_phone: billType === 'phone' ? 0 : selectedFamily.utilities_phone,
                    utilities_electric: billType === 'electric' ? 0 : selectedFamily.utilities_electric
                })
            })

            if (!res.ok) {
                const txt = await res.text().catch(() => null)
                throw new Error(txt || `Failed to process payment (${res.status})`)
            }

            const json = await res.json()
            const updatedFamily = json.data?.find(f => f.id === selectedFamily.id)
            setSelectedFamily(updatedFamily)
            
            if (billType === 'gas') setGasPayment('')
            if (billType === 'phone') setPhonePayment('')
            if (billType === 'electric') setElectricPayment('')

            setError(null)
        } catch (err) {
            setError(err.message)
        }
    }

    if (loading) {
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