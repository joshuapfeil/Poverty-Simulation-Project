//The bank is in charge of depositing checks and cash, withdrawing money, collecting loan amounts due, and converting TANF benefits.

import React, { useEffect, useState } from 'react'

export default function Bank() {
    const [families, setFamilies] = useState([])
    const [selectedFamilyId, setSelectedFamilyId] = useState('')
    const [selectedFamily, setSelectedFamily] = useState(null)
    const [currentBalance, setBalance] = useState('')
    const [depositAmount, setDepositAmount] = useState('')
    const [withdrawAmount, setWithdrawAmount] = useState('')
    const [autoLoanPayment, setAutoLoanPayment] = useState('')
    const [studentLoanPayment, setStudentLoanPayment] = useState('')
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
            setBalance(family?.bank_total || 0)
            setAutoLoanPayment(family?.automobile_loan || 0)
            setStudentLoanPayment(family?.student_loans || 0)

        } else {
            setSelectedFamily(null)
            setBalance('')
            setAutoLoanPayment('')
            setStudentLoanPayment('')
        }
    }

    const handlePayment = async (billType) => {
        if (!selectedFamily) {
            setError('Please select a family')
            return
        }
        const amount = billType === 'deposit' ? Number(depositAmount) :
                    billType === 'withdraw' ? Number(withdrawAmount) :
                    billType === 'autoLoan' ? Number(autoLoanPayment) :
                    Number(studentLoanPayment)

        if (!amount || amount <= 0) {
            setError('Please enter a valid amount')
            return
        }

        const currentBalance = Number(selectedFamily.bank_total || 0)

        try {
            const res = await fetch(`/families/${selectedFamily.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...selectedFamily,
                    bank_total: billType === 'deposit' ? currentBalance + amount : billType === 'withdraw' ? currentBalance - amount : billType === 'autoLoan' ? currentBalance - amount : billType === 'studentLoan' ? currentBalance - amount : currentBalance,
                    automobile_loan: billType === 'autoLoan' ? Math.max(0, selectedFamily.automobile_loan - amount) : selectedFamily.automobile_loan,
                    student_loans: billType === 'studentLoan' ? Math.max(0, selectedFamily.student_loans - amount) : selectedFamily.student_loans
                })
            })

            if (!res.ok) {
                const txt = await res.text().catch(() => null)
                throw new Error(txt || `Failed to process payment (${res.status})`)
            }

            const json = await res.json()
            const updatedFamily = json.data?.find(f => f.id === selectedFamily.id)
            setSelectedFamily(updatedFamily)
            setBalance(updatedFamily?.bank_total || 0)
            setAutoLoanPayment(updatedFamily?.automobile_loan || 0)
            setStudentLoanPayment(updatedFamily?.student_loans || 0)

            // Clear inputs
            if (billType === 'deposit') setDepositAmount('')
            if (billType === 'withdraw') setWithdrawAmount('')
            if (billType === 'autoLoan') setAutoLoanPayment('')
            if (billType === 'studentLoan') setStudentLoanPayment('')

            setError(null)
        } catch (err) {
            setError(err.message)
        }
    }

    if (loading) {
        return <div style={{ padding: 20 }}>Loading Utilities...</div>
    }


    return (
        <div style={{ padding: 20 }} className='containter'>
            <h1>U Trust US National Bank</h1>

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
                            <h4>Deposit</h4>
                            <input
                                type="number"
                                value={depositAmount}
                                onChange={(e) => setDepositAmount(e.target.value)}
                            />

                            <button onClick={() => handlePayment('deposit')}>Deposit</button>

                        </div>

                        <div>
                            <h4>Withdraw</h4>
                            <input
                                type="number"
                                value={withdrawAmount}
                                onChange={(e) => setWithdrawAmount(e.target.value)}
                            />

                            <button onClick={() => handlePayment('withdraw')}>Withdraw</button>
                        </div>

                        <div>
                            <h4>Auto Loan Payment</h4>
                            <p>
                                ${(selectedFamily.automobile_loan || 0).toFixed(2)}
                            </p>
                            <input
                                type="number"
                                value={autoLoanPayment}
                                onChange={(e) => setAutoLoanPayment(e.target.value)}
                            />

                            <button onClick={() => handlePayment('autoLoan')}>Pay Auto Loan</button>
                        </div>

                        <div>
                            <h4>Student Loan Payment</h4>
                            <p>
                                ${(selectedFamily.student_loans || 0).toFixed(2)}
                            </p>
                            <input
                                type="number"
                                value={studentLoanPayment}
                                onChange={(e) => setStudentLoanPayment(e.target.value)}
                            />

                            <button onClick={() => handlePayment('studentLoan')}>Pay Student Loan</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

