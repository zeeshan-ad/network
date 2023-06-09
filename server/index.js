const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');
const port = process.env.PORT || 9000;

// middleware
app.use(express.json());
app.use(cors());

// routes

// get all users


// create a user in users table
app.post('/api/users/create-account', async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;
    const newUser = await pool.query(
      'INSERT INTO users (firstname, lastname, email, password, created_at) VALUES ($1, $2, $3, $4) RETURNING *',
      [firstname, lastname, email, password]
    );
    res.json(newUser.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});


app.listen(port, () => console.log(`app listening on port ${port}!`));