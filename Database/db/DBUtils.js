// const pool = require('../../db/database');
const { pool } = require('./client');
const bcrypt = require('bcrypt');
const SALT_COUNT = 10;

async function createUser({
  username,
  email,
  password,
  first_name,
  last_name,
}) {
  const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
  try {
    const {
      rows: [user],
    } = await pool.query(
      `
        INSERT INTO users(username, email, password, first_name, last_name)
        VALUES($1, $2, $3, $4, $5)
        ON CONFLICT (username) DO NOTHING
        RETURNING *;
        `,
      [username, email, hashedPassword, first_name, last_name]
    );
    return user;
  } catch (error) {
    throw error;
  }
}

async function getUserByUsername(username, fromRegister) {
  try {
    const {
      rows: [user],
    } = await pool.query(
      `
            SELECT *
            FROM users
            WHERE username=$1
            `,
      [username]
    );
    if (!user && !fromRegister) {
      throw {
        name: 'UserNotFoundError',
        message: 'A user with that username does not exist',
      };
    }
    return user;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createUser,
  getUserByUsername,
};
