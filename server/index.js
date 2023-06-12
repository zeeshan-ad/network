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
    const { firstname, lastname, email, password, created_at } = req.body;

    // check if user already exists
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length > 0) {
      return res.status(409).json({ status: 409, message: 'Email already exists' });
    }

    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(password, salt, async function (err, hash) {
        try {
          const newUser = await pool.query(
            'INSERT INTO users (firstname, lastname, email, password, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [firstname, lastname, email, hash, created_at]
          );
          res.json(newUser.rows[0]);
        } catch (err) {
          console.error(err.message);
          res.status(500).json({ status: 409, message: 'Internal Server Error' });
        }
      });
    });
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ status: 400, message: 'Bad Request' });
  }
});



app.listen(port, () => console.log(`app listening on port ${port}!`));