const express = require('express');
const cors = require('cors')
const router = express.Router();
const app = express()

app.use(cors())

// GET /api/health
router.get('/health', cors(), async (req, res, next) => {
res.send(
    "All is well"
    
)
});



const usersRouter = require('./users');
router.use('/users', usersRouter);
const activitiesRouter = require('./activities');
router.use('/activities', activitiesRouter);
const routinesRouter = require('./routines');
router.use('/routines', routinesRouter);
const routineActivitiesRouter = require('./routineActivities');

router.use('/routine_activities', routineActivitiesRouter);

module.exports = router;
