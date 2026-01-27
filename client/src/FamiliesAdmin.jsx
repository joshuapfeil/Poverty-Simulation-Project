/*
  This is the Admin page for managing families. Lists families, allows adding and
  editing of name, bank total and individual bills organized by category.
  Provides a People button to manage household members for each family.
*/

import React, { useEffect, useState } from 'react'
import PeopleManager from './PeopleManager'

export default function FamiliesAdmin() {
  const [families, setFamilies] = useState([])
  const [name, setName] = useState('')
  const [bankTotal, setBankTotal] = useState('')
  
  // Housing bills
  const [housingMortgage, setHousingMortgage] = useState('')
  const [housingTaxes, setHousingTaxes] = useState('')
  const [housingMaintenance, setHousingMaintenance] = useState('')
  
  // Utilities bills
  const [utilitiesGas, setUtilitiesGas] = useState('')
  const [utilitiesElectric, setUtilitiesElectric] = useState('')
  const [utilitiesPhone, setUtilitiesPhone] = useState('')
  
  // Other bills
  const [studentLoans, setStudentLoans] = useState('')
  const [foodWeekly, setFoodWeekly] = useState('')
  const [clothing, setClothing] = useState('')
  const [creditCard, setCreditCard] = useState('')
  const [automobileLoan, setAutomobileLoan] = useState('')
  
  // Edit state
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editBank, setEditBank] = useState('')
  const [editHousingMortgage, setEditHousingMortgage] = useState('')
  const [editHousingTaxes, setEditHousingTaxes] = useState('')
  const [editHousingMaintenance, setEditHousingMaintenance] = useState('')
  const [editUtilitiesGas, setEditUtilitiesGas] = useState('')
  const [editUtilitiesElectric, setEditUtilitiesElectric] = useState('')
  const [editUtilitiesPhone, setEditUtilitiesPhone] = useState('')
  const [editStudentLoans, setEditStudentLoans] = useState('')
  const [editFoodWeekly, setEditFoodWeekly] = useState('')
  const [editClothing, setEditClothing] = useState('')
  const [editCreditCard, setEditCreditCard] = useState('')
  const [editAutomobileLoan, setEditAutomobileLoan] = useState('')
  
  const [showPeople, setShowPeople] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [nameFilter, setNameFilter] = useState('')
  const [minTotal, setMinTotal] = useState('')
  const [maxTotal, setMaxTotal] = useState('')

  const fetchFamilies = () => {
    setLoading(true)
    fetch('/families/')
      .then((r) => r.json())
      .then((j) => setFamilies(j.data || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchFamilies()
  }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      const res = await fetch('/families/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, 
          bank_total: Number(bankTotal) || 0,
          housing_mortgage: Number(housingMortgage) || 0,
          housing_taxes: Number(housingTaxes) || 0,
          housing_maintenance: Number(housingMaintenance) || 0,
          utilities_gas: Number(utilitiesGas) || 0,
          utilities_electric: Number(utilitiesElectric) || 0,
          utilities_phone: Number(utilitiesPhone) || 0,
          student_loans: Number(studentLoans) || 0,
          food_weekly: Number(foodWeekly) || 0,
          clothing: Number(clothing) || 0,
          credit_card: Number(creditCard) || 0,
          automobile_loan: Number(automobileLoan) || 0
        })
      })
      if (!res.ok) {
        const txt = await res.text().catch(() => null)
        throw new Error(txt || `Failed to add family (${res.status})`)
      }
      const json = await res.json()
      setFamilies(json.data || [])
      
      // Reset all form fields
      setName('')
      setBankTotal('')
      setHousingMortgage('')
      setHousingTaxes('')
      setHousingMaintenance('')
      setUtilitiesGas('')
      setUtilitiesElectric('')
      setUtilitiesPhone('')
      setStudentLoans('')
      setFoodWeekly('')
      setClothing('')
      setCreditCard('')
      setAutomobileLoan('')
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/families/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const txt = await res.text().catch(() => null)
        throw new Error(txt || `Failed to delete (${res.status})`)
      }
      const json = await res.json()
      setFamilies(json.data || [])
    } catch (err) {
      setError(err.message)
    }
  }

  const startEdit = (f) => {
    setEditingId(f.id)
    setEditName(f.name || '')
    setEditBank(f.bank_total || '')
    setEditHousingMortgage(f.housing_mortgage || '')
    setEditHousingTaxes(f.housing_taxes || '')
    setEditHousingMaintenance(f.housing_maintenance || '')
    setEditUtilitiesGas(f.utilities_gas || '')
    setEditUtilitiesElectric(f.utilities_electric || '')
    setEditUtilitiesPhone(f.utilities_phone || '')
    setEditStudentLoans(f.student_loans || '')
    setEditFoodWeekly(f.food_weekly || '')
    setEditClothing(f.clothing || '')
    setEditCreditCard(f.credit_card || '')
    setEditAutomobileLoan(f.automobile_loan || '')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditName('')
    setEditBank('')
    setEditHousingMortgage('')
    setEditHousingTaxes('')
    setEditHousingMaintenance('')
    setEditUtilitiesGas('')
    setEditUtilitiesElectric('')
    setEditUtilitiesPhone('')
    setEditStudentLoans('')
    setEditFoodWeekly('')
    setEditClothing('')
    setEditCreditCard('')
    setEditAutomobileLoan('')
  }

  const saveEdit = async (id) => {
    try {
      const res = await fetch(`/families/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: editName, 
          bank_total: Number(editBank) || 0,
          housing_mortgage: Number(editHousingMortgage) || 0,
          housing_taxes: Number(editHousingTaxes) || 0,
          housing_maintenance: Number(editHousingMaintenance) || 0,
          utilities_gas: Number(editUtilitiesGas) || 0,
          utilities_electric: Number(editUtilitiesElectric) || 0,
          utilities_phone: Number(editUtilitiesPhone) || 0,
          student_loans: Number(editStudentLoans) || 0,
          food_weekly: Number(editFoodWeekly) || 0,
          clothing: Number(editClothing) || 0,
          credit_card: Number(editCreditCard) || 0,
          automobile_loan: Number(editAutomobileLoan) || 0
        })
      })
      if (!res.ok) {
        const txt = await res.text().catch(() => null)
        throw new Error(txt || `Failed to save (${res.status})`)
      }
      const json = await res.json()
      setFamilies(json.data || [])
      cancelEdit()
    } catch (err) {
      setError(err.message)
    }
  }

  const filtered = families.filter((f) => {
    if (nameFilter && !f.name.toLowerCase().includes(nameFilter.toLowerCase())) return false
    const total = Number(f.bank_total || 0)
    if (minTotal !== '' && !isNaN(minTotal) && total < Number(minTotal)) return false
    if (maxTotal !== '' && !isNaN(maxTotal) && total > Number(maxTotal)) return false
    return true
  })

  // Helper to calculate total monthly bills from individual bills
  const calculateTotalBills = (family) => {
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

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin – Families</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleAdd} style={{ marginBottom: 20, border: '1px solid #ccc', padding: 20, backgroundColor: '#f9f9f9' }}>
        <h3>Add New Family</h3>
        
        <div style={{ marginBottom: 15 }}>
          <label style={{ display: 'block', fontWeight: 'bold' }}>Family Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} style={{ width: '300px' }} required />
        </div>

        <div style={{ marginBottom: 15 }}>
          <label style={{ display: 'block', fontWeight: 'bold' }}>Bank Total</label>
          <input type="number" step="0.01" value={bankTotal} onChange={(e) => setBankTotal(e.target.value)} style={{ width: '200px' }} />
        </div>

        <h4>Monthly Bills</h4>
        
        {/* Housing Section */}
        <fieldset style={{ marginBottom: 15, padding: 10, border: '1px solid #ddd' }}>
          <legend style={{ fontWeight: 'bold' }}>Housing (Pay to mortgage & realty co.)</legend>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label>Mortgage:</label>
              <input type="number" step="0.01" value={housingMortgage} onChange={(e) => setHousingMortgage(e.target.value)} placeholder="$500.00" style={{ width: '100%' }} />
            </div>
            <div>
              <label>Taxes:</label>
              <input type="number" step="0.01" value={housingTaxes} onChange={(e) => setHousingTaxes(e.target.value)} placeholder="$60.00" style={{ width: '100%' }} />
            </div>
            <div>
              <label>Maintenance:</label>
              <input type="number" step="0.01" value={housingMaintenance} onChange={(e) => setHousingMaintenance(e.target.value)} placeholder="$50.00" style={{ width: '100%' }} />
            </div>
          </div>
        </fieldset>

        {/* Utilities Section */}
        <fieldset style={{ marginBottom: 15, padding: 10, border: '1px solid #ddd' }}>
          <legend style={{ fontWeight: 'bold' }}>Utilities (Pay to utility company)</legend>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label>Gas:</label>
              <input type="number" step="0.01" value={utilitiesGas} onChange={(e) => setUtilitiesGas(e.target.value)} placeholder="$185.00" style={{ width: '100%' }} />
            </div>
            <div>
              <label>Electric:</label>
              <input type="number" step="0.01" value={utilitiesElectric} onChange={(e) => setUtilitiesElectric(e.target.value)} placeholder="$75.00" style={{ width: '100%' }} />
            </div>
            <div>
              <label>Phone:</label>
              <input type="number" step="0.01" value={utilitiesPhone} onChange={(e) => setUtilitiesPhone(e.target.value)} placeholder="$25.00" style={{ width: '100%' }} />
            </div>
          </div>
        </fieldset>

        {/* Other Bills */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15, marginBottom: 15 }}>
          <div>
            <label style={{ fontWeight: 'bold' }}>Student Loans (Pay to bank):</label>
            <input type="number" step="0.01" value={studentLoans} onChange={(e) => setStudentLoans(e.target.value)} placeholder="$100.00" style={{ width: '100%' }} />
          </div>
          <div>
            <label style={{ fontWeight: 'bold' }}>Food (Pay to super center) - Weekly:</label>
            <input type="number" step="0.01" value={foodWeekly} onChange={(e) => setFoodWeekly(e.target.value)} placeholder="$110.00" style={{ width: '100%' }} />
          </div>
          <div>
            <label style={{ fontWeight: 'bold' }}>Clothing (Pay to super center):</label>
            <input type="number" step="0.01" value={clothing} onChange={(e) => setClothing(e.target.value)} placeholder="$40.00" style={{ width: '100%' }} />
          </div>
          <div>
            <label style={{ fontWeight: 'bold' }}>Credit Card Minimum (Pay to bank):</label>
            <input type="number" step="0.01" value={creditCard} onChange={(e) => setCreditCard(e.target.value)} placeholder="$150.00" style={{ width: '100%' }} />
          </div>
          <div>
            <label style={{ fontWeight: 'bold' }}>Automobile Loan (Pay to bank):</label>
            <input type="number" step="0.01" value={automobileLoan} onChange={(e) => setAutomobileLoan(e.target.value)} placeholder="$250.00" style={{ width: '100%' }} />
          </div>
        </div>

        <button type="submit" style={{ padding: '10px 20px', fontSize: '16px' }}>Add Family</button>
      </form>

      <section style={{ marginBottom: 20 }}>
        <h3>Filter Families</h3>
        <input placeholder="Name contains" value={nameFilter} onChange={(e) => setNameFilter(e.target.value)} />
        <input placeholder="Min total" type="number" value={minTotal} onChange={(e) => setMinTotal(e.target.value)} style={{ marginLeft: 8 }} />
        <input placeholder="Max total" type="number" value={maxTotal} onChange={(e) => setMaxTotal(e.target.value)} style={{ marginLeft: 8 }} />
        <button onClick={() => { setNameFilter(''); setMinTotal(''); setMaxTotal('') }} style={{ marginLeft: 8 }}>Clear</button>
      </section>

      {loading && <p>Loading families...</p>}
      {!loading && (
        <ul>
          {filtered.map((f) => (
            <React.Fragment key={f.id}>
              <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div style={{ flex: 1 }}>
                  {editingId === f.id ? (
                    <div style={{ border: '1px solid #ddd', padding: 15, backgroundColor: '#f9f9f9' }}>
                      <div style={{ marginBottom: 10 }}>
                        <label style={{ fontWeight: 'bold' }}>Name:</label>
                        <input value={editName} onChange={(e) => setEditName(e.target.value)} style={{ marginLeft: 8, width: '300px' }} />
                      </div>
                      <div style={{ marginBottom: 10 }}>
                        <label style={{ fontWeight: 'bold' }}>Bank Total:</label>
                        <input value={editBank} onChange={(e) => setEditBank(e.target.value)} type="number" step="0.01" style={{ marginLeft: 8, width: '200px' }} />
                      </div>
                      
                      <h4>Bills</h4>
                      <fieldset style={{ marginBottom: 10, padding: 10 }}>
                        <legend>Housing</legend>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                          <input value={editHousingMortgage} onChange={(e) => setEditHousingMortgage(e.target.value)} placeholder="Mortgage" type="number" step="0.01" />
                          <input value={editHousingTaxes} onChange={(e) => setEditHousingTaxes(e.target.value)} placeholder="Taxes" type="number" step="0.01" />
                          <input value={editHousingMaintenance} onChange={(e) => setEditHousingMaintenance(e.target.value)} placeholder="Maintenance" type="number" step="0.01" />
                        </div>
                      </fieldset>
                      
                      <fieldset style={{ marginBottom: 10, padding: 10 }}>
                        <legend>Utilities</legend>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                          <input value={editUtilitiesGas} onChange={(e) => setEditUtilitiesGas(e.target.value)} placeholder="Gas" type="number" step="0.01" />
                          <input value={editUtilitiesElectric} onChange={(e) => setEditUtilitiesElectric(e.target.value)} placeholder="Electric" type="number" step="0.01" />
                          <input value={editUtilitiesPhone} onChange={(e) => setEditUtilitiesPhone(e.target.value)} placeholder="Phone" type="number" step="0.01" />
                        </div>
                      </fieldset>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                        <input value={editStudentLoans} onChange={(e) => setEditStudentLoans(e.target.value)} placeholder="Student Loans" type="number" step="0.01" />
                        <input value={editFoodWeekly} onChange={(e) => setEditFoodWeekly(e.target.value)} placeholder="Food (weekly)" type="number" step="0.01" />
                        <input value={editClothing} onChange={(e) => setEditClothing(e.target.value)} placeholder="Clothing" type="number" step="0.01" />
                        <input value={editCreditCard} onChange={(e) => setEditCreditCard(e.target.value)} placeholder="Credit Card" type="number" step="0.01" />
                        <input value={editAutomobileLoan} onChange={(e) => setEditAutomobileLoan(e.target.value)} placeholder="Auto Loan" type="number" step="0.01" />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '18px' }}>{f.name}</div>
                      <div>Bank: ${f.bank_total || 0}</div>
                      <div style={{ fontSize: '14px', color: '#666', marginTop: 5 }}>
                        <strong>Monthly Bills Total: ${calculateTotalBills(f).toFixed(2)}</strong>
                        {f.food_weekly > 0 && <span> | Food (weekly): ${f.food_weekly}</span>}
                      </div>
                      <details style={{ fontSize: '13px', marginTop: 5 }}>
                        <summary style={{ cursor: 'pointer', color: '#0066cc' }}>View bill details</summary>
                        <div style={{ marginLeft: 15, marginTop: 5 }}>
                          {f.housing_mortgage > 0 && <div>Housing - Mortgage: ${f.housing_mortgage}</div>}
                          {f.housing_taxes > 0 && <div>Housing - Taxes: ${f.housing_taxes}</div>}
                          {f.housing_maintenance > 0 && <div>Housing - Maintenance: ${f.housing_maintenance}</div>}
                          {f.utilities_gas > 0 && <div>Utilities - Gas: ${f.utilities_gas}</div>}
                          {f.utilities_electric > 0 && <div>Utilities - Electric: ${f.utilities_electric}</div>}
                          {f.utilities_phone > 0 && <div>Utilities - Phone: ${f.utilities_phone}</div>}
                          {f.student_loans > 0 && <div>Student Loans: ${f.student_loans}</div>}
                          {f.clothing > 0 && <div>Clothing: ${f.clothing}</div>}
                          {f.credit_card > 0 && <div>Credit Card: ${f.credit_card}</div>}
                          {f.automobile_loan > 0 && <div>Automobile Loan: ${f.automobile_loan}</div>}
                        </div>
                      </details>
                    </div>
                  )}
                </div>
                <div>
                  {editingId === f.id ? (
                    <>
                      <button onClick={() => saveEdit(f.id)} style={{ padding: '5px 10px' }}>Save</button>
                      <button onClick={cancelEdit} style={{ marginLeft: 8, padding: '5px 10px' }}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEdit(f)} style={{ padding: '5px 10px' }}>Edit</button>
                      <button onClick={() => handleDelete(f.id)} style={{ marginLeft: 8, padding: '5px 10px' }}>Delete</button>
                      <button onClick={() => setShowPeople(prev => ({ ...prev, [f.id]: !prev[f.id] }))} style={{ marginLeft: 8, padding: '5px 10px' }}>People</button>
                    </>
                  )}
                </div>
              </li>
              {showPeople[f.id] && (
                <li style={{ listStyle: 'none' }}>
                  <PeopleManager familyId={f.id} />
                </li>
              )}
            </React.Fragment>
          ))}
        </ul>
      )}
    </div>
  )
}