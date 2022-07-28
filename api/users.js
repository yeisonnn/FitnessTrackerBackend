/* eslint-disable no-useless-catch */
require('dotenv').config();
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const {
  getAllRoutinesByUser,
  getUserById,
  getPublicRoutinesByUser,
} = require('../db');
const { JWT_SECRET } = process.env;
const { getUserByUsername, createUser } = require('../db/users');
const { requireUser } = require("./utils");

router.use((req, res, next) => {
  console.log('A request is being made to /users');

  next();
});

// POST /api/users/register
router.post('/register', async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const _user = await getUserByUsername(username);

    if (_user) {
      next({
        name: 'UserExistsError',
        message: `User ${username} is already taken.`
      });
    }
    if (password.length < 8) {
      next({
        name: 'PasswordError',
        message: 'Password Too Short!'
      });
    }

    

    const user = await createUser({
      username,
      password,
    });

    const token = jwt.sign(
      {
        id: user.id,
        username,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1w',
      }
    );

    res.send({
      message: 'thank you for signing up',
      token,
      user
    });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// POST /api/users/login
router.post('/login', async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    next({
      name: 'MissingCredentialsError',
      message: 'Please supply both a username and password',
    });
  }

  try {
    const user = await getUserByUsername(username);
    if (user.username == username) {
      const token = jwt.sign(
        { id: user.id, username: user.username },
        JWT_SECRET
      );
      res.send({
        message: "you're logged in!",
        token: token,
        user: {
          id: user.id,
          username: user.username,
        },
      });
    } else {
      next({
        name: 'IncorrectCredentialsError',
        message: 'Username or password is incorrect',
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// GET /api/users/me
router.get('/me', requireUser,  async (req, res, next) => {
  try{
    res.send(req.user)
  } catch (error){
    next (error)
  }
});

// GET /api/users/:username/routines

router.get("/:username/routines", async (req, res, next) => {
  try {
    const {username} = req.params;
    const user = await getUserByUsername(username);
    if (!user) {
      next({
        name: "No user found",
        message: "User does not exist in the database",
      });
    }
    if (req.user && user.id === req.user.id) {
      const routines = await getAllRoutinesByUser({ username: username });
      res.send(routines);
    }
      const publicRoutines = await getPublicRoutinesByUser({ username: username });
      res.send(publicRoutines);
  } catch (error) {
    next(error);
  }
});

module.exports = router;