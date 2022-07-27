const express = require('express');
const router = express.Router();

// GET /api/health
router.get('/health', async (req, res, next) => {
  res.json({
    message: 'All is Well',
  });
});

const usersRouter = require('./users');
router.use('/users', usersRouter);
const activitiesRouter = require('./activities');
router.use('/activities', activitiesRouter);
const routinesRouter = require('./routines');
router.use('/routines', routinesRouter);
const routineActivitiesRouter = require('./routineActivities');

router.use('/routine_activities', routineActivitiesRouter);

router.use((error, req, res, next) => {
  res.send({
    name: error.name,
    message: error.message,
    error: error.error,
  });
});

module.exports = router;
