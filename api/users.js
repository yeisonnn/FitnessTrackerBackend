/* eslint-disable no-useless-catch */
require('dotenv').config();
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;
const { getUserByUsername, createUser } = require('../db/users');

// POST /api/users/register
router.post('/register', async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const _user = await getUserByUsername(username);

    if (_user) {
      next({
        name: 'UserExistsError',
        message: 'A user by that username already exists',
      });
    }

    if (password.length < 8) {
      next({
        name: 'PasswordError',
        message: 'The password must be at least 8 char long',
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

    res.send({
      message: 'thank you for signing up',
      token,
    });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

router.get('/', async (req, res) => {
  res.send('hello from users');
});

// POST /api/users/login

// GET /api/users/me

// GET /api/users/:username/routines

module.exports = router;
