/* eslint-disable no-useless-catch */
require('dotenv').config();
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
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

    if (user && user.password == password) {
      const token = jwt.sign(
        { id: user.id, username: user.username },
        JWT_SECRET
      );
      res.send({ message: "you're logged in!", token: token });
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

// GET /api/users/:username/routines

module.exports = router;

/*
 router.post('/register', async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const _user = await getUserByUsername(username);

    if (password.length < 8) {
      next({
        name: 'PasswordError',
        message: 'The password must be at least 8 char long',
      });
    }

    if (_user) {
      next({
        name: 'UserExistsError',
        message: 'A user by that username already exists',
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
      JWT_SECRET,
      {
        expiresIn: '1w',
      }
    );

    console.log('here in register', user);

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

 */
