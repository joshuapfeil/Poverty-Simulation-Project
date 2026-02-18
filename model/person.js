/*
    Data model for `people` table. Provides get/getAll/insert/edit/deleteById
    used by the server API to manage household members linked to families.
*/

const connection = require('./connection');

async function get(id) {
    let selectSql = `SELECT * FROM people WHERE id = ?`;
    const results = await connection.query(selectSql, [id]);
    return results;
}

async function getAll(filter = {}) {
    let selectSql = `SELECT * FROM people`;
    const params = [];
    if (filter.family_id) {
        selectSql += ` WHERE family_id = ?`;
        params.push(filter.family_id);
    }
    const results = await connection.query(selectSql, params);
    return results;
}

async function insert(parameters = {}) {
    // Insert using the actual `people` table columns (first_name / last_name / Week1Pay..Week4Pay / OnLeave / Fired)
    let insertSql = `INSERT INTO people (
        first_name, last_name, family_id, Week1Pay, Week2Pay, Week3Pay, Week4Pay, OnLeave, Fired
    ) VALUES (?,?,?,?,?,?,?,?,?)`;
    const body = parameters.body || {};
    const vals = [
        body.first_name || null,
        body.last_name || null,
        body.family_id || null,
        body.Week1Pay != null ? Number(body.Week1Pay) : 0,
        body.Week2Pay != null ? Number(body.Week2Pay) : 0,
        body.Week3Pay != null ? Number(body.Week3Pay) : 0,
        body.Week4Pay != null ? Number(body.Week4Pay) : 0,
        body.OnLeave ? 1 : 0,
        body.Fired ? 1 : 0
    ];
    await connection.query(insertSql, vals);
} 

async function edit(parameters = {}) {
    const body = parameters.body || {};
    let updateSql = `UPDATE people SET `;
    const sets = [];
    const params = [];

    // First / last name
    if (typeof body.first_name !== 'undefined') {
        sets.push('first_name = ?');
        params.push(body.first_name);
    }
    if (typeof body.last_name !== 'undefined') {
        sets.push('last_name = ?');
        params.push(body.last_name);
    }

    if (typeof body.family_id !== 'undefined') {
        sets.push('family_id = ?');
        params.push(body.family_id);
    }

    // Weekly pay flags / amounts (admin should be able to set or clear these)
    if (typeof body.Week1Pay !== 'undefined') {
        sets.push('Week1Pay = ?');
        params.push(Number(body.Week1Pay) || 0);
    }
    if (typeof body.Week2Pay !== 'undefined') {
        sets.push('Week2Pay = ?');
        params.push(Number(body.Week2Pay) || 0);
    }
    if (typeof body.Week3Pay !== 'undefined') {
        sets.push('Week3Pay = ?');
        params.push(Number(body.Week3Pay) || 0);
    }
    if (typeof body.Week4Pay !== 'undefined') {
        sets.push('Week4Pay = ?');
        params.push(Number(body.Week4Pay) || 0);
    }

    // Support legacy boolean "paid" flags (week1_paid) so admin can clear/set them
    if (typeof body.week1_paid !== 'undefined') {
        sets.push('week1_paid = ?');
        params.push(body.week1_paid ? 1 : 0);
    }
    if (typeof body.week2_paid !== 'undefined') {
        sets.push('week2_paid = ?');
        params.push(body.week2_paid ? 1 : 0);
    }
    if (typeof body.week3_paid !== 'undefined') {
        sets.push('week3_paid = ?');
        params.push(body.week3_paid ? 1 : 0);
    }
    if (typeof body.week4_paid !== 'undefined') {
        sets.push('week4_paid = ?');
        params.push(body.week4_paid ? 1 : 0);
    }

    if (typeof body.OnLeave !== 'undefined') {
        sets.push('OnLeave = ?');
        params.push(body.OnLeave ? 1 : 0);
    }
    if (typeof body.Fired !== 'undefined') {
        sets.push('Fired = ?');
        params.push(body.Fired ? 1 : 0);
    }
    if (typeof body.medical_needs !== 'undefined') {
        sets.push('medical_needs = ?');
        params.push(body.medical_needs);
    }

    if (sets.length === 0) return;
    updateSql += sets.join(', ');
    updateSql += ' WHERE id = ?';
    params.push(body.id);

    await connection.query(updateSql, params);
}

async function deleteById(id) {
    let deleteSql = `DELETE FROM people WHERE id = ?`;
    await connection.query(deleteSql, [id]);
}

module.exports = {
    get,
    getAll,
    insert,
    edit,
    deleteById
}
