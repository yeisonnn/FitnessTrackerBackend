const express = require('express');
const router = express.Router();
const {
  getAllRoutines,
  createRoutine,
  updateRoutine,
  getRoutineById,
} = require('../db/routines');
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
  const id = req.params.routineId;
  const { userId } = req.user;
  const { isPublic, name, goal } = req.body;

  try {
    const routineId = await getRoutineById(id);
    const { creatorId } = routineId;

    if (creatorId !== userId) {
      next({
        name: 'RoutineDoesNotExist',
        message: `this routine is not yours`,
        error: "This routine doesn't exist",
      });
    }
    const patchRoutine = await updateRoutine({
      userId,
      isPublic,
      name,
      goal,
    });

    if (patchRoutine) {
      res.send(patchRoutine);
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// DELETE /api/routines/:routineId

// POST /api/routines/:routineId/activities

module.exports = router;
