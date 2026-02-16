/*
    Business logic for financial transactions. Handles all balance calculations,
    validations, and state changes to ensure data integrity. All calculations
    are performed server-side as the single source of truth.
*/

const connection = require('./connection');

/**
 * Deposit funds into family account
 * @param {number} familyId - Family ID
 * @param {number} amount - Deposit amount
 * @returns {object} Updated family data
 */
async function deposit(familyId, amount) {
    // Validate inputs
    if (!familyId || amount <= 0) {
        throw new Error('Invalid family ID or amount');
    }

    // Fetch current family data
    const selectSql = `SELECT * FROM families WHERE id = ?`;
    const families = await connection.query(selectSql, [familyId]);
    
    if (!families || families.length === 0) {
        throw new Error('Family not found');
    }

    const family = families[0];
    const newBalance = (family.bank_total || 0) + amount;

    // Update family balance
    const updateSql = `UPDATE families SET bank_total = ? WHERE id = ?`;
    await connection.query(updateSql, [newBalance, familyId]);

    // Return updated family
    const updated = await connection.query(selectSql, [familyId]);
    return updated[0];
}

/**
 * Withdraw funds from family account
 * @param {number} familyId - Family ID
 * @param {number} amount - Withdrawal amount
 * @returns {object} Updated family data
 */
async function withdraw(familyId, amount) {
    // Validate inputs
    if (!familyId || amount <= 0) {
        throw new Error('Invalid family ID or amount');
    }

    // Fetch current family data
    const selectSql = `SELECT * FROM families WHERE id = ?`;
    const families = await connection.query(selectSql, [familyId]);
    
    if (!families || families.length === 0) {
        throw new Error('Family not found');
    }

    const family = families[0];
    const currentBalance = Number(family.bank_total || 0);

    // Validate sufficient funds
    if (amount > currentBalance) {
        throw new Error(`Insufficient funds. Available: $${currentBalance.toFixed(2)}, Required: $${amount.toFixed(2)}`);
    }

    const newBalance = currentBalance - amount;

    // Update family balance
    const updateSql = `UPDATE families SET bank_total = ? WHERE id = ?`;
    await connection.query(updateSql, [newBalance, familyId]);

    // Return updated family
    const updated = await connection.query(selectSql, [familyId]);
    return updated[0];
}

/**
 * Process employee payment
 * @param {number} familyId - Family ID
 * @param {number} personId - Person ID
 * @param {number} weekNumber - Week (1-4)
 * @param {number} amount - Payment amount
 * @returns {object} Transaction result with updated family and person data
 */
async function payEmployee(familyId, personId, weekNumber, amount) {
    // Validate inputs
    if (!familyId || !personId || !weekNumber || amount <= 0) {
        throw new Error('Invalid parameters for employee payment');
    }

    if (weekNumber < 1 || weekNumber > 4) {
        throw new Error('Week must be between 1 and 4');
    }

    // Fetch person and validate status
    const personSql = `SELECT * FROM people WHERE id = ?`;
    const people = await connection.query(personSql, [personId]);
    
    if (!people || people.length === 0) {
        throw new Error('Person not found');
    }

    const person = people[0];

    // Check if person is fired
    if (person.fired) {
        throw new Error('Cannot deposit - person has been fired');
    }

    // Check if person is on leave
    if (person.on_leave) {
        throw new Error('Cannot deposit - person is on leave');
    }

    // Check if week already paid
    const paidField = `week${weekNumber}_paid`;
    if (person[paidField] === 1) {
        throw new Error('This week has already been paid');
    }

    // Fetch family and update balance
    const familySql = `SELECT * FROM families WHERE id = ?`;
    const families = await connection.query(familySql, [familyId]);
    
    if (!families || families.length === 0) {
        throw new Error('Family not found');
    }

    const family = families[0];
    const newBalance = (family.bank_total || 0) + amount;

    // Update family balance
    const updateFamilySql = `UPDATE families SET bank_total = ? WHERE id = ?`;
    await connection.query(updateFamilySql, [newBalance, familyId]);

    // Mark week as paid for person
    const updatePersonSql = `UPDATE people SET ${paidField} = 1 WHERE id = ?`;
    await connection.query(updatePersonSql, [personId]);

    // Return updated data
    const updatedFamily = await connection.query(familySql, [familyId]);
    const updatedPerson = await connection.query(personSql, [personId]);

    return {
        family: updatedFamily[0],
        person: updatedPerson[0]
    };
}

