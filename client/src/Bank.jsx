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
    const [miscBankPayment, setMiscBankPayment] = useState('')
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
            setMiscBankPayment(family?.misc_bank || 0)
        } else {
            setSelectedFamily(null)
            setAutoLoanPayment('')
            setStudentLoanPayment('')
            setCreditCardPayment('')
            setMiscBankPayment('')
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
                            billType === 'miscBank' ? Number(miscBankPayment) :
                                0

        if (!amount || amount <= 0 || amount > 1000) {
            setError('Amount must be > 0 and ≤ 1000')
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
            } else if (billType === 'miscBank') {
                endpoint = '/api/transactions/pay-bill';
                body = { family_id: selectedFamily.id, bill_type: 'miscBank', amount: amount };
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
            setMiscBankPayment(updatedFamily?.misc_bank || 0)
            // Clear deposit and withdraw inputs
            if (billType === 'deposit') setDepositAmount('')
            if (billType === 'withdraw') setWithdrawAmount('')

            setError(null)
        } catch (err) {
            setError(err.message)
        }
    }

    if (familiesLoading) {
        return <div style={{ padding: 20 }}>Loading U Trust US National Bank...</div>
    }

    return (
        <div style={{ padding: 20 }} className='container'>
            <h1>U Trust US National Bank</h1>

            <div style={{ maxWidth: 450, margin: "0 auto" }} className="centered" id="section" >
                <label style={{ fontWeight: 'bold', marginRight: 10 }}>Select Family:</label>
                <select
                    value={selectedFamilyId}
                    onChange={handleFamilySelect}
                    style={{ padding: '8px 12px', borderRadius: '8px', fontSize: '16px', minWidth: '250px' }}>

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
                                    <h4>Deposit</h4>
                                    <input
                                        type="number"
                                        min="0.01"
                                        max="1000"
                                        step="0.01"
                                        value={depositAmount}
                                        onChange={(e) => setDepositAmount(e.target.value)}
                                        placeholder="Enter amount"
                                    />
                                    <button style={{ marginLeft: 10 }} onClick={() => handlePayment('deposit')}>Deposit</button>
                                </div>
                                <br></br>

                                <div style={{ marginBottom: '20px', paddingBottom: '15px', borderBottom: '1px solid #eee' }}>
                                    <h4>Withdraw</h4>
                                    <input
                                        type="number"
                                        min="0.01"
                                        max="1000"
                                        step="0.01"
                                        value={withdrawAmount}
                                        onChange={(e) => setWithdrawAmount(e.target.value)}
                                        placeholder="Enter amount"
                                    />
                                    <button style={{ marginLeft: 10 }} onClick={() => handlePayment('withdraw')}>Withdraw</button>
                                </div>

                                {selectedFamily.automobile_loan > 0 && (
                                    <div>
                                        <h4>Auto Loan Payment</h4>
                                        <p>Amount Owed: ${(selectedFamily.automobile_loan || 0).toFixed(2)}</p>
                                        <input
                                            type="number"
                                            min="0.01"
                                            max="1000"
                                            step="0.01"
                                            value={autoLoanPayment}
                                            onChange={(e) => setAutoLoanPayment(e.target.value)}
                                        />
                                        <button style={{ marginLeft: 10 }} onClick={() => handlePayment('autoLoan')}>
                                            Pay Auto Loan
                                        </button>
                                    </div>
                                )}

                                <br></br>

                                {selectedFamily.student_loans > 0 && (
                                    <div>
                                        <h4>Student Loan Payment</h4>
                                        <p>Amount Owed: ${(selectedFamily.student_loans || 0).toFixed(2)}</p>
                                        <input
                                            type="number"
                                            min="0.01"
                                            max="1000"
                                            step="0.01"
                                            value={studentLoanPayment}
                                            onChange={(e) => setStudentLoanPayment(e.target.value)}
                                        />
                                        <button style={{ marginLeft: 10 }} onClick={() => handlePayment('studentLoan')}>
                                            Pay Student Loan
                                        </button>
                                    </div>
                                )}

                                <br></br>

                                {selectedFamily.credit_card > 0 && (
                                    <div>
                                        <h4>Credit Card Payment</h4>
                                        <p>Amount Owed: ${(selectedFamily.credit_card || 0).toFixed(2)}</p>
                                        <input
                                            type="number"
                                            min="0.01"
                                            max="1000"
                                            step="0.01"
                                            value={creditCardPayment}
                                            onChange={(e) => setCreditCardPayment(e.target.value)}
                                        />
                                        <button style={{ marginLeft: 10 }} onClick={() => handlePayment('creditCard')}>
                                            Pay Credit Card
                                        </button>
                                    </div>
                                )}
                                {selectedFamily.misc_bank > 0 && (
                                    <div>
                                        <h4>Miscelanious Payments</h4>
                                        <p>Amount Owed: ${(selectedFamily.misc_bank || 0).toFixed(2)}</p>
                                        <input
                                            type="number"
                                            min="0.01"
                                            max="1000"
                                            step="0.01"
                                            value={miscBankPayment}
                                            onChange={(e) => setMiscBankPayment(e.target.value)}
                                        />
                                        <button style={{ marginLeft: 10 }} onClick={() => handlePayment('miscBank')}>
                                            Pay Miscellaneous
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="col-md-4">
                            <br></br>
                            <p id="helptext">*Cash, checks, and TANF balances on EBT cards can be deposited into bank accounts.
                                <br></br> <br></br>
                                *Checks and TANF can also be exchanged directly for cash without needing to deposit or withdraw.
                                <br></br> <br></br>
                                *Food stamps may <u>NOT</u> be deposited or exchanged for cash.
                                <br></br><br></br>
                                *Do <u>NOT</u> make a loan payment without a family member present.
                            </p>
                        </div>

                    </div >
                </div >
            )
            }
        </div >
    )
}