/*
    This will be the page for a family user. 
    They need to be able to see their bank total,
    record deductions for services,
    and possibly see upcoming bills/pay them.
  */

import React, { useEffect, useState, } from 'react'
import { useLocation } from 'react-router-dom'

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

export default function FamilyView() {
  const query = useQuery()
  const id = query.get('id')
  const [family, setFamily] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [foodWeeks, setFoodWeeks] = useState([false, false, false, false, false])

  useEffect(() => {
    if (!family) return
    try {
      const src = family.food_weeks
      if (!src) return
      let parsed = src
      if (typeof src === 'string') {
        parsed = JSON.parse(src)
      }
      if (Array.isArray(parsed)) {
        const next = [false, false, false, false, false]
        for (let i = 1; i <= 4; i++) {
          next[i] = !!parsed[i - 1]
        }
        setFoodWeeks(next)
      }
    } catch (e) {
    }
  }, [family])

  function toggleWeek(i) {
    if (i < 1 || i > 4) return
    setFoodWeeks((prev) => {
      const next = prev.slice()
      next[i] = !next[i]
      return next
    })
  }

  useEffect(() => {
    if (!id) return
    setLoading(true)
    fetch(`/families/${id}`)
      .then((r) => r.json())
      .then((j) => setFamily((j.data && j.data[0]) || null))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  // Calculate total monthly bills
  const calculateMonthlyBills = () => {
    if (!family) return 0
    return (
      (Number(family.housing_mortgage) || 0) +
      (Number(family.housing_taxes) || 0) +
      (Number(family.housing_maintenance) || 0) +
      (Number(family.utilities_gas) || 0) +
      (Number(family.utilities_electric) || 0) +
      (Number(family.utilities_phone) || 0) +
      (Number(family.student_loans) || 0) +
      (Number(family.clothing) || 0) +
      (Number(family.credit_card) || 0) +
      (Number(family.automobile_loan) || 0)
    )
  }

  // Calculate total housing
  const calculateHousingTotal = () => {
    if (!family) return 0
    return (
      (Number(family.housing_mortgage) || 0) +
      (Number(family.housing_taxes) || 0) +
      (Number(family.housing_maintenance) || 0)
    )
  }

  // Calculate total utilities
  const calculateUtilitiesTotal = () => {
    if (!family) return 0
    return (
      (Number(family.utilities_gas) || 0) +
      (Number(family.utilities_electric) || 0) +
      (Number(family.utilities_phone) || 0)
    )
  }

  return (
    <div style={{ padding: 20, maxWidth: '800px' }}>
      <h1>Family Account View</h1>
      {!id && <p>No family selected. Use <code>?id=1</code> in the URL to view a family (placeholder).</p>}
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {family && (
        <div>
          <h2>{family.name}</h2>
          
          {/* Bank Balance Section */}
          <div style={{ backgroundColor: '#e8f5e9', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
            <h3 style={{ margin: '0 0 10px 0' }}>Current Bank Balance</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#2e7d32' }}>
              ${Number(family.bank_total || 0).toFixed(2)}
            </p>
          </div>

          {/* Bills Summary */}
          <div style={{ backgroundColor: '#fff3e0', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
            <h3 style={{ margin: '0 0 10px 0' }}>Bills Summary</h3>
            <p style={{ fontSize: '18px', margin: '5px 0' }}>
              <strong>Total Monthly Bills:</strong> ${calculateMonthlyBills().toFixed(2)}
            </p>
            {family.food_weekly > 0 && (
              <p style={{ fontSize: '18px', margin: '5px 0' }}>
                <strong>Food (Weekly):</strong> ${Number(family.food_weekly).toFixed(2)}
              </p>
            )}
          </div>

          {/* Detailed Bills Breakdown */}
          <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', marginBottom: '20px' }}>
            <h3>Bills to Pay This Month</h3>

            {/* Housing Section */}
            {calculateHousingTotal() > 0 && (
              <div style={{ marginBottom: '20px', paddingBottom: '15px', borderBottom: '1px solid #eee' }}>
                <h4 style={{ color: '#1976d2', marginBottom: '10px' }}>
                  Housing (Pay to mortgage & realty co.) - Total: ${calculateHousingTotal().toFixed(2)}
                </h4>
                <div style={{ marginLeft: '20px' }}>
                  {family.housing_mortgage > 0 && (
                    <p style={{ margin: '5px 0' }}>Mortgage: ${Number(family.housing_mortgage).toFixed(2)}</p>
                  )}
                  {family.housing_taxes > 0 && (
                    <p style={{ margin: '5px 0' }}>Taxes: ${Number(family.housing_taxes).toFixed(2)}</p>
                  )}
                  {family.housing_maintenance > 0 && (
                    <p style={{ margin: '5px 0' }}>Maintenance: ${Number(family.housing_maintenance).toFixed(2)}</p>
                  )}
                </div>
              </div>
            )}

            {/* Utilities Section */}
            {calculateUtilitiesTotal() > 0 && (
              <div style={{ marginBottom: '20px', paddingBottom: '15px', borderBottom: '1px solid #eee' }}>
                <h4 style={{ color: '#1976d2', marginBottom: '10px' }}>
                  Utilities (Pay to utility company) - Total: ${calculateUtilitiesTotal().toFixed(2)}
                </h4>
                <div style={{ marginLeft: '20px' }}>
                  {family.utilities_gas > 0 && (
                    <p style={{ margin: '5px 0' }}>Gas: ${Number(family.utilities_gas).toFixed(2)}</p>
                  )}
                  {family.utilities_electric > 0 && (
                    <p style={{ margin: '5px 0' }}>Electric: ${Number(family.utilities_electric).toFixed(2)}</p>
                  )}
                  {family.utilities_phone > 0 && (
                    <p style={{ margin: '5px 0' }}>Phone: ${Number(family.utilities_phone).toFixed(2)}</p>
                  )}
                </div>
              </div>
            )}

            {/* Other Bills */}
            <div style={{ marginBottom: '10px' }}>
              <h4 style={{ color: '#1976d2', marginBottom: '10px' }}>Other Monthly Bills</h4>
              <div style={{ marginLeft: '20px' }}>
                {family.student_loans > 0 && (
                  <p style={{ margin: '5px 0' }}>Student Loans (Pay to bank): ${Number(family.student_loans).toFixed(2)}</p>
                )}
                {family.clothing > 0 && (
                  <p style={{ margin: '5px 0' }}>Clothing (Pay to super center): ${Number(family.clothing).toFixed(2)}</p>
                )}
                {family.credit_card > 0 && (
                  <p style={{ margin: '5px 0' }}>Credit Card Minimum Payment (Pay to bank): ${Number(family.credit_card).toFixed(2)}</p>
                )}
                {family.automobile_loan > 0 && (
                  <p style={{ margin: '5px 0' }}>Automobile Loan (Pay to bank): ${Number(family.automobile_loan).toFixed(2)}</p>
                )}
              </div>
            </div>

            {/* Food - Weekly */}
            {family.food_weekly > 0 && (
              <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #eee' }}>
                <h4 style={{ color: '#1976d2', marginBottom: '10px' }}>Weekly Expenses</h4>
                <div style={{ marginLeft: '20px' }}>
                  <p style={{ margin: '5px 0' }}>
                    Food (Pay to super center): ${Number(family.food_weekly).toFixed(2)} per week
                  </p>
                  <p style={{ fontSize: '14px', color: '#666', margin: '5px 0' }}>
                    (Approximately ${(Number(family.food_weekly) * 4).toFixed(2)} per month)
                  </p>
                </div>

                {/* Food weeks tracker */}
                <div style={{ marginLeft: '20px', marginTop: '15px' }}>
                  <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>Food Purchased This Month:</p>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <input type="checkbox" checked={foodWeeks[1]} onChange={() => toggleWeek(1)} /> Week 1
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <input type="checkbox" checked={foodWeeks[2]} onChange={() => toggleWeek(2)} /> Week 2
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <input type="checkbox" checked={foodWeeks[3]} onChange={() => toggleWeek(3)} /> Week 3
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <input type="checkbox" checked={foodWeeks[4]} onChange={() => toggleWeek(4)} /> Week 4
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Total Amount Due This Month */}
          <div style={{ backgroundColor: '#ffebee', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#c62828' }}>Total Amount Due This Month</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#c62828' }}>
              ${(calculateMonthlyBills() + (Number(family.food_weekly || 0) * 4)).toFixed(2)}
            </p>
            <p style={{ fontSize: '14px', margin: '10px 0 0 0', color: '#666' }}>
              (Monthly bills: ${calculateMonthlyBills().toFixed(2)} + Food: ${(Number(family.food_weekly || 0) * 4).toFixed(2)})
            </p>
          </div>

        </div>
      )}
    </div>
  )
}