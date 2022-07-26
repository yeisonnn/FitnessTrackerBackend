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
    SELECT * FROM activities
    WHERE name = ${name};
  `);

    return activity;
  } catch (error) {
    throw error;
  }
}

async function attachActivitiesToRoutines(routines) {} //finish later

// check this later
async function updateActivity({ id, name, description }) {
  // don't try to update the id
  // do update the name and description
  // return the updated activity

  try {
    const {
      rows: [activity],
    } = await client.query(
      `
    UPDATE activities
    SET name=$1, description=$2
    WHERE id=$3
    RETURNING *;
`,
      [name, description, id]
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
