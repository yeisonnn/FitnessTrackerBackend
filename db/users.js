const client = require("./client");

// database functions

// user functions
async function createUser({ username, password }) {
  try {
    const {
      rows: [user]
    } = await client.query(
      `INSERT INTO users(username, password)
      VALUES ($1, $2)
      ON CONFLICT (username) DO NOTHING 
      RETURNING *;
      `,
      [username, password]
    );
    return user;
  }
  catch (error){
    throw error;
  }
}
// Return to add try/catch block

async function getUser({ username, password }) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
        SELECT *
        FROM users
        WHERE username=$1 AND password=$2;
      `,
      [username, password]
    );

    return user;
  } catch (error) {
    throw error;
  }
}

async function getUserById(userId) {

}

async function getUserByUsername(userName) {

}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}
