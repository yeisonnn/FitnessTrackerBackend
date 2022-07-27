/* eslint-disable no-useless-catch */
const client = require('./client');
const bcrypt = require('bcrypt');

// database functions

// user functions
async function createUser({ username, password }) {
  const SALT_COUNT = 10;

  const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
  // eslint-disable-next-line no-useless-catch
  try {
    const {
      rows: [user],
    } = await client.query(
      `INSERT INTO users(username, password)
      VALUES ($1, $2)
      ON CONFLICT (username) DO NOTHING 
      RETURNING username, id;
      `,
      [username, hashedPassword]
    );
    return user;
  } catch (error) {
    throw error;
  }
}
// Return to add try/catch block

async function getUser({ username, password }) {
  try {
    const user = await getUserByUsername(username);
    const hashedPassword = user.password;
    const passwordsMatch = await bcrypt.compare(password, hashedPassword);

    if (passwordsMatch) {
      return user;
    }
  } catch (error) {
    throw error;
  }
}

async function getUserById(userId) {
  // eslint-disable-next-line no-useless-catch
  try {
    const {
      rows: [user],
    } = await client.query(
      `
    SELECT id, username
    FROM users
    WHERE id=$1;
  `,
      [userId]
    );
    return user;
  } catch (error) {
    throw error;
  }
}

async function getUserByUsername(userName) {
  // eslint-disable-next-line no-useless-catch
  try {
    const {
      rows: [user],
    } = await client.query(
      `
        SELECT *
        FROM users
        WHERE username=$1;
      `,
      [userName]
    );

    return user;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
};
