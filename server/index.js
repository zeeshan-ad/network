const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');
var bcrypt = require('bcrypt');
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

// get all users

app.get('/api/users', async (req, res) => {
  try {
    const allUsers = await pool.query('SELECT * FROM users');
    res.json(allUsers.rows);
  } catch (err) {
    console.error(err.message);
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
  try {
    const { email, password } = req.query;
    const userInfo = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const verifyCred = await bcrypt.compare(password, userInfo.rows[0].password);
    if (verifyCred) {
      res.status(200).json({ status: 200, data: userInfo.rows[0] });
    } else {
      res.status(401).json({ status: 401, message: 'Invalid Credentials' });
    }
  } catch (err) {
    res.status(400).json({ status: 400, message: 'Bad Request' });
  }
});


app.listen(port, () => console.log(`app listening on port ${port}!`));