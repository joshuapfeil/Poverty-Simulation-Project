/*
    This will be the page for a family user. 
    They need to be able to see their bank total,
    record deductions for services,
    and possibly see upcoming bills/pay them.
  */

import React, { useEffect, useState, } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import useFamilies from './useFamilies'

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

export default function FamilyView() {
  const query = useQuery()
  const { id: paramId, username: paramUsername } = useParams()
  const queryId = query.get('id')
  // identifier can be numeric id or username (supports: /family/123, /family/username, ?id=123)
  const id = paramId || paramUsername || queryId
  const [family, setFamily] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const { families, loading: familiesLoading, error: familiesError } = useFamilies()

  const [foodWeeks, setFoodWeeks] = useState([false, false, false, false, false])

  // Load food week payment status from database
  useEffect(() => {
    if (!family) return
    const weeks = [
      false, // index 0 unused
      family.food_week1_paid === 1,
      family.food_week2_paid === 1,
      family.food_week3_paid === 1,
      family.food_week4_paid === 1
    ]
    setFoodWeeks(weeks)
  }, [family])

  // Sync family from shared families list (keeps view live)
  useEffect(() => {
    if (familiesError) setError(familiesError)
    setLoading(familiesLoading)
    if (!id) return
    if (!familiesLoading) {
      let found = null
      // numeric identifier → lookup by id
      if (/^\d+$/.test(id)) {
        found = families.find(f => f.id === Number(id))
      } else {
        // treat as username (family name) — case-insensitive match
        const name = decodeURIComponent(id)
        found = families.find(f => f.name && f.name.toLowerCase() === name.toLowerCase())
      }
      setFamily(found || null)
    }
  }, [id, families, familiesLoading, familiesError])

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
        (Number(family.automobile_loan) || 0) +
        (Number(family.prescriptions) || 0) +
        (Number(family.misc_supercenter) || 0) +
        (Number(family.misc_bank) || 0)
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

  // Calculate unpaid food weeks
  const calculateUnpaidFoodWeeks = () => {
    return [1, 2, 3, 4].filter(i => !foodWeeks[i]).length
  }

  // Calculate total food due (only unpaid weeks)
  const calculateFoodDue = () => {
    if (!family) return 0
    const unpaidWeeks = calculateUnpaidFoodWeeks()
    return Number(family.food_weekly || 0) * unpaidWeeks
  }

  return (
      <div style={{ padding: 20 }} className="container">
        <h1>Family Account View</h1>
        {!id && <p>No family selected. Use <code>?id=1</code> in the URL to view a family (placeholder).</p>}
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {family && (
            <div>
              <h2 style={{ textAlign: "center" }}>{family.name}</h2> <br></br>

              {/* Bank Balance Section */}
              <div style={{ backgroundColor: '#e8f5e9', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#2e7d32' }}>Current Bank Balance</h3>
                <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#2e7d32' }}>
                  ${Number(family.bank_total || 0).toFixed(2)}
                </p>
              </div>

              {/* Detailed Bills Breakdown */}
              <div id="section">
                <h3>Bills to Pay This Month</h3>

                {/* Housing Section (always shown for consistency) */}
                <div style={{ marginBottom: '20px', paddingBottom: '15px', borderBottom: '1px solid #eee' }}>
                  <h4 style={{ color: '#1976d2', marginBottom: '10px' }}>
                    Housing (Pay to Sweaney Mortgage & Realty) - ${calculateHousingTotal().toFixed(2)}
                  </h4>
                  <div style={{ marginLeft: '20px' }}>
                    {family.housing_mortgage > 0 && (
                        <p style={{ margin: '5px 0' }}><b>Mortgage:</b> ${Number(family.housing_mortgage).toFixed(2)}</p>
                    )}
                    {family.housing_taxes > 0 && (
                        <p style={{ margin: '5px 0' }}><b>Taxes:</b> ${Number(family.housing_taxes).toFixed(2)}</p>
                    )}
                    {family.housing_maintenance > 0 && (
                        <p style={{ margin: '5px 0' }}><b>Maintenance:</b> ${Number(family.housing_maintenance).toFixed(2)}</p>
                    )}
                    { ( (family.housing_mortgage || 0) === 0 && (family.housing_taxes || 0) === 0 && (family.housing_maintenance || 0) === 0 ) && (
                        <p style={{ margin: '5px 0', color: '#666' }}>No housing charges at this time.</p>
                    )}
                  </div>
                </div>

                {/* Utilities Section */}
                {calculateUtilitiesTotal() > 0 && (
                    <div style={{ marginBottom: '20px', paddingBottom: '15px', borderBottom: '1px solid #eee' }}>
                      <h4 style={{ color: '#1976d2', marginBottom: '10px' }}>
                        Utilities (Pay to Friendly Utility Company) - ${calculateUtilitiesTotal().toFixed(2)}
                      </h4>
                      <div style={{ marginLeft: '20px' }}>
                        {family.utilities_gas > 0 && (
                            <p style={{ margin: '5px 0' }}><b>Gas:</b> ${Number(family.utilities_gas).toFixed(2)}</p>
                        )}
                        {family.utilities_electric > 0 && (
                            <p style={{ margin: '5px 0' }}><b>Electric:</b> ${Number(family.utilities_electric).toFixed(2)}</p>
                        )}
                        {family.utilities_phone > 0 && (
                            <p style={{ margin: '5px 0' }}><b>Phone:</b> ${Number(family.utilities_phone).toFixed(2)}</p>
                        )}
                      </div>
                    </div>
                )}



                {/* Food - Weekly */}
                {family.food_weekly > 0 && (
                    <div style={{ marginBottom: '20px', paddingBottom: '15px', borderBottom: '1px solid #eee' }}>
                      <h4 style={{ color: '#1976d2', marginBottom: '10px' }}>Groceries (Pay to Food-A-Rama Super Center) - ${(Number(family.food_weekly) * 4).toFixed(2)}</h4>
                      <div style={{ marginLeft: '20px' }}>
                        <p style={{ margin: '5px 0' }}>
                          <b>Food:</b> ${Number(family.food_weekly).toFixed(2)} per week
                        </p>
                        {/* <p style={{ fontSize: '14px', color: '#666', margin: '5px 0' }}>
                          (Approximately ${(Number(family.food_weekly) * 4).toFixed(2)} per month)
                        </p> */}
                      </div>

                      {/* Food weeks tracker - Read only */}
                      <div style={{ marginLeft: '20px', marginTop: '15px' }}>
                        <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>Food Purchased This Month:</p>
                        <div style={{ display: 'flex', gap: 12 }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <input type="checkbox" checked={foodWeeks[1]} disabled /> Week 1
                          </label>
                          <label style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <input type="checkbox" checked={foodWeeks[2]} disabled /> Week 2
                          </label>
                          <label style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <input type="checkbox" checked={foodWeeks[3]} disabled /> Week 3
                          </label>
                          <label style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <input type="checkbox" checked={foodWeeks[4]} disabled /> Week 4
                          </label>
                        </div>
                        <p style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
                          {calculateUnpaidFoodWeeks()} week(s) remaining • ${calculateFoodDue().toFixed(2)} still due
                        </p>
                      </div>
                    </div>
                )}

                {/* Other Bills */}
                <div style={{ marginBottom: '10px' }}>
                  <h4 style={{ color: '#1976d2', marginBottom: '10px' }}>Other Monthly Bills</h4>
                  <div style={{ marginLeft: '20px' }}>
                    {family.student_loans > 0 && (
                        <p style={{ margin: '5px 0' }}><b>Student Loans</b> (Pay to U Trust US National Bank): ${Number(family.student_loans).toFixed(2)}</p>
                    )}
                    {family.clothing > 0 && (
                        <p style={{ margin: '5px 0' }}><b>Clothing</b> (Pay to Food-A-Rama Super Center): ${Number(family.clothing).toFixed(2)}</p>
                    )}
                    {family.prescriptions > 0 && (
                        <p style={{ margin: '5px 0' }}><b>Prescriptions</b> (Pay to Food-A-Rama Super Center): ${Number(family.prescriptions).toFixed(2)}</p>
                    )}
                    {family.misc_supercenter > 0 && (
                        <p style={{ margin: '5px 0' }}><b>Miscellaneous</b> (Pay to Food-A-Rama Super Center): ${Number(family.misc_supercenter).toFixed(2)}</p>
                    )}
                    {family.misc_bank > 0 && (
                        <p style={{ margin: '5px 0' }}><b>Miscellaneous</b> (Pay to U Trust US National Bank): ${Number(family.misc_bank).toFixed(2)}</p>
                    )}
                    {family.medical > 0 && (
                        <p style={{ margin: '5px 0' }}><b>Medical</b> (Pay to Community Healthcare): ${Number(family.medical).toFixed(2)}</p>
                    )}
                    {family.credit_card > 0 && (
                        <p style={{ margin: '5px 0' }}><b>Credit Card Minimum Payment</b> (Pay to U Trust US National Bank): ${Number(family.credit_card).toFixed(2)}</p>
                    )}
                    {family.automobile_loan > 0 && (
                        <p style={{ margin: '5px 0' }}><b>Automobile Loan</b> (Pay to U Trust US National Bank): ${Number(family.automobile_loan).toFixed(2)}</p>
                    )}
                  </div>
                </div>

              </div>

              {/* Total Amount Due This Month */}
              <div style={{ backgroundColor: '#ffebee', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#c62828' }}>Total Amount Due</h3>
                <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#c62828' }}>
                  ${(calculateMonthlyBills() + calculateFoodDue()).toFixed(2)}
                </p>

                <p style={{ fontSize: '14px', margin: '5px 0', color:'#666' }}>
                  <b>Total Monthly Bills:</b> ${calculateMonthlyBills().toFixed(2)}
                </p>
                {family.food_weekly > 0 && (
                    <p style={{ fontSize: '14px', margin: '5px 0', color:'#666' }}>
                      <b>Food (Weekly):</b> ${Number(family.food_weekly).toFixed(2)}
                    </p>
                )}

              </div>

            </div>
        )}
      </div>
  )
}