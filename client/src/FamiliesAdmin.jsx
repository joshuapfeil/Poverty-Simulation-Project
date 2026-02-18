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
  // Additional fields admin should be able to manage
  const [misc, setMisc] = useState('')
  const [prescriptions, setPrescriptions] = useState('')
  const [medical, setMedical] = useState('')
  // Food-week paid flags (admin can toggle these)
  const [foodWeek1Paid, setFoodWeek1Paid] = useState(false)
  const [foodWeek2Paid, setFoodWeek2Paid] = useState(false)
  const [foodWeek3Paid, setFoodWeek3Paid] = useState(false)
  const [foodWeek4Paid, setFoodWeek4Paid] = useState(false) 

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
  // Edit-mode fields for misc/prescriptions/medical and food-week paid flags
  const [editMisc, setEditMisc] = useState('')
  const [editPrescriptions, setEditPrescriptions] = useState('')
  const [editMedical, setEditMedical] = useState('')
  const [editFoodWeek1Paid, setEditFoodWeek1Paid] = useState(false)
  const [editFoodWeek2Paid, setEditFoodWeek2Paid] = useState(false)
  const [editFoodWeek3Paid, setEditFoodWeek3Paid] = useState(false)
  const [editFoodWeek4Paid, setEditFoodWeek4Paid] = useState(false) 

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

    // Prevent negative monetary values on the client
    const negativeDetected = [bankTotal, housingMortgage, housingTaxes, housingMaintenance, utilitiesGas, utilitiesElectric, utilitiesPhone, studentLoans, foodWeekly, clothing, creditCard, automobileLoan, misc, prescriptions, medical]
      .some(v => v !== '' && !isNaN(v) && Number(v) < 0)
    if (negativeDetected) {
      setError('Monetary values cannot be negative')
      return
    }

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
          automobile_loan: Number(automobileLoan) || 0,
          misc: Number(misc) || 0,
          prescriptions: Number(prescriptions) || 0,
          medical: Number(medical) || 0,
          food_week1_paid: foodWeek1Paid ? 1 : 0,
          food_week2_paid: foodWeek2Paid ? 1 : 0,
          food_week3_paid: foodWeek3Paid ? 1 : 0,
          food_week4_paid: foodWeek4Paid ? 1 : 0
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
      setMisc('')
      setPrescriptions('')
      setMedical('')
      setFoodWeek1Paid(false)
      setFoodWeek2Paid(false)
      setFoodWeek3Paid(false)
      setFoodWeek4Paid(false) 
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
    setEditMisc(f.misc || '')
    setEditPrescriptions(f.prescriptions || '')
    setEditMedical(f.medical || '')
    setEditFoodWeek1Paid(Boolean(f.food_week1_paid))
    setEditFoodWeek2Paid(Boolean(f.food_week2_paid))
    setEditFoodWeek3Paid(Boolean(f.food_week3_paid))
    setEditFoodWeek4Paid(Boolean(f.food_week4_paid)) 
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
    setEditMisc('')
    setEditPrescriptions('')
    setEditMedical('')
    setEditFoodWeek1Paid(false)
    setEditFoodWeek2Paid(false)
    setEditFoodWeek3Paid(false)
    setEditFoodWeek4Paid(false) 
  }

  const saveEdit = async (id) => {
    // Client-side validation for negative monetary values
    const negativeDetected = [editBank, editHousingMortgage, editHousingTaxes, editHousingMaintenance, editUtilitiesGas, editUtilitiesElectric, editUtilitiesPhone, editStudentLoans, editFoodWeekly, editClothing, editCreditCard, editAutomobileLoan, editMisc, editPrescriptions, editMedical]
      .some(v => v !== '' && !isNaN(v) && Number(v) < 0)
    if (negativeDetected) {
      setError('Monetary values cannot be negative')
      return
    }

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
          automobile_loan: Number(editAutomobileLoan) || 0,
          misc: Number(editMisc) || 0,
          prescriptions: Number(editPrescriptions) || 0,
          medical: Number(editMedical) || 0,
          food_week1_paid: editFoodWeek1Paid ? 1 : 0,
          food_week2_paid: editFoodWeek2Paid ? 1 : 0,
          food_week3_paid: editFoodWeek3Paid ? 1 : 0,
          food_week4_paid: editFoodWeek4Paid ? 1 : 0
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
      (Number(family.prescriptions) || 0) +
      (Number(family.misc) || 0) +
      (Number(family.medical) || 0) +
      (Number(family.credit_card) || 0) +
      (Number(family.automobile_loan) || 0)
    )
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin – Families</h1>


      <form id="section" onSubmit={handleAdd} style={{ marginBottom: 20, border: '1px solid #ccc', padding: 20, backgroundColor: '#f9f9f9' }}>

        <h3>Add New Family</h3>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, }}>
          <div style={{ marginBottom: 15, }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>Family Name: </label>
            <input value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%' }} required />
          </div>

          <div style={{ marginBottom: 15 }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>Bank Total: </label>
            <input type="number" min="0" step="0.01" value={bankTotal} onChange={(e) => setBankTotal(e.target.value)} style={{ width: '100%' }} />
          </div>
        </div>

        <br></br>

        {/* Housing Section */}
        <fieldset style={{ marginBottom: 15, padding: 10, border: '1px solid #ddd' }}>
          <legend style={{ fontWeight: 'bold' }}>Housing (Pay to Sweaney Mortgage & Realty)</legend>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label>Mortgage/Rent:</label>
              <input type="number" min="0" step="0.01" value={housingMortgage} onChange={(e) => setHousingMortgage(e.target.value)} placeholder="$500.00" style={{ width: '100%' }} />
            </div>
            <div>
              <label>Taxes:</label>
              <input type="number" min="0" step="0.01" value={housingTaxes} onChange={(e) => setHousingTaxes(e.target.value)} placeholder="$60.00" style={{ width: '100%' }} />
            </div>
            <div>
              <label>Maintenance:</label>
              <input type="number" min="0" step="0.01" value={housingMaintenance} onChange={(e) => setHousingMaintenance(e.target.value)} placeholder="$50.00" style={{ width: '100%' }} />
            </div>
          </div>
        </fieldset>

        {/* Utilities Section */}
        <fieldset style={{ marginBottom: 15, padding: 10, border: '1px solid #ddd' }}>
          <legend style={{ fontWeight: 'bold' }}>Utilities (Pay to Friendly Utility Company)</legend>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label>Gas:</label>
              <input type="number" min="0" step="0.01" value={utilitiesGas} onChange={(e) => setUtilitiesGas(e.target.value)} placeholder="$185.00" style={{ width: '100%' }} />
            </div>
            <div>
              <label>Electric:</label>
              <input type="number" min="0" step="0.01" value={utilitiesElectric} onChange={(e) => setUtilitiesElectric(e.target.value)} placeholder="$75.00" style={{ width: '100%' }} />
            </div>
            <div>
              <label>Phone:</label>
              <input type="number" min="0" step="0.01" value={utilitiesPhone} onChange={(e) => setUtilitiesPhone(e.target.value)} placeholder="$25.00" style={{ width: '100%' }} />
            </div>
          </div>
        </fieldset>

        {/* Other Bills */}
        <fieldset style={{ marginBottom: 15, padding: 10, border: '1px solid #ddd' }}>
          <legend style={{ fontWeight: 'bold' }}>Other Bills</legend>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15, marginBottom: 15 }}>
            <div>
              <label>Student Loans:</label>
              <input type="number" min="0" step="0.01" value={studentLoans} onChange={(e) => setStudentLoans(e.target.value)} placeholder="$100.00" style={{ width: '100%' }} />
            </div>
            <div>
              <label>Food - Weekly:</label>
              <input type="number" min="0" step="0.01" value={foodWeekly} onChange={(e) => setFoodWeekly(e.target.value)} placeholder="$110.00" style={{ width: '100%' }} />
            </div>
            <div>
              <label>Clothing:</label>
              <input type="number" min="0" step="0.01" value={clothing} onChange={(e) => setClothing(e.target.value)} placeholder="$40.00" style={{ width: '100%' }} />
            </div>
            <div>
              <label>Prescriptions:</label>
              <input type="number" min="0" step="0.01" value={prescriptions} onChange={(e) => setPrescriptions(e.target.value)} placeholder="$25.00" style={{ width: '100%' }} />
            </div>
            <div>
              <label>Miscellaneous:</label>
              <input type="number" min="0" step="0.01" value={misc} onChange={(e) => setMisc(e.target.value)} placeholder="$15.00" style={{ width: '100%' }} />
            </div>
            <div>
              <label>Medical (owed):</label>
              <input type="number" min="0" step="0.01" value={medical} onChange={(e) => setMedical(e.target.value)} placeholder="$0.00" style={{ width: '100%' }} />
            </div>
            <div>
              <label>Credit Card Minimum:</label>
              <input type="number" min="0" step="0.01" value={creditCard} onChange={(e) => setCreditCard(e.target.value)} placeholder="$150.00" style={{ width: '100%' }} />
            </div>
            <div>
              <label>Automobile Loan:</label>
              <input type="number" min="0" step="0.01" value={automobileLoan} onChange={(e) => setAutomobileLoan(e.target.value)} placeholder="$250.00" style={{ width: '100%' }} />
            </div>
          </div>

          {/* Food weeks paid - admin can toggle these when creating a family */}
          <div style={{ marginTop: 10 }}>
            <label style={{ marginRight: 8 }}>Food weeks already paid:</label>
            <label style={{ marginRight: 8 }}><input type="checkbox" checked={foodWeek1Paid} onChange={(e) => setFoodWeek1Paid(e.target.checked)} /> W1</label>
            <label style={{ marginRight: 8 }}><input type="checkbox" checked={foodWeek2Paid} onChange={(e) => setFoodWeek2Paid(e.target.checked)} /> W2</label>
            <label style={{ marginRight: 8 }}><input type="checkbox" checked={foodWeek3Paid} onChange={(e) => setFoodWeek3Paid(e.target.checked)} /> W3</label>
            <label><input type="checkbox" checked={foodWeek4Paid} onChange={(e) => setFoodWeek4Paid(e.target.checked)} /> W4</label>
          </div>
        </fieldset>

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
                        <input value={editBank} onChange={(e) => setEditBank(e.target.value)} type="number" min="0" step="0.01" style={{ marginLeft: 8, width: '200px' }} />
                      </div>

                      <h4>Bills</h4>
                      <fieldset style={{ marginBottom: 10, padding: 10 }}>
                        <legend>Housing</legend>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                          <input value={editHousingMortgage} onChange={(e) => setEditHousingMortgage(e.target.value)} placeholder="Mortgage" type="number" min="0" step="0.01" />
                          <input value={editHousingTaxes} onChange={(e) => setEditHousingTaxes(e.target.value)} placeholder="Taxes" type="number" step="0.01" />
                          <input value={editHousingMaintenance} onChange={(e) => setEditHousingMaintenance(e.target.value)} placeholder="Maintenance" type="number" step="0.01" />
                        </div>
                      </fieldset>

                      <fieldset style={{ marginBottom: 10, padding: 10 }}>
                        <legend>Utilities</legend>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                          <input value={editUtilitiesGas} onChange={(e) => setEditUtilitiesGas(e.target.value)} placeholder="Gas" type="number" min="0" step="0.01" />
                          <input value={editUtilitiesElectric} onChange={(e) => setEditUtilitiesElectric(e.target.value)} placeholder="Electric" type="number" step="0.01" />
                          <input value={editUtilitiesPhone} onChange={(e) => setEditUtilitiesPhone(e.target.value)} placeholder="Phone" type="number" step="0.01" />
                        </div>
                      </fieldset>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                        <input value={editStudentLoans} onChange={(e) => setEditStudentLoans(e.target.value)} placeholder="Student Loans" type="number" step="0.01" />
                        <input value={editFoodWeekly} onChange={(e) => setEditFoodWeekly(e.target.value)} placeholder="Food (weekly)" type="number" step="0.01" />
                        <input value={editClothing} onChange={(e) => setEditClothing(e.target.value)} placeholder="Clothing" type="number" step="0.01" />
                          <input value={editPrescriptions} onChange={(e) => setEditPrescriptions(e.target.value)} placeholder="Prescriptions" type="number" min="0" step="0.01" />
                          <input value={editMisc} onChange={(e) => setEditMisc(e.target.value)} placeholder="Misc" type="number" min="0" step="0.01" />
                          <input value={editMedical} onChange={(e) => setEditMedical(e.target.value)} placeholder="Medical (owed)" type="number" step="0.01" />
                          <input value={editCreditCard} onChange={(e) => setEditCreditCard(e.target.value)} placeholder="Credit Card" type="number" step="0.01" />
                          <input value={editAutomobileLoan} onChange={(e) => setEditAutomobileLoan(e.target.value)} placeholder="Auto Loan" type="number" step="0.01" />
                        </div>

                        <div style={{ marginTop: 10 }}>
                          <label style={{ marginRight: 8 }}>Food weeks paid:</label>
                          <label style={{ marginRight: 8 }}><input type="checkbox" checked={editFoodWeek1Paid} onChange={(e) => setEditFoodWeek1Paid(e.target.checked)} /> W1</label>
                          <label style={{ marginRight: 8 }}><input type="checkbox" checked={editFoodWeek2Paid} onChange={(e) => setEditFoodWeek2Paid(e.target.checked)} /> W2</label>
                          <label style={{ marginRight: 8 }}><input type="checkbox" checked={editFoodWeek3Paid} onChange={(e) => setEditFoodWeek3Paid(e.target.checked)} /> W3</label>
                          <label><input type="checkbox" checked={editFoodWeek4Paid} onChange={(e) => setEditFoodWeek4Paid(e.target.checked)} /> W4</label>
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
                          {f.prescriptions > 0 && <div>Prescriptions: ${f.prescriptions}</div>}
                          {f.misc > 0 && <div>Miscellaneous: ${f.misc}</div>}
                          {f.medical > 0 && <div>Medical: ${f.medical}</div>}
                          {f.credit_card > 0 && <div>Credit Card: ${f.credit_card}</div>}
                          {f.automobile_loan > 0 && <div>Automobile Loan: ${f.automobile_loan}</div>}
                          {(f.food_week1_paid === 1 || f.food_week2_paid === 1 || f.food_week3_paid === 1 || f.food_week4_paid === 1) && (
                            <div style={{ marginTop: 8 }}>
                              Food Weeks Paid: {f.food_week1_paid === 1 ? 'W1 ' : ''}{f.food_week2_paid === 1 ? 'W2 ' : ''}{f.food_week3_paid === 1 ? 'W3 ' : ''}{f.food_week4_paid === 1 ? 'W4' : ''}
                            </div>
                          )}
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