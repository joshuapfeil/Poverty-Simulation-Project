const sqlite3 = require('sqlite3').verbose();
let db = null;

function query(sql, params) {
    return new Promise((resolve, reject) => {
        if (null === db) {
            db = new sqlite3.Database('./model/database.sqlite3', (err) => {
                if (err) {
                    reject(err);
                }
            });
            console.log("Connected to SQLite database.");

            db.run("CREATE TABLE IF NOT EXISTS families (id INTEGER PRIMARY KEY, name TEXT, bank_total INTEGER);");
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
