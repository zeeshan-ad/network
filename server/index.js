const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');
var bcrypt = require('bcrypt');
const fs = require('fs');
const generateAccessToken = require('./functions');
const port = 3000;

// middleware
app.use(express.json());
app.use(cors());
const multer = require('multer')
const path = require('path');
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({ storage: storage });

app.use('/uploads', express.static(__dirname + '/uploads'));
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
          const profile = await pool.query('INSERT INTO user_profile (user_id, created_at) VALUES ($1, $2) RETURNING *', [newUser.rows[0].id, new Date()]);
          if (profile.rows.length === 0) {
            return res.status(500).json({ status: 500, message: 'Internal Server Error' });
          }
          delete newUser.rows[0].password;
          newUser.rows[0].token = token;
          res.status(200).json({ status: 200, data: newUser.rows[0] });
        } catch (err) {
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
  if (userInfo.rows.length !== 0) {
    const verifyCred = await bcrypt.compare(password, userInfo.rows[0].password);
    if (verifyCred) {
      const token = generateAccessToken(userInfo.rows[0]);
      const session = await pool.query('INSERT INTO user_sessions (user_id, token, created_at) VALUES ($1, $2, $3) RETURNING *', [userInfo.rows[0].id, token, new Date()]);
      if (session.rows.length === 0) {
        return res.status(500).json({ status: 500, message: 'Internal Server Error' });
      }
      delete userInfo.rows[0].password;
      userInfo.rows[0].token = token;
      return res.status(200).json({
        status: 200, data: userInfo.rows[0], message: 'Login Successful'
      });
    }
  }
  return res.status(401).json({ status: 401, message: 'Invalid Credentials' });


  //   try {
  //     if (verifyCred) {
  //       const session = await pool.query('INSERT INTO user_sessions (user_id, token, created_at) VALUES ($1, $2, $3) RETURNING *', [userInfo.rows[0].id, token, new Date()]);
  //       if (session.rows.length === 0) {
  //         return res.status(500).json({ status: 500, message: 'Internal Server Error' });
  //       }
  //       delete userInfo.rows[0].password;
  //       userInfo.rows[0].token = token;
  //       return res.status(200).json({
  //         status: 200, data: userInfo.rows[0], message: 'Login Successful'
  //       });
  //     } else {
  //       return res.status(401).json({ status: 401, message: 'Invalid Credentials' });
  //     }
  //   } catch (err) {
  //     return res.status(400).json({ status: 400, message: 'Bad Request' });
  //   }
  // }
});

async function checkToken(req, res, next) {
  const token = req.headers.authorization;
  try {
    const session = await pool.query('SELECT * FROM user_sessions WHERE token = $1', [token]);
    if (session.rows.length === 0) {
      return res.status(404).json({ status: 404, message: 'Session not found' });
    }
  } catch (err) {
    return res.status(500).json({ status: 500, message: 'Internal Server Error' });
  }
  if (token === undefined) {
    return res.status(401).json({ status: 401, message: 'Unauthorized' });
  }
  next();
}



// Logout
app.delete('/api/users/logout', checkToken, async (req, res) => {

  const token = req.headers.authorization;

  try {
    const session = await pool.query('DELETE FROM user_sessions WHERE token = $1 RETURNING *', [token]);
    if (session.rowCount === 0) {
      return res.status(404).json({ status: 404, message: 'Session not found' });
    }
    res.status(200).json({ status: 200, message: 'Logout Successful' });
  } catch (err) {
    res.status(400).json({ status: 400, message: 'Bad Request' });
  }
});


// Get User Profile
app.get('/api/users/profile', checkToken, async (req, res) => {
  try {
    const token = req.headers.authorization;
    await pool.query('SELECT * FROM user_sessions WHERE token = $1', [token]).then(async (result) => {
      const profile = await pool.query('SELECT * FROM user_profile WHERE user_id = $1', [result?.rows[0]?.user_id]);
      if (profile.rows.length === 0) {
        return res.status(404).json({ status: 404, message: 'Profile not found', data: null });
      } else {
        res.status(200).json({ status: 200, data: profile.rows[0] });
      }
    }).catch((err) => {
      res.status(500).json({ status: 500, message: 'Internal Server Error' });
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: 'Internal Server Error' });
  }
});

// Update User Profile

app.put('/api/users/dp', upload.single('profile_pic'), async (req, res) => {
  console.log(req.file);
  try {
    const token = req.headers.authorization;
    const session = await pool.query('SELECT * FROM user_sessions WHERE token = $1', [token]);
    // Retrieve the previous profile picture path from the database
    const prevProfile = await pool.query('SELECT profile_pic FROM user_profile WHERE user_id = $1', [session.rows[0].user_id]);

    // Delete the previous image if it exists
    if (prevProfile.rows[0]?.profile_pic) {
      const prevImagePath = prevProfile.rows[0].profile_pic.replace('/uploads/', '');
      const prevImageFilePath = `uploads/${prevImagePath}`;
      fs.unlinkSync(prevImageFilePath);
    }
    const profile = await pool.query('UPDATE user_profile SET profile_pic = $1 WHERE user_id = $2 RETURNING *', [`/uploads/${req.file.filename}`, session.rows[0].user_id]);
    if (profile.rows.length === 0) {
      return res.status(500).json({ status: 500, message: 'Internal Server Error' });
    }
    res.status(200).json({ status: 200, data: profile.rows[0] });
  } catch (err) {
    res.status(500).json({ status: 500, message: 'Internal Server Error' });
  }
});


app.put('/api/users/profile-update', checkToken, async (req, res) => {
  const { bio, theme, is_public } = req.body;
  console.log(req.body)
  try {
    const token = req.headers.authorization;
    const session = await pool.query('SELECT * FROM user_sessions WHERE token = $1', [token]);
    const profile = await pool.query('UPDATE user_profile SET bio = $1, theme = $2, is_public = $3 WHERE user_id = $4 RETURNING *', [bio, theme, is_public, session.rows[0].user_id]);
    if (profile.rows.length === 0) {
      return res.status(500).json({ status: 500, message: 'Internal Server Error' });
    }
    res.status(200).json({ status: 200, data: profile.rows[0] });
  } catch (err) {
    res.status(400).json({ status: 400, message: 'Bad Request' });
  }
});



app.listen(port, () => console.log(`app listening on port ${port}!`));