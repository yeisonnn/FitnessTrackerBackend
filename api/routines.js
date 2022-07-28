const express = require('express');
const router = express.Router();
const {
  getAllRoutines,
  createRoutine,
  updateRoutine,
  getRoutineById,
} = require('../db/routines');
const { getUserById } = require('../db/users');
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
  const userId = await req.user.id;

  try {
    const routine = await getRoutineById(req.params.routineId);
    const { creatorId } = routine;
    const routineName = routine.name;
    const username = await getUserById(req.user.id);
    console.log(userId);

    if (creatorId !== req.user.id) {
      res.status(403);
      return;
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

// POST /api/routines/:routineId/activities

module.exports = router;
