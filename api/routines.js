const express = require('express');
const router = express.Router();
const {
  getAllRoutines,
  createRoutine,
  updateRoutine,
  getRoutineById,
  destroyRoutine,
} = require('../db/routines');
const { getUserById } = require('../db/users');
const { UserDoesNotExistError } = require('../errors');
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
  const {isPublic, name, goal } = req.body;
  const routine = await getRoutineById(req.params.routineId);
  const { creatorId } = routine.creatorId;
  const id = routine.id
  const username = req.user.username

  try {
    
    if (routine.creatorId != req.user.id) {
        res.status(403)
          next({
          name: "You are not the Owner",
          message: `User ${username} is not allowed to update ${routine.name}`,
          error: "There was an error",
        })
    } 
    const patchRoutine = await updateRoutine({id, creatorId, isPublic, name, goal});
    
    res.send(patchRoutine)
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
router.delete('/:routineId', requireUser, async (req, res, next)=> {
  const routine = await getRoutineById(req.params.routineId);
  const id = routine.id;
  const username = req.user.username

  try {

    if (routine.creatorId != req.user.id){
      res.status(403)
          next({
          name: "You are not the Owner",
          message: `User ${username} is not allowed to delete ${routine.name}`,
          error: "There was an error",
        })
    }
    if (id){
      const removeRoutine = await destroyRoutine(id)
      res.send(routine)
    }

  } catch ({ name, message }) {
    next({ name, message });
  }
});
// POST /api/routines/:routineId/activities
router.post('/:routineId/activities', requireUser, async (req, res, next)=> {

})

module.exports = router;
