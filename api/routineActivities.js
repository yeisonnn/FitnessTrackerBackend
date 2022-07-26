const express = require('express');
const {
  updateRoutineActivity,
  getRoutineActivityById,
  getRoutineById,
  destroyRoutineActivity,
} = require('../db');
const { requireUser } = require('./utils');
const router = express.Router();

// PATCH /api/routine_activities/:routineActivityId
router.patch('/:routineActivityId', requireUser, async (req, res, next) => {
  const { count, duration } = req.body;
  const routineActivity = await getRoutineActivityById(
    req.params.routineActivityId
  );
  const routineId = routineActivity.routineId;
  const routine = await getRoutineById(routineId);
  const activityId = routineActivity.activityId;
  const id = routineActivity.id;
  const username = req.user.username;

  try {
    if (routine.creatorId != req.user.id) {
      next({
        name: 'You are not the Owner',
        message: `User ${username} is not allowed to update ${routine.name}`,
        error: 'There was an error',
      });
    }

    const updatedRoutineActivity = await updateRoutineActivity({
      id,
      routineId,
      activityId,
      count,
      duration,
    });
    res.send({ count, duration });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// DELETE /api/routine_activities/:routineActivityId
router.delete('/:routineActivityId', requireUser, async (req, res, next) => {
  const routineActivity = await getRoutineActivityById(
    req.params.routineActivityId
  );
  const routineId = routineActivity.routineId;
  const routine = await getRoutineById(routineId);
  const username = req.user.username;
  const id = routineActivity.id;

  try {
    if (routine.creatorId != req.user.id) {
      res.status(403);
      next({
        name: 'You are not the Owner',
        message: `User ${username} is not allowed to delete ${routine.name}`,
        error: 'There was an error',
      });
    }
    const removedRoutineActivity = await destroyRoutineActivity(id);
    res.send(routineActivity);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = router;
