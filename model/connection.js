const sqlite3 = require('sqlite3').verbose();
let db = null;

function query(sql, params) {
    return new Promise((resolve, reject) => {
        // Singleton DB connection
        if (null === db) {
            db = new sqlite3.Database('./model/database.sqlite3', (err) => {
                if (err) {
                    reject(err);
                }
            });
            console.log("Connected to SQLite database.");

            db.run("CREATE TABLE IF NOT EXISTS puppies (id INTEGER PRIMARY KEY, name TEXT, breed_id INTEGER, color TEXT, size TEXT, cuteness INTEGER);");
            db.run("CREATE TABLE IF NOT EXISTS breeds (id INTEGER PRIMARY KEY, name TEXT, average_size INTEGER, typical_color TEXT);");
        }

        db.all(sql, params, (err, rows) => {
            if (err) {
                reject(err);
            }
            resolve(rows);
        });
    });
}

module.exports = {
    query
}
