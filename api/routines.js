const express = require('express');
const router = express.Router();
const { getAllRoutines, createRoutine } = require('../db/routines');
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
  const { creatorId, isPublic, name, goal } = req.body;
  const id = req.user.id;

  try {
    if (id === creatorId) {
      const routine = await createRoutine({ creatorId, isPublic, name, goal });
      res.send(routine);
      return;
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// PATCH /api/routines/:routineId

// DELETE /api/routines/:routineId

// POST /api/routines/:routineId/activities

module.exports = router;
