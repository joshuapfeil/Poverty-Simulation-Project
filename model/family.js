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
    let insertSql = `INSERT INTO families (name, bank_total) VALUES (?,?)`;
    let queryParameters = [];
    if (typeof parameters.body.name !== 'undefined' && parameters.body.name.length > 0) {
        queryParameters.push(parameters.body.name);
    } else {
        queryParameters.push(null);
    }

    if (typeof parameters.body.bank_total !== 'undefined' && parameters.body.bank_total !== null && parameters.body.bank_total !== '') {
        queryParameters.push(parameters.body.bank_total);
    } else {
        queryParameters.push(0);
    }

    await connection.query(insertSql, queryParameters);
}

async function edit(parameters = {}) {
    let updateSql = `UPDATE families SET `;
    let queryParameters = [];
    let sets = [];

    if (typeof parameters.body.name !== 'undefined' && parameters.body.name.length > 0) {
        sets.push('name = ?');
        queryParameters.push(parameters.body.name);
    }

    if (typeof parameters.body.bank_total !== 'undefined' && parameters.body.bank_total !== null && parameters.body.bank_total !== '') {
        sets.push('bank_total = ?');
        queryParameters.push(parameters.body.bank_total);
    }

    if (sets.length === 0) return;

    updateSql += sets.join(', ');
    updateSql += ' WHERE id = ?';
    queryParameters.push(parameters.body.id);

    await connection.query(updateSql, queryParameters);
}

async function deleteById(id) {
    let deleteSql = `DELETE FROM families WHERE id = ?`;
    await connection.query(deleteSql, [id]);
}

module.exports = {
    get,
    getAll,
    insert,
    edit,
    deleteById
}
