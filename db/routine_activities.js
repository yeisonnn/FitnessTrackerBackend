/* eslint-disable no-useless-catch */
const client = require("./client");

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
try {
  const {rows: [activity]} = await client.query(`
  INSERT INTO routines_activities("routineId", "activityId", count, duration)
  VALUES ($1, $2, $3, $4)
  RETURNING id, "routineId", "activityId", count, duration;
  `, [routineId, activityId, count, duration]
  )
return activity
} catch (error){
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
    FROM routines_activities
    WHERE id = $1
    `,[id]
  )
return activity
} catch (error){
  throw error;
}
}

async function getRoutineActivitiesByRoutine({ id }) {
  try {
    const {
      rows
    } = await client.query(
      `
      SELECT *
      FROM routines_activities
      WHERE "routineId" = ${id}
      ;`
    )
return rows
  } catch (error){
    throw error;
  }
}

async function updateRoutineActivity({ id, ...fields }) {}

async function destroyRoutineActivity(id) {}

async function canEditRoutineActivity(routineActivityId, userId) {}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
