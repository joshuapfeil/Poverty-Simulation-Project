/*
  This code helps connect to a SQLite database and run queries.
  It makes sure the database file exists and creates the necessary tables (families and people) if they're missing.
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

            // Create families table with bank_total and individual bill fields
            db.run(
                `CREATE TABLE IF NOT EXISTS families (
                    id INTEGER PRIMARY KEY,
                    name TEXT,
                    bank_total REAL DEFAULT 0,
                    food_week1_paid REAL DEFAULT 0,
                    food_week2_paid REAL DEFAULT 0,
                    food_week3_paid REAL DEFAULT 0,
                    food_week4_paid REAL DEFAULT 0,
                    monthly_bills REAL DEFAULT 0,
                    housing_mortgage REAL DEFAULT 0,
                    housing_taxes REAL DEFAULT 0,
                    housing_maintenance REAL DEFAULT 0,
                    utilities_gas REAL DEFAULT 0,
                    utilities_electric REAL DEFAULT 0,
                    utilities_phone REAL DEFAULT 0,
                    student_loans REAL DEFAULT 0,
                    food_weekly REAL DEFAULT 0,
                    clothing REAL DEFAULT 0,
                    credit_card REAL DEFAULT 0,
                    automobile_loan REAL DEFAULT 0,
                    misc_supercenter REAL DEFAULT 0,
                    misc_bank REAL DEFAULT 0,
                    prescriptions REAL DEFAULT 0
                );`
            );

            // Ensure all bill columns exist for older DBs (ALTER if required)
            db.all("PRAGMA table_info(families);", [], (err, cols) => {
                if (!err && Array.isArray(cols)) {
                    const names = cols.map(c => c.name);
                    const columnsToAdd = [
                        'monthly_bills',
                        'food_week1_paid',
                        'food_week2_paid',
                        'food_week3_paid',
                        'food_week4_paid',
                        'housing_mortgage',
                        'housing_taxes',
                        'housing_maintenance',
                        'utilities_gas',
                        'utilities_electric',
                        'utilities_phone',
                        'student_loans',
                        'food_weekly',
                        'clothing',
                        'credit_card',
                        'automobile_loan',
                        'misc_supercenter',
                        'misc_bank',
                        'prescriptions',
                    ];
                    
                    columnsToAdd.forEach(col => {
                        if (!names.includes(col)) {
                            db.run(`ALTER TABLE families ADD COLUMN ${col} REAL DEFAULT 0;`);
                            console.log(`Added column: ${col}`);
                        }
                    });
                }
            });

            // Create people table to store household members
            db.run(
                `CREATE TABLE IF NOT EXISTS people (
                    id INTEGER PRIMARY KEY,
                    first_name TEXT,
                    last_name TEXT,
                    family_id INTEGER,
                    Week1Pay INTEGER DEFAULT 0,
                    Week2Pay INTEGER DEFAULT 0,
                    Week3Pay INTEGER DEFAULT 0,
                    Week4Pay INTEGER DEFAULT 0,
                    OnLeave BOOLEAN DEFAULT 0,
                    Fired BOOLEAN DEFAULT 0,
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