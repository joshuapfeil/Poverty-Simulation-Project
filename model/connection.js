/*
  This code helps connect to a SQLite database and run queries.
  It makes sure the database file exists and creates the necessary tables (families and people) if they’re missing.
  It provides a function called `query(sql, params)` that you can use to run SQL commands and get results.
  --- Exposes `query(sql, params)` which returns rows as a Promise. ----

*/

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

            // Create families table with bank_total and monthly_bills (if not exists)
            db.run(
                `CREATE TABLE IF NOT EXISTS families (
                    id INTEGER PRIMARY KEY,
                    name TEXT,
                    bank_total REAL DEFAULT 0,
                    monthly_bills REAL DEFAULT 0
                );`
            );

            // Ensure monthly_bills column exists for older DBs (ALTER if required) (MY PRAGMA)
            db.all("PRAGMA table_info(families);", [], (err, cols) => {
                if (!err && Array.isArray(cols)) {
                    const names = cols.map(c => c.name);
                    if (!names.includes('monthly_bills')) {
                        db.run("ALTER TABLE families ADD COLUMN monthly_bills REAL DEFAULT 0;");
                    }
                }
            });

            // Create people table to store household members
            db.run(
                `CREATE TABLE IF NOT EXISTS people (
                    id INTEGER PRIMARY KEY,
                    name TEXT,
                    family_id INTEGER,
                    age INTEGER,
                    is_working INTEGER DEFAULT 0,
                    medical_needs TEXT,
                    FOREIGN KEY(family_id) REFERENCES families(id) ON DELETE CASCADE
                );`
            );
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
