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
    let insertSql = `INSERT INTO people (name, family_id, age, is_working, medical_needs) VALUES (?,?,?,?,?)`;
    const body = parameters.body || {};
    const vals = [
        body.name || null,
        body.family_id || null,
        body.age != null ? body.age : null,
        body.is_working ? 1 : 0,
        body.medical_needs || null
    ];
    await connection.query(insertSql, vals);
}

async function edit(parameters = {}) {
    const body = parameters.body || {};
    let updateSql = `UPDATE people SET `;
    const sets = [];
    const params = [];

    if (typeof body.name !== 'undefined') {
        sets.push('name = ?');
        params.push(body.name);
    }
    if (typeof body.family_id !== 'undefined') {
        sets.push('family_id = ?');
        params.push(body.family_id);
    }
    if (typeof body.age !== 'undefined') {
        sets.push('age = ?');
        params.push(body.age);
    }
    if (typeof body.is_working !== 'undefined') {
        sets.push('is_working = ?');
        params.push(body.is_working ? 1 : 0);
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
