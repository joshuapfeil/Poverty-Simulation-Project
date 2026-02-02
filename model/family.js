/*
    Data model for `families` table. Provides CRUD functions used by the
    to list, insert, update and delete family records.
*/

const connection = require('./connection');

async function get(id) {
    let selectSql = `SELECT * FROM families WHERE id = ?`;
    const results = await connection.query(selectSql, [id]);
    return results;
}

async function getAll() {
    let selectSql = `SELECT * FROM families`;
    const results = await connection.query(selectSql);
    return results;
}

async function insert(parameters = {}) {
    let insertSql = `INSERT INTO families (
        name, bank_total, monthly_bills,
        housing_mortgage, housing_taxes, housing_maintenance,
        utilities_gas, utilities_electric, utilities_phone,
        student_loans, food_weekly, clothing, credit_card, automobile_loan
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    
    let queryParameters = [];
    const body = parameters.body;
    
    // Name
    queryParameters.push(body.name || null);
    
    // Bank total
    queryParameters.push(body.bank_total != null ? body.bank_total : 0);
    
    // Monthly bills (kept for backward compatibility, but individual bills are preferred)
    queryParameters.push(body.monthly_bills != null ? body.monthly_bills : 0);
    
    // Housing bills
    queryParameters.push(body.housing_mortgage != null ? body.housing_mortgage : 0);
    queryParameters.push(body.housing_taxes != null ? body.housing_taxes : 0);
    queryParameters.push(body.housing_maintenance != null ? body.housing_maintenance : 0);
    
    // Utilities bills
    queryParameters.push(body.utilities_gas != null ? body.utilities_gas : 0);
    queryParameters.push(body.utilities_electric != null ? body.utilities_electric : 0);
    queryParameters.push(body.utilities_phone != null ? body.utilities_phone : 0);
    
    // Other bills
    queryParameters.push(body.student_loans != null ? body.student_loans : 0);
    queryParameters.push(body.food_weekly != null ? body.food_weekly : 0);
    queryParameters.push(body.clothing != null ? body.clothing : 0);
    queryParameters.push(body.credit_card != null ? body.credit_card : 0);
    queryParameters.push(body.automobile_loan != null ? body.automobile_loan : 0);

    await connection.query(insertSql, queryParameters);
}

async function edit(parameters = {}) {
    let updateSql = `UPDATE families SET `;
    let queryParameters = [];
    let sets = [];
    const body = parameters.body;

    // Name
    if (typeof body.name !== 'undefined' && body.name.length > 0) {
        sets.push('name = ?');
        queryParameters.push(body.name);
    }

    // Bank total
    if (typeof body.bank_total !== 'undefined' && body.bank_total !== null && body.bank_total !== '') {
        sets.push('bank_total = ?');
        queryParameters.push(body.bank_total);
    }

    // Monthly bills (kept for backward compatibility)
    if (typeof body.monthly_bills !== 'undefined' && body.monthly_bills !== null && body.monthly_bills !== '') {
        sets.push('monthly_bills = ?');
        queryParameters.push(body.monthly_bills);
    }

    // Housing bills
    if (typeof body.housing_mortgage !== 'undefined' && body.housing_mortgage !== null && body.housing_mortgage !== '') {
        sets.push('housing_mortgage = ?');
        queryParameters.push(body.housing_mortgage);
    }
    if (typeof body.housing_taxes !== 'undefined' && body.housing_taxes !== null && body.housing_taxes !== '') {
        sets.push('housing_taxes = ?');
        queryParameters.push(body.housing_taxes);
    }
    if (typeof body.housing_maintenance !== 'undefined' && body.housing_maintenance !== null && body.housing_maintenance !== '') {
        sets.push('housing_maintenance = ?');
        queryParameters.push(body.housing_maintenance);
    }

    // Utilities bills
    if (typeof body.utilities_gas !== 'undefined' && body.utilities_gas !== null && body.utilities_gas !== '') {
        sets.push('utilities_gas = ?');
        queryParameters.push(body.utilities_gas);
    }
    if (typeof body.utilities_electric !== 'undefined' && body.utilities_electric !== null && body.utilities_electric !== '') {
        sets.push('utilities_electric = ?');
        queryParameters.push(body.utilities_electric);
    }
    if (typeof body.utilities_phone !== 'undefined' && body.utilities_phone !== null && body.utilities_phone !== '') {
        sets.push('utilities_phone = ?');
        queryParameters.push(body.utilities_phone);
    }

    // Food weeks paid
    if (typeof body.food_week1_paid !== 'undefined' && body.food_week1_paid !== null && body.food_week1_paid !== '') {
        sets.push('food_week1_paid = ?');
        queryParameters.push(body.food_week1_paid);
    }
    if (typeof body.food_week2_paid !== 'undefined' && body.food_week2_paid !== null && body.food_week2_paid !== '') {
        sets.push('food_week2_paid = ?');
        queryParameters.push(body.food_week2_paid);
    }
    if (typeof body.food_week3_paid !== 'undefined' && body.food_week3_paid !== null && body.food_week3_paid !== '') {
        sets.push('food_week3_paid = ?');
        queryParameters.push(body.food_week3_paid);
    }
    if (typeof body.food_week4_paid !== 'undefined' && body.food_week4_paid !== null && body.food_week4_paid !== '') {
        sets.push('food_week4_paid = ?');
        queryParameters.push(body.food_week4_paid);
    }

    // Other bills
    if (typeof body.student_loans !== 'undefined' && body.student_loans !== null && body.student_loans !== '') {
        sets.push('student_loans = ?');
        queryParameters.push(body.student_loans);
    }
    if (typeof body.food_weekly !== 'undefined' && body.food_weekly !== null && body.food_weekly !== '') {
        sets.push('food_weekly = ?');
        queryParameters.push(body.food_weekly);
    }
    if (typeof body.clothing !== 'undefined' && body.clothing !== null && body.clothing !== '') {
        sets.push('clothing = ?');
        queryParameters.push(body.clothing);
    }
    if (typeof body.credit_card !== 'undefined' && body.credit_card !== null && body.credit_card !== '') {
        sets.push('credit_card = ?');
        queryParameters.push(body.credit_card);
    }
    if (typeof body.automobile_loan !== 'undefined' && body.automobile_loan !== null && body.automobile_loan !== '') {
        sets.push('automobile_loan = ?');
        queryParameters.push(body.automobile_loan);
    }

    // Misc expenses
    if (typeof body.misc !== 'undefined' && body.misc !== null && body.misc !== '') {
        sets.push('misc = ?');
        queryParameters.push(body.misc);
    }

    // Prescriptions
    if (typeof body.prescriptions !== 'undefined' && body.prescriptions !== null && body.prescriptions !== '') {
        sets.push('prescriptions = ?');
        queryParameters.push(body.prescriptions);
    }

    if (sets.length === 0) return;

    updateSql += sets.join(', ');
    updateSql += ' WHERE id = ?';
    queryParameters.push(body.id);

    await connection.query(updateSql, queryParameters);
}

async function deleteById(id) {
    let deleteSql = `DELETE FROM families WHERE id = ?`;
    await connection.query(deleteSql, [id]);
}

async function getByName(name) {
    let selectSql = `SELECT * FROM families WHERE LOWER(name) = LOWER(?)`;
    const results = await connection.query(selectSql, [name]);
    return results;
}

module.exports = {
    get,
    getAll,
    insert,
    edit,
    deleteById,
    getByName
}