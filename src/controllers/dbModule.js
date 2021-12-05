const mysql2 = require('mysql2');
const fs = require('fs');

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD } = require('../config/app-config');

const sql = fs.readFileSync('./db-setup.sql', 'utf8');

const dbConnection = mysql2.createConnection({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    // database: DB_NAME
});

dbConnection.connect(async function (error) {
    if (error) {
        console.error('error connecting: ' + error.stack);
        process.exit(1);
    }
    console.log('Connected to Database as id ' + dbConnection.threadId);
    console.log('Setting up DB...');

    const queryList = sql.split(';');
    let setupComplete = true;
    for (let query of queryList) {
        if (!query) continue;
        try {
            const result = await dbConnection.promise().query(query);
        } catch (error) {
            console.error(`Error executing SQL script "${query}":`, error);
            setupComplete = false;
            break;
        }
    }
    if (setupComplete) {
        console.log('Database setup complete');
    } else {
        console.error('Unable to setup Database');
        process.exit(1);
    }
});

module.exports = dbConnection;