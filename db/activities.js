/* eslint-disable no-useless-catch */
const id = require('faker/lib/locales/id_ID');
const client = require('./client');

// database functions
async function createActivity({ name, description }) {
  // return the new activity
  //eslint-disable-next-line no-useless-catch
  try {
    const {
      rows: [activity],
    } = await client.query(
      `INSERT INTO activities(name, description)
        VALUES ($1, $2)
        RETURNING *;
        `,
      [name, description]
    );
    return activity;
  } catch (error) {
    throw error;
  }
}

async function getAllActivities() {
  // select and return an array of all activities
  try {
    const { rows } = await client.query(
    `SELECT *
    FROM activities;
  `
  );

  return rows;
  } catch (error){
    throw error;
  }
  
}

async function getActivityById(id) {
  try {
    const { rows } = await client.query(`
    SELECT id, name, description FROM activities
    WHERE id=${id};
  `);
    if (!rows.length) {
      return null;
    }
    return rows[0];
  } catch (error) {
    throw error;
  }
}

async function getActivityByName(name) {
  try {
    const {
      rows: [activity],
    } = await client.query(`
    SELECT *
    FROM activities
    WHERE name = $1;`
    ,[name]);
    return activity;
  } catch (error) {
    throw error;
  }
}

async function attachActivitiesToRoutines(routines) {} //finish later


async function updateActivity({ ...fields }) {
  const setString = Object.keys(fields)
  .map((key, index) => `"${key}"=$${index + 1}`)
  .join(", ");
  try {
    const {
      rows: [activity],
    } = await client.query(
      `
    UPDATE activities
    SET ${setString}
    WHERE id=$1
    RETURNING *;
`,
Object.values(fields)
    );
    return activity;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
};
