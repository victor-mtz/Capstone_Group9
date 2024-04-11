const { Pool } = require('pg');
const connectionString =
  process.env.DATABASE_URL || 'postgres://localhost:5432/capstone';
const pool = new Pool({ connectionString });
const query = async (text, params) => {
  try {
    const result = await pool.query(text, params);
    return result;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
};
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
];
const userImages = [
  { user_id: 1, image_data: 'hexadecimal_data_of_image1', image_text: 'empty' },
  { user_id: 2, image_data: 'hexadecimal_data_of_image2', image_text: 'empty' },
];
const createUsersTableQuery = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255)
  );
`;
const createUsersimagesTableQuery = `
  CREATE TABLE IF NOT EXISTS user_images (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    image_data TEXT,
    image_text TEXT
  );
`;

async function dropTables() {
  try {
    console.log('Dropping All Tables...');
    await pool.query(`
    DROP TABLE IF EXISTS user_images;
    DROP TABLE IF EXISTS users;
  `);
  } catch (error) {
    throw error;
  }
}
const createTables = async () => {
  try {
    await pool.query(createUsersTableQuery);
    await pool.query(createUsersimagesTableQuery);
    console.log('Tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
};
const seedDatabase = async () => {
  const client = await pool.connect();
  try {
    // Insert users into the users table
    await dropTables();
    await createTables();
    await Promise.all(
      users.map(async (user) => {
        await client.query(
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
    await Promise.all(
      userImages.map(async (image) => {
        await client.query(
          'INSERT INTO user_images (user_id, image_data, image_text) VALUES ($1, $2, $3)',
          [image.user_id, image.image_data, image.image_text]
        );
      })
    );
    await client.query('COMMIT');
    console.log('Database seeded successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    client.release();
  }
};
seedDatabase()
  .catch((error) => console.error('Error seeding database:', error))
  .finally(() => pool.end());
