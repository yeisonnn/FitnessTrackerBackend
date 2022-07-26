/* eslint-disable no-useless-catch */
const client = require('./client');

async function createRoutine({creatorId, isPublic, name, goal}) {
  try {
    const {
      rows: [routine],
    } = await client.query(
      `INSERT INTO routines("creatorId", "isPublic", name, goal )
      VALUES ($1, $2, $3, $4)
      RETURNING id, "creatorId", "isPublic", name, goal;`,
      [creatorId, isPublic, name, goal]
    );
    return routine;
  } catch (error) {
    throw error;
  }
}

async function getRoutineById(id) {
  try {
    const {
      rows: [routine],
    } = await client.query(`
      SELECT id, name
      FROM routines
      WHERE id=${id}
    `);

    if (!routine) {
      return null;
    }

    return routine[0];
  } catch (error) {
    throw error;
  }
}

async function getRoutinesWithoutActivities() {
  try {
    const { rows: routines } = await client.query(`
          SELECT *
          FROM routines;
        `);
    return routines;
  } catch (error) {
    throw error;
  }
}

async function getAllRoutines() {
  try {
    const { rows } = await client.query(`
          SELECT *
          FROM routines;
        `);
    return rows;
  } catch (error) {
    throw error;
  }
}

async function getAllPublicRoutines() {
  try {
    const { rows: routines } = await client.query(`
          SELECT *
          FROM routines
          WHERE "isPublic" = true;
        `);
    return routines;
  } catch (error) {
    throw error;
  }
}

async function getAllRoutinesByUser({ username }) {
  try {
    const { rows: routines } = await client.query(`
          SELECT *
          FROM routines
          WHERE username = ${username};
        `);
    return routines;
  } catch (error) {
    throw error;
  }
}

async function getPublicRoutinesByUser({ username }) {
  try {
    const { rows: routines } = await client.query(`
          SELECT *
          FROM routines
          WHERE "creatorId" = ${username};
        `);
    return routines;
  } catch (error) {
    throw error;
  }
}

async function getPublicRoutinesByActivity({ id }) {}

async function updateRoutine({ id, ...fields }) {}

async function destroyRoutine(id) {}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
};
