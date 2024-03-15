const { Pool } = require('pg');

// Define the connection string
const connectionString =
  process.env.DATABASE_URL || 'postgres://localhost:5432/capstone';

// Create a PostgreSQL connection pool
const pool = new Pool({
  connectionString: connectionString,
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false, // For Heroku Postgres, allow SSL connection in production
});

// Function to execute database queries
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
