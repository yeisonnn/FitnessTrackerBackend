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

router.use((req, res, next) => {
  console.log('A request is being made to /users');

  next();
});

// POST /api/users/register
router.post('/register', async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const _user = await getUserByUsername(username);

    if (password.length < 8) {
      next({
        name: 'PasswordError',
        message: 'Password Too Short!',
        error: 'wrong password',
      });
      return;
    }

    if (_user) {
      next({
        name: 'UserExistsError',
        message: `User ${username} is already taken.`,
        error: 'choose another user',
      });
      return;
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
      JWT_SECRET,
      {
        expiresIn: '1w',
      }
    );

    res.send({
      message: 'thank you for signing up',
      token,
      user: {
        id: user.id,
        username,
      },
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
router.get('/me', async (req, res, next) => {
  const prefix = 'Bearer ';
  const auth = req.header('Authorization');

  if (!auth) {
    next();
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);

    try {
      const { id } = jwt.verify(token, JWT_SECRET);
      if (!id) {
        next({
          name: 'Invalid token',
          message: 'This is an invalid token',
        });
      }
      if (id) {
        req.user = await getUserById(id);
        res.send(req.user);
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  } else {
    next({
      name: 'AuthorizationHeaderError',
      message: `Authorization token must start with ${prefix}`,
    });
  }
});

// GET /api/users/:username/routines

router.get(`/:username/routines`, async (req, res, next) => {
  try {
    const { username } = req.params;
    const user = await getUserByUsername(username);

    console.log('req.user:', '...........', req.body);
    console.log('user:', '****', user);
    if (!user) {
      next({
        name: 'User does not exist in the database',
        message: 'User does not exist in the database',
      });
    }

    const routines = await getAllRoutinesByUser({ username });
    res.send(routines);
    if (req.body.username === user.username) {
      const publicRoutines = await getPublicRoutinesByUser({ username });
      res.send(publicRoutines);
    } else {
      const routines = await getAllRoutinesByUser({ username });
      res.send(routines);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