/**
 * Process utility or loan payment
 * @param {number} familyId - Family ID
 * @param {string} billType - 'gas', 'electric', 'phone', 'autoLoan', 'studentLoan', 'creditCard', 'mortgage', 'taxes', 'maintenance', 'clothing', 'food', 'quikCash', 'prescriptions'
 * @param {number} amount - Payment amount
 * @param {number} week - (optional) Week number for food payments (1-4)
 * @returns {object} Updated family data
 */
async function payBill(familyId, billType, amount, week = null) {
    // Validate inputs
    if (!familyId || !billType || amount <= 0) {
        throw new Error('Invalid parameters for bill payment');
    }

    const validBillTypes = ['gas', 'electric', 'phone', 'autoLoan', 'studentLoan', 'creditCard', 'mortgage', 'taxes', 'maintenance', 'clothing', 'food', 'quikCash', 'prescriptions'];
    if (!validBillTypes.includes(billType)) {
        throw new Error(`Invalid bill type. Must be one of: ${validBillTypes.join(', ')}`);
    }

    // Fetch current family data
    const selectSql = `SELECT * FROM families WHERE id = ?`;
    const families = await connection.query(selectSql, [familyId]);
    
    if (!families || families.length === 0) {
        throw new Error('Family not found');
    }

    const family = families[0];
    const currentBalance = Number(family.bank_total || 0);

    // Validate sufficient funds
    if (amount > currentBalance) {
        throw new Error(`Insufficient funds. Available: $${currentBalance.toFixed(2)}, Required: $${amount.toFixed(2)}`);
    }

    // Validate overpayment on loans and credit cards
    const fieldMap = {
        gas: 'utilities_gas',
        electric: 'utilities_electric',
        phone: 'utilities_phone',
        autoLoan: 'automobile_loan',
        studentLoan: 'student_loans',
        creditCard: 'credit_card',
        mortgage: 'housing_mortgage',
        taxes: 'housing_taxes',
        maintenance: 'housing_maintenance',
        clothing: 'clothing',
        food: 'food_weekly',
        quikCash: 'misc',
        prescriptions: 'prescriptions'
    };

    const dbField = fieldMap[billType];
    const amountOwed = Number(family[dbField] || 0);

    if (['autoLoan', 'studentLoan', 'creditCard', 'mortgage', 'taxes', 'maintenance'].includes(billType)) {
        if (amount > amountOwed) {
            throw new Error(`Cannot pay more than amount owed. Owed: $${amountOwed.toFixed(2)}, Attempted: $${amount.toFixed(2)}`);
        }
    }

    // Calculate new balance and bill amount
    const newBalance = currentBalance - amount;
    const newBillAmount = billType === 'food' ? amountOwed : Math.max(0, amountOwed - amount);

    // Build update statement
    let updateSql = `UPDATE families SET bank_total = ?`;
    let params = [newBalance];

    if (billType === 'food' && week) {
        // For food, mark the specific week as paid
        const weekField = `food_week${week}_paid`;
        updateSql += `, ${weekField} = 1`;
    } else {
        // For other bills, update the bill amount
        updateSql += `, ${dbField} = ?`;
        params.push(newBillAmount);
    }

    updateSql += ` WHERE id = ?`;
    params.push(familyId);

    await connection.query(updateSql, params);

    // Return updated family
    const updated = await connection.query(selectSql, [familyId]);
    return updated[0];
}

/**
 * Set person status (on leave or fired)
 * @param {number} personId - Person ID
 * @param {string} status - 'on_leave' or 'fired'
 * @param {boolean} value - Status value
 * @returns {object} Updated person data
 */
async function setPersonStatus(personId, status, value) {
    if (!personId || !['OnLeave', 'Fired'].includes(status)) {
        throw new Error('Invalid parameters for status update');
    }

    const selectSql = `SELECT * FROM people WHERE id = ?`;
    const people = await connection.query(selectSql, [personId]);
    
    if (!people || people.length === 0) {
        throw new Error('Person not found');
    }

    const updateSql = `UPDATE people SET ${status} = ? WHERE id = ?`;
    await connection.query(updateSql, [value ? 1 : 0, personId]);

    const updated = await connection.query(selectSql, [personId]);
    return updated[0];
}

module.exports = {
    deposit,
    withdraw,
    payEmployee,
    payBill,
    setPersonStatus
};
