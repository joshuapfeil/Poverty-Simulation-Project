// Utility company collects gas, phone, and electric bills from families

import React, { useEffect, useState } from 'react'

export default function HealthCare() {
    const [families, setFamilies] = useState([])
    const [selectedFamilyId, setSelectedFamilyId] = useState('')
    const [selectedFamily, setSelectedFamily] = useState(null)
    const [selectedInsurance, setselectedInsurance] = useState('80')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [processing, setProcessing] = useState(false)

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
        const currentBalance = Number(selectedFamily.bank_total || 0)
        if (amount > currentBalance) {
            setError(`Insufficient funds. Available: $${currentBalance.toFixed(2)}, Required: $${amount.toFixed(2)}`)
            return
        }

        setProcessing(true)
        try {
            const res = await fetch(`/families/${selectedFamily.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...selectedFamily,
                    bank_total: currentBalance - amount,

                })
            })

            if (!res.ok) {
                const txt = await res.text().catch(() => null)
                throw new Error(txt || `Failed to process payment (${res.status})`)
            }

            const json = await res.json()
            const updatedFamily = json.data?.find(f => f.id === selectedFamily.id)
            setSelectedFamily(updatedFamily)


            setError(null)
        } catch (err) {
            setError(err.message)
        } finally {
            setProcessing(false)
        }
    }

    if (loading) {
        return <div style={{ padding: 20 }}>Loading Healthcare...</div>
    }

    return (
        <div style={{ padding: 20 }} className="container">
            <h1>Community Healthcare</h1>

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
                        <div style={{ marginBottom: 30, border: '1px solid #ccc', padding: 20 }}>
                            <label style={{ fontWeight: 'bold', marginRight: 10 }}>Insurance:</label>
                            <select value={selectedInsurance} onChange={handleInsuranceSelect} style={{ padding: '8px 12px', fontSize: '16px', minWidth: '250px', color: '#333' }}>
                                <option value="80">No Insurance: $80</option>
                                <option value="40">Medicare $40</option>
                                <option value="20">Insured $20</option>
                                <option value="1">Medicaid $1</option>
                            </select>
                        </div>
                
                        <div className="col-2" style={{ marginTop: 30 }}>
                            <button onClick={handlePayment} disabled={processing}>{processing ? 'Processing...' : 'Pay Healthcare Bill'}</button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    )
}