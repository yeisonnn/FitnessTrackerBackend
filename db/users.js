const client = require('./client');

// database functions

// user functions
async function createUser({ username, password }) {
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
      [username, password]
    );
    return user;
  } catch (error) {
    throw error;
  }
}
// Return to add try/catch block

async function getUser({ username, password }) {
  // eslint-disable-next-line no-useless-catch
  try {
    const {
      rows: [user],
    } = await client.query(
      `
        SELECT username
        FROM users
        WHERE username=$1 AND password=$2;
      `,
      [username, password]
    );
    if (!password) {
      throw {
        name: 'UserNotFoundError',
        message: 'Username or Password is incorrect',
      };
    }
    return user;
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
    SELECT id 
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
