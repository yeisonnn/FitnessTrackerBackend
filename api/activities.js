const express = require('express');
const router = express.Router();
const {
  getAllActivities,
  createActivity,
  getActivityByName,
  getActivityById,
  updateActivity,
} = require('../db/activities');
const { requireUser } = require("./utils");
// GET /api/activities/:activityId/routines

// GET /api/activities
router.get('/', async (req, res, next) => {
  try {
    const activities = await getAllActivities();
    console.log(activities);
    if (activities) {
      res.send(activities);
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// POST /api/activities
router.post('/', async (req, res, next) => {
  const { name, description } = req.body;

  try {
    const _activity = await getActivityByName(name);

    if (_activity) {
      next({
        name: 'ActivityExistsError',
        message: `An activity with name ${name} already exists`,
        error: 'choose another activity',
      });
      return;
    }
    const activity = await createActivity({ name, description });

    if (activity) {
      res.send(activity);
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// PATCH /api/activities/:activityId

router.patch('/:activityId', async (req, res, next) => {
  const id = req.params.activityId;
  const { name, description } = req.body;
  try {
    const activity = await getActivityById(id);

    if (!activity) {
      next({
        name: 'ActivityExistsError',
        message: `Activity ${id} not found`,
        error: 'choose another activity',
      });
      return;
    }

    const activityName = await getActivityByName(name);
    if (activityName){
      next ({
        name: 'ActivityNameError',
        message: `An activity with name ${name} already exists`,
        error: "Rename activity name"
      })
    }
    const patchActivity = await updateActivity({ id, name, description });

    if (patchActivity) {
      res.send(patchActivity);
    }

    console.log('updateActivity::::::', patchActivity);
  } catch ({ name, message }) {
    next({ name, message });
  }
});


module.exports = router;
