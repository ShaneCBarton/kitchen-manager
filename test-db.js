const pool = require('./src/config/database');

async function testDB() {
    try {
        const result = await pool.query('SELECT NOW()');
        console.log('Database time:', result.rows[0]);
        process.exit(0);
    } catch (err) {
        console.error('Database error.', err);
        process.exit(0);
    }
}

testDB();