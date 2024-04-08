const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

const {
  createUser,
  getUserByUsername,
  getLoggedInUser,
} = require('../../db/DBUtils');


router.post('/login', async (req, res, next) => {
  res.set('Access-Control-Allow-Origin', ['http://localhost:8081']);
  const { username, password } = req.body;
  
  if (username == undefined || password == undefined) {
    console.log('nothing supplied');
    next({
      name: 'MissingCredentialsError',
      message: 'Please supply both a username and password',
    });
  }

  try {
    const user = await getUserByUsername(username);
    const hashedPassword = user.password;
    const passwordsMatch = await bcrypt.compare(password, hashedPassword);

    if (user && (user.password === password || passwordsMatch)) {
      const token = jwt.sign(
        {
          id: user.id,
          username,
        },
       
        JWT_SECRET || 'nothing',
        {
          expiresIn: '1w',
        }
      );

      res.send({
        message: "you're logged in!",
        token,
      });
    } else {
      next({
        name: 'IncorrectCredentialsError',
        message: 'Username or password is incorrect',
      });
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/register', async (req, res, next) => {
  const { username, email, password, first_name, last_name } = req.body;
  const isFromRegister = true;

  try {
    const existingUser = await getUserByUsername(username, isFromRegister);

    if (existingUser) {
      next({
        name: 'UserExistsError',
        message: 'User with matching credentials already exists',
      });
    }

    const user = await createUser({
      username,
      email,
      password,
      first_name,
      last_name,
    });

    const token = jwt.sign(
      {
        id: user.id,
        username,
      },
      
      JWT_SECRET || 'nothing',
      {
        expiresIn: '1w',
      }
    );
    res.send({
      message: 'Thank you for signing up!',
      token,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/me', async (req, res, next) => {
  try {
    console.log(req.user);
    const user = await getLoggedInUser(req.user?.id);
    res.send(user);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
