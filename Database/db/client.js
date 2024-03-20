const { Pool } = require('pg');


const connectionString =
  process.env.DATABASE_URL || 'postgres:please@//localhost:5432/capstone';


const pool = new Pool({
  connectionString: connectionString,
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false, 
});


const query = async (text, params) => {
  try {
    const result = await pool.query(text, params);
    return result.rows;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
};

module.exports = { query };
