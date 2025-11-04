const connection = require('./connection');
const breeds = require('./breed');

async function get(id) {
    let selectSql = `SELECT
                        b.id as breed_id,
                        b.name as breed, 
                        p.size, 
                        p.color,
                        p.cuteness 
                    FROM puppies p INNER JOIN breeds b ON p.breed_id = b.id
                    WHERE p.id = ?`;
    
    const results = await connection.query(selectSql, [id]);//(error, result) => {
    return results;
    
}
async function getAll(parameters = {}) { 
    let selectSql = `SELECT
                    p.id,
                    b.name as breed, 
                    p.size, 
                    p.color,
                    p.cuteness 
                    FROM puppies p 
                    INNER JOIN breeds b ON p.breed_id = b.id`;
    let whereStatements = [];
    let queryParameters = [];
    
    if(parameters.body !== undefined)
    {
        if (typeof parameters.body.breed !== 'undefined' && parameters.body.breed.length > 0 && parameters.body.breed !== 'null') {
            whereStatements.push('b.id = ?');
            queryParameters.push(parameters.body.breed);
        }
        
        if (typeof parameters.body.size !== 'undefined' && parameters.body.size.length > 0 && parameters.body.size !== 'null') {
            whereStatements.push(`size LIKE ?`);
            queryParameters.push(parameters.body.size + '%');
        }

        if (typeof parameters.body.color !== 'undefined' && parameters.body.color.length > 0 && parameters.body.color !== 'null') {
            whereStatements.push(`color LIKE ?`);
            queryParameters.push(parameters.body.color + '%');
        }

        

        //Dynamically add WHERE expressions to SELECT statements if needed
        if (whereStatements.length > 0) {
            selectSql = selectSql + ' WHERE ' + whereStatements.join(' AND ');
        }

        //Dynamically add ORDER BY expression to SELECT statements if needed
        if (typeof parameters.body.sortOrder !== 'undefined' && parameters.body.sortOrder.length > 0 && typeof parameters.body.sortMethod !== 'undefined' && parameters.body.sortMethod.length > 0) {
            selectSql = selectSql + ` ORDER BY ${parameters.body.sortMethod} ${parameters.body.sortOrder}`;
        }

        //Dynamically add LIMIT expression to SELECT statements if needed
        if (typeof parameters.body.limit !== 'undefined') {
            selectSql = selectSql + ' LIMIT ' + parameters.body.limit;
        }
    }
    const results = await connection.query(selectSql, queryParameters);//(error, result) => {
    return results;
    
}
async function insert(parameters = {}) {
    let insertSql = `INSERT INTO puppies (breed_id, size, color, cuteness) VALUES (?, ?, ?, ?)`;

    let queryParameters = [];
    for (let i = 0; i < parameters.allBreeds.length; i++) {
        if (parameters.allBreeds[i].name.toLowerCase().includes(parameters.body.breed.toLowerCase().trim())) {
            queryParameters.push(parameters.allBreeds[i].id);
            break;
        }
    }

    if (queryParameters.length === 0) {
        await breeds.insert( { body: { name: parameters.body.breed } } );
        queryParameters.push(parameters.allBreeds.length + 1);
    }

    // if (breeds.data.name.includes(request.body.breed)) {
    //     parameters.push(request.body.breed);
    // }

    if (typeof parameters.body.size !== 'undefined' && parameters.body.size.length > 0) {
        queryParameters.push(parameters.body.size);
    }else{
        queryParameters.push(null);
    }

    if (typeof parameters.body.color !== 'undefined' && parameters.body.color.length > 0) {
        queryParameters.push(parameters.body.color);
    }else{
        queryParameters.push(null);
    }
    if (typeof parameters.body.cuteness !== 'undefined' && parameters.body.cuteness.length > 0) {
        queryParameters.push(parameters.body.cuteness);
    }else{
        queryParameters.push(null);
    }

    await connection.query(insertSql, queryParameters);
}
async function edit(parameters = {}) {
    // INSERT statement variables
    let updateSql = `UPDATE puppies SET`;

    let queryParameters = [];



    if (typeof parameters.body.breed !== 'undefined' && parameters.body.breed.length > 0) {

        queryParameters.push(parameters.body.breed);
        updateSql += ` breed_id = ?`;
       
    }

    if (typeof parameters.body.size !== 'undefined' && parameters.body.size.length > 0) {
        if (queryParameters.length > 0) {
            updateSql += `,`;
        }
        updateSql += ` size = ?`;
        queryParameters.push(parameters.body.size);
    }

    if (typeof parameters.body.color !== 'undefined' && parameters.body.color.length > 0) {
        if (queryParameters.length > 0) {
            updateSql += `,`;
        }
        updateSql += ` color = ?`;
        queryParameters.push(parameters.body.color);
    }
    if (typeof parameters.body.cuteness !== 'undefined' && parameters.body.cuteness.length > 0) {
        if (queryParameters.length > 0) {
            updateSql += `,`;
        }
        updateSql += ` cuteness = ?`;
        queryParameters.push(parameters.body.cuteness);
    }

    updateSql += ` WHERE id = ?`;
    queryParameters.push(parameters.body.id);
    await connection.query(updateSql, queryParameters);
}
async function deleteById(id) { 
    let deleteSql = `DELETE FROM puppies WHERE id = ?`;
    await connection.query(deleteSql, [id]);
}

module.exports = {
    get,
    getAll,
    insert,
    edit,
    deleteById
}