//The bank is in charge of depositing checks and cash, withdrawing money, collecting loan amounts due, and credit card payments.

import React, { useEffect, useState } from 'react'
import useFamilies from './useFamilies'

export default function Bank() {
    const [selectedFamilyId, setSelectedFamilyId] = useState('')
    const [selectedFamily, setSelectedFamily] = useState(null)
    const [depositAmount, setDepositAmount] = useState('')
    const [withdrawAmount, setWithdrawAmount] = useState('')
    const [autoLoanPayment, setAutoLoanPayment] = useState('')
    const [studentLoanPayment, setStudentLoanPayment] = useState('')
    const [creditCardPayment, setCreditCardPayment] = useState('')
    const { families, loading: familiesLoading, error: familiesError, updateFamily } = useFamilies()
    const [error, setError] = useState(null)

    useEffect(() => {
        if (familiesError) setError(familiesError)
    }, [familiesError])

    // Sync selected family when families update
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
            setAutoLoanPayment(family?.automobile_loan || 0)
            setStudentLoanPayment(family?.student_loans || 0)
            setCreditCardPayment(family?.credit_card || 0)
        } else {
            setSelectedFamily(null)
            setAutoLoanPayment('')
            setStudentLoanPayment('')
            setCreditCardPayment('')
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
                    billType === 'studentLoan' ? Number(studentLoanPayment) :
                    billType === 'creditCard' ? Number(creditCardPayment) :
                    0

        if (!amount || amount <= 0) {
            setError('Please enter a valid amount')
            return
        }

        try {
            let endpoint = '';
            let body = {};

            if (billType === 'deposit') {
                endpoint = '/api/transactions/deposit';
                body = { family_id: selectedFamily.id, amount: amount };
            } else if (billType === 'withdraw') {
                endpoint = '/api/transactions/withdraw';
                body = { family_id: selectedFamily.id, amount: amount };
            } else if (billType === 'autoLoan') {
                endpoint = '/api/transactions/pay-bill';
                body = { family_id: selectedFamily.id, bill_type: 'autoLoan', amount: amount };
            } else if (billType === 'studentLoan') {
                endpoint = '/api/transactions/pay-bill';
                body = { family_id: selectedFamily.id, bill_type: 'studentLoan', amount: amount };
            } else if (billType === 'creditCard') {
                endpoint = '/api/transactions/pay-bill';
                body = { family_id: selectedFamily.id, bill_type: 'creditCard', amount: amount };
            }

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            })

            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.message || `Failed to process payment (${res.status})`)
            }

            const json = await res.json()
            const updatedFamily = json.data
            setSelectedFamily(updatedFamily)
            updateFamily(updatedFamily)

            // Update payment input fields with remaining balances
            setAutoLoanPayment(updatedFamily?.automobile_loan || 0)
            setStudentLoanPayment(updatedFamily?.student_loans || 0)
            setCreditCardPayment(updatedFamily?.credit_card || 0)

            // Clear deposit and withdraw inputs
            if (billType === 'deposit') setDepositAmount('')
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
                                placeholder="Enter amount"
                            />
                            <button onClick={() => handlePayment('deposit')}>Deposit</button>
                        </div>

                        <div>
                            <h4>Withdraw</h4>
                            <input
                                type="number"
                                value={withdrawAmount}
                                onChange={(e) => setWithdrawAmount(e.target.value)}
                                placeholder="Enter amount"
                            />
                            <button onClick={() => handlePayment('withdraw')}>Withdraw</button>
                        </div>

                        <div>
                            <h4>Auto Loan Payment</h4>
                            <p>Amount Owed: ${(selectedFamily.automobile_loan || 0).toFixed(2)}</p>
                            <input
                                type="number"
                                value={autoLoanPayment}
                                onChange={(e) => setAutoLoanPayment(e.target.value)}
                                disabled={selectedFamily.automobile_loan === 0 || selectedFamily.automobile_loan === null}
                                style={{
                                    backgroundColor: (selectedFamily.automobile_loan === 0 || selectedFamily.automobile_loan === null) 
                                        ? '#e0e0e0' 
                                        : 'white'
                                }}
                            />
                            <button 
                                onClick={() => handlePayment('autoLoan')}
                                disabled={selectedFamily.automobile_loan === 0 || selectedFamily.automobile_loan === null}
                            >
                                {selectedFamily.automobile_loan === 0 || selectedFamily.automobile_loan === null ? 'PAID' : 'Pay Auto Loan'}
                            </button>
                        </div>

                        <div>
                            <h4>Student Loan Payment</h4>
                            <p>Amount Owed: ${(selectedFamily.student_loans || 0).toFixed(2)}</p>
                            <input
                                type="number"
                                value={studentLoanPayment}
                                onChange={(e) => setStudentLoanPayment(e.target.value)}
                                disabled={selectedFamily.student_loans === 0 || selectedFamily.student_loans === null}
                                style={{
                                    backgroundColor: (selectedFamily.student_loans === 0 || selectedFamily.student_loans === null) 
                                        ? '#e0e0e0' 
                                        : 'white'
                                }}
                            />
                            <button 
                                onClick={() => handlePayment('studentLoan')}
                                disabled={selectedFamily.student_loans === 0 || selectedFamily.student_loans === null}
                            >
                                {selectedFamily.student_loans === 0 || selectedFamily.student_loans === null ? 'PAID' : 'Pay Student Loan'}
                            </button>
                        </div>

                        <div>
                            <h4>Credit Card Payment</h4>
                            <p>Amount Owed: ${(selectedFamily.credit_card || 0).toFixed(2)}</p>
                            <input
                                type="number"
                                value={creditCardPayment}
                                onChange={(e) => setCreditCardPayment(e.target.value)}
                                disabled={selectedFamily.credit_card === 0 || selectedFamily.credit_card === null}
                                style={{
                                    backgroundColor: (selectedFamily.credit_card === 0 || selectedFamily.credit_card === null) 
                                        ? '#e0e0e0' 
                                        : 'white'
                                }}
                            />
                            <button 
                                onClick={() => handlePayment('creditCard')}
                                disabled={selectedFamily.credit_card === 0 || selectedFamily.credit_card === null}
                            >
                                {selectedFamily.credit_card === 0 || selectedFamily.credit_card === null ? 'PAID' : 'Pay Credit Card'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}