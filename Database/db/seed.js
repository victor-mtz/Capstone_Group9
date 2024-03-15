const { Pool } = require('pg');

// Retrieve database connection string from environment variable or use a default value
const connectionString =
  process.env.DATABASE_URL || 'postgres://localhost:5432/capstone';

// Create a PostgreSQL connection pool
const pool = new Pool({ connectionString });

// execute database queries
const query = async (text, params) => {
  try {
    const result = await pool.query(text, params);
    return result;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
};

// Define seed data
const users = [
  {
    username: 'user1',
    email: 'user1@example.com',
    password: 'password1',
    first_name: 'John',
    last_name: 'Doe',
  },
  {
    username: 'user2',
    email: 'user2@example.com',
    password: 'password2',
    first_name: 'Jane',
    last_name: 'Doe',
  },
  // Add more users as needed
];

const userImages = [
  { user_id: 1, image_data: 'hexadecimal_data_of_image1' },
  { user_id: 2, image_data: 'hexadecimal_data_of_image2' },
];

// Define SQL queries for creating tables
const createUsersTableQuery = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255)
  );
`;
const createUsersimagesTableQuery = `
  CREATE TABLE user_images (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    image_data TEXT NOT NULL  
  );
`;
const createTables = async () => {
  try {
    await pool.query(createUsersTableQuery);
    await pool.query(createUsersimagesTableQuery);
    console.log('Tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
  }
};

// Function to seed the database with data
const seedDatabase = async () => {
  try {
    // Insert users into the users table
    await createTables();
    await Promise.all(
      users.map(async (user) => {
        await query(
          'INSERT INTO users (username, email, password, first_name, last_name) VALUES ($1, $2, $3, $4, $5)',
          [
            user.username,
            user.email,
            user.password,
            user.first_name,
            user.last_name,
          ]
        );
      })
    );

    // Insert user images into the user_images table
    await Promise.all(
      userImages.map(async (image) => {
        await query(
          'INSERT INTO user_images (user_id, image_data) VALUES ($1, $2)',
          [image.user_id, image.image_data]
        );
      })
    );

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    pool.end();
  }
};

seedDatabase();
