const connection = require('./connection');

async function get(id) {
    let selectSql = `SELECT * FROM breeds WHERE id = ?`;
    const results = await connection.query(selectSql, [id]);
    return results;
}
async function getAll() { 
    let selectSql = `SELECT * FROM breeds`;
    const results = await connection.query(selectSql);
    return results;
    
}
async function insert(parameters = {}) {
    let insertSql = `INSERT INTO breeds (name, average_size, typical_color) VALUES (?,?,?)`;
    let queryParameters = [];
    if (typeof parameters.body.name !== 'undefined' && parameters.body.name.length > 0) {
        queryParameters.push(parameters.body.name);
    }else{
        queryParameters.push(null);
    }

    if (typeof parameters.body.typical_color !== 'undefined' && parameters.body.typical_color.length > 0) {
        queryParameters.push(parameters.body.typical_color);
    }else{
        queryParameters.push(null);
    }
    if (typeof parameters.body.average_size !== 'undefined' && parameters.body.average_size.length > 0) {
        queryParameters.push(parameters.body.average_size);
    }else{
        queryParameters.push(null);
    }
    await connection.query(insertSql, queryParameters);
}
async function edit(parameters = {}) { }
async function deleteById(id) { }

module.exports = {
    get,
    getAll,
    insert,
    edit,
    deleteById
}