/* eslint-disable no-useless-catch */
const client = require('./client');

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  try {
    const {
      rows: [activity],
    } = await client.query(
      `
  INSERT INTO routine_activities("routineId", "activityId", count, duration)
  VALUES ($1, $2, $3, $4)
  RETURNING id, "routineId", "activityId", count, duration;
  `,
      [routineId, activityId, count, duration]
    );
    return activity;
  } catch (error) {
    throw error;
  }
}

async function getRoutineActivityById(id) {
  try {
    const {
      rows: [activity],
    } = await client.query(
      `
    SELECT *
    FROM routine_activities
    WHERE id = $1
    `,
      [id]
    );
    return activity;
  } catch (error) {
    throw error;
  }
}

async function getRoutineActivitiesByRoutine({ id }) {
  try {
    const {
      rows: [routineActivity],
    } = await client.query(
      `
      SELECT *
      FROM routine_activities
      WHERE "routineId" = ${id}
      ;`
    );
    return routineActivity;
  } catch (error) {
    throw error;
  }
}

async function updateRoutineActivity({ ...fields }) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(', ');
  try {
    const {
      rows: [activity],
    } = await client.query(
      `
    UPDATE routine_activities
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

async function destroyRoutineActivity(id) {
  try {
    const {
      rows: [routineActivity],
    } = await client.query(
      `
      DELETE FROM routine_activities
      WHERE id = $1
      RETURNING *
      ;`,
      [id]
    );
    return routineActivity;
  } catch (error) {
    throw error;
  }
}

async function canEditRoutineActivity(routineActivityId, userId) {
  try {
    const {
      rows: [routineActivity],
    } = await client.query(
      `
      SELECT * FROM routine_activities
      INNER JOIN routines ON routine_activities."routineId" = routines.id
      WHERE routine_activities."activityId" = ${routineActivityId} AND routines."creatorId" = ${userId}
      ;`
    );

    return routineActivity;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
