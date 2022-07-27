/* eslint-disable no-useless-catch */
const client = require('./client');
const { attachActivitiesToRoutines } = require('./activities');

async function createRoutine({ creatorId, isPublic, name, goal }) {
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
    } = await client.query(
      `
      SELECT * FROM routines
      WHERE id=$1
    `,
      [id]
    );
    return routine;
  } catch (error) {
    throw error;
  }
}
// May have to return rows rather routines
async function getRoutinesWithoutActivities() {
  try {
    const { rows } = await client.query(`
          SELECT *
          FROM routines
          RETURNING *;
        `);
    return rows;
  } catch (error) {
    throw error;
  }
}

async function getAllRoutines() {
  try {
    const { rows } = await client.query(`
    SELECT routines.*, users.username AS "creatorName"
    FROM routines
    INNER JOIN users ON routines."creatorId" = users.id;
    `);

    return attachActivitiesToRoutines(rows);
  } catch (error) {
    throw error;
  }
}

async function getAllPublicRoutines() {
  try {
    const { rows } = await client.query(`
    SELECT users.username AS "creatorName", routines.* FROM users
    INNER JOIN routines ON users.id = routines."creatorId"
    WHERE routines."isPublic" = true;
        `);
    return attachActivitiesToRoutines(rows);
  } catch (error) {
    throw error;
  }
}

async function getAllRoutinesByUser({ username }) {
  try {
    const { rows: routines } = await client.query(
      `
    SELECT routines.*, users.username AS "creatorName"
    FROM routines 
    INNER JOIN users
    ON routines."creatorId"=users.id
    WHERE users.username=$1;
        `,
      [username]
    );
    return attachActivitiesToRoutines(routines);
  } catch (error) {
    throw error;
  }
}

async function getPublicRoutinesByUser({ username }) {
  try {
    const { rows } = await client.query(
      `
      SELECT routines.*, users.username AS "creatorName"
      FROM routines 
      INNER JOIN users
      ON routines."creatorId"=users.id
      WHERE users.username=$1 AND routines."isPublic" = true;
        `,
      [username]
    );

    return attachActivitiesToRoutines(rows);
  } catch (error) {
    throw error;
  }
}

async function getPublicRoutinesByActivity({ id }) {
  try {
    const { rows: routines } = await client.query(
      `
      SELECT routines.*, users.username AS "creatorName"
      FROM routines 
      JOIN routine_activities ON routines_activities."routineId" = routine.id
      JOIN users ON routines."creatorId" = users.id
      WHERE routine_activities."activityId"=$1 AND routines."isPublic" = true;
        `,
      [id]
    );
    return attachActivitiesToRoutines(routines);
  } catch (error) {
    throw error;
  }
}

async function updateRoutine({ id, ...fields }) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(', ');
  try {
    const {
      rows: [routines],
    } = await client.query(
      `
    UPDATE routines
    SET ${setString}
    WHERE id=${id}
    RETURNING *;
`,
      Object.values(fields)
    );
    return routines;
  } catch (error) {
    throw error;
  }
}

async function destroyRoutine(id) {
  await client.query(
    `
      DELETE FROM routine_activities
      WHERE "routineId" = $1;
      `,
    [id]
  );
  await client.query(
    `
      DELETE FROM routines
      WHERE id = $1;`,
    [id]
  );
}
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
