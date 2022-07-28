const express = require('express');
const { updateRoutineActivity } = require('../db');
const { requireUser } = require('./utils');
const router = express.Router();

// PATCH /api/routine_activities/:routineActivityId
// router.patch(':routineActivityId', requireUser, async (req, res, next) =>{
// const {count, duration} = req.body
// const routineActivity = await 
//     try{
    

//         const updatedRoutineActivity = await updateRoutineActivity({ id, routineId, activityId, count, duration })
//         res.send(updateRoutineActivity)

//     } catch ({name, message}){
//         next ({name, message})
//     }
// })

// DELETE /api/routine_activities/:routineActivityId

module.exports = router;
