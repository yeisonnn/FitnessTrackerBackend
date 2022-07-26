const express = require('express');
const router = express.Router();
const {
  getAllRoutines,
  createRoutine,
  updateRoutine,
  getRoutineById,
  destroyRoutine,
} = require('../db/routines');
const {
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  getRoutineActivityById,
} = require('../db/routine_activities');
const { getUserById } = require('../db/users');
const { UserDoesNotExistError, ActivityExistsError } = require('../errors');
const { requireUser } = require('./utils');

// GET /api/routines
router.get('/', async (req, res, next) => {
  try {
    const routines = await getAllRoutines();
    if (routines) {
      res.send(routines);
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// POST /api/routines
router.post('/', requireUser, async (req, res, next) => {
  const { isPublic, name, goal } = req.body;

  try {
    const creatorId = await req.user.id;
    if (creatorId) {
      const routine = await createRoutine({ creatorId, isPublic, name, goal });
      res.send(routine);
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// PATCH /api/routines/:routineId
router.patch('/:routineId', requireUser, async (req, res, next) => {
  const { isPublic, name, goal } = req.body;
  const routine = await getRoutineById(req.params.routineId);
  const { creatorId } = routine.creatorId;
  const id = routine.id;
  const username = req.user.username;

  try {
    if (routine.creatorId != req.user.id) {
      res.status(403);
      next({
        name: 'You are not the Owner',
        message: `User ${username} is not allowed to update ${routine.name}`,
        error: 'There was an error',
      });
    }
    const patchRoutine = await updateRoutine({
      id,
      creatorId,
      isPublic,
      name,
      goal,
    });

    res.send(patchRoutine);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

router.get('/:routineId', async (req, res, next) => {
  try {
    const routine = await getRoutineById(req.params.routineId);
    console.log('RoutineID:::::::::::', routine);
    const { creatorId } = routine;
    console.log('Creator Id******', creatorId);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// DELETE /api/routines/:routineId
router.delete('/:routineId', requireUser, async (req, res, next) => {
  const routine = await getRoutineById(req.params.routineId);
  const id = routine.id;
  const username = req.user.username;

  try {
    if (routine.creatorId != req.user.id) {
      res.status(403);
      next({
        name: 'You are not the Owner',
        message: `User ${username} is not allowed to delete ${routine.name}`,
        error: 'There was an error',
      });
    }
    if (id) {
      const removeRoutine = await destroyRoutine(id);
      res.send(routine);
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});
// POST /api/routines/:routineId/activities
router.post('/:routineId/activities', requireUser, async (req, res, next) => {
  const { activityId, count, duration } = req.body;
  const routineId = req.params.routineId
  const testActivityId = await getRoutineActivityById(activityId)
  try {
    if (testActivityId){
      next({
        name: "Duplicate ActivityId",
        message: `Activity ID ${activityId} already exists in Routine ID ${routineId}`
      })
    } else {
      const attachedRoutine = await addActivityToRoutine({routineId, activityId, duration, count})
      res.send (attachedRoutine)
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = router;

// POST /api/routines/:routineId/activities test will sometimes fail when testing the full back-end. Re-running alone or by api itself will fix it. Consulted instructor and was told to leave this code as it may be the test itself breaking.
