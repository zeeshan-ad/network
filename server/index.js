const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');
var bcrypt = require('bcrypt');
const generateAccessToken = require('./functions');
const port = 3000;

// middleware
app.use(express.json());
app.use(cors());

// routes

// verify email exits or not
app.get('/api/users/verify-email', async (req, res) => {
  const email = req.query.email;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length > 0) {
      return res.status(409).json({ status: 409, message: 'Email already exists, Please try logging In.' });
    } else {
      return res.status(200).json({ status: 200, message: 'Email does not exists' });
    }
  } catch (err) {
    return res.status(500).json({ status: 500, message: 'Internal Server Error' });
  }
});

// Insert a user in users table
app.post('/api/users/create-account', async (req, res) => {
  try {
    const { name, email, password, created_at, dob } = req.body;
    // check if user already exists
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length > 0) {
      return res.status(409).json({ status: 409, message: 'Email already exists' });
    }

    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(password, salt, async function (err, hash) {
        try {
          const newUser = await pool.query(
            'INSERT INTO users (name, email, password, created_at, dob) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, email, hash, created_at, dob]
          );
          const token = generateAccessToken(newUser.rows[0]);
          const session = await pool.query('INSERT INTO user_sessions (user_id, token, created_at) VALUES ($1, $2, $3) RETURNING *', [newUser.rows[0].id, token, new Date()]);
          if (session.rows.length === 0) {
            return res.status(500).json({ status: 500, message: 'Internal Server Error' });
          }
          delete newUser.rows[0].password;
          newUser.rows[0].token = token;
          res.status(200).json({ status: 200, data: newUser.rows[0] });
        } catch (err) {
          console.error(err.message);
          res.status(500).json({ status: 500, message: 'Internal Server Error' });
        }
      });
    });
  } catch (err) {
    res.status(400).json({ status: 400, message: 'Bad Request' });
  }
});

// Login
app.get('/api/users/login', async (req, res) => {

  const { email, password } = req.query;

  const userInfo = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  if (userInfo.rows.length === 0) {
    return res.status(404).json({ status: 404, message: 'User not found' });
  }

  const verifyCred = await bcrypt.compare(password, userInfo.rows[0].password);
  const token = generateAccessToken(userInfo.rows[0]);

  try {
    if (verifyCred) {
      const session = await pool.query('INSERT INTO user_sessions (user_id, token, created_at) VALUES ($1, $2, $3) RETURNING *', [userInfo.rows[0].id, token, new Date()]);
      if (session.rows.length === 0) {
        return res.status(500).json({ status: 500, message: 'Internal Server Error' });
      }
      delete userInfo.rows[0].password;
      userInfo.rows[0].token = token;
      res.status(200).json({
        status: 200, data: userInfo.rows[0], message: 'Login Successful'
      });
    } else {
      res.status(401).json({ status: 401, message: 'Invalid Credentials' });
    }
  } catch (err) {
    res.status(400).json({ status: 400, message: 'Bad Request' });
  }
});


// Logout
app.delete('/api/users/logout', async (req, res) => {

  const token = req.headers.authorization;

  try {
    const session = await pool.query('DELETE FROM user_sessions WHERE token = $1 RETURNING *', [token]);
    if (session.rowCount === 0) {
      return res.status(404).json({ status: 404, message: 'Session not found' });
    }
    res.status(200).json({ status: 200, message: 'Logout Successful' });
  } catch (err) {
    res.status(400).json({ status: 400, message: 'Bad Request'});
  }
});



app.listen(port, () => console.log(`app listening on port ${port}!`));