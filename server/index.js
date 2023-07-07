const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');
var bcrypt = require('bcrypt');
const fs = require('fs');
const moment = require('moment-timezone');
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

const storageMoments = multer.diskStorage({
  destination: 'moments/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})

const uploadMoments = multer({ storage: storageMoments });

const upload = multer({ storage: storage });

function convertToLocalTimezone(array) {
  return array.map((item) => {
    if (Array.isArray(item)) {
      return convertToLocalTimezone(item);
    } else if (item.created_at) {
      const localDate = new Date(item.created_at).toLocaleString();
      return { ...item, created_at: localDate };
    } else {
      return item;
    }
  });
}
function convertToLocalTime(array) {
  return array.map(obj => {
    const utcTimestamp = new Date(obj.created_at);
    const localTimestamp = utcTimestamp.toLocaleString();
    return { ...obj, created_at: localTimestamp };
  });
}


function separateArrayByDate(arr) {
  let result = [];
  let tempDict = {};

  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];

    if (Array.isArray(item)) {
      let tempArr = [];

      for (let j = 0; j < item.length; j++) {
        const obj = item[j];
        const created_at = obj.created_at;
        const day = created_at.split(",")[0].trim();

        if (!tempDict[day]) {
          tempDict[day] = [];
        }

        tempDict[day].push(obj);
      }

      tempArr = Object.values(tempDict);
      result.push(...tempArr);
      tempDict = {};
    } else {
      result.push(item);
    }
  }

  return result;
}

function getLatestObjectsPerDay(array) {
  const latestObjects = {};

  array.forEach(obj => {
    const date = new Date(obj.created_at).toLocaleDateString();
    if (!latestObjects[date] || new Date(obj.created_at) > new Date(latestObjects[date].created_at)) {
      latestObjects[date] = obj;
    }
  });

  return Object.values(latestObjects);
}

function compareCreatedAt(a, b) {
  const dateA = Array.isArray(a) ? new Date(a[0].created_at) : new Date(a.created_at);
  const dateB = Array.isArray(b) ? new Date(b[0].created_at) : new Date(b.created_at);
  return dateB - dateA;
}

app.use('/uploads', express.static(__dirname + '/uploads'));
app.use('/moments', express.static(__dirname + '/moments'));

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

// verify username exits or not
app.get('/api/users/verify-username', async (req, res) => {
  const username = req.query.username;

  if (username.length < 3) {
    return res.status(409).json({ status: 409, message: 'Username must be greater than 2 characters' });
  }
  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (result.rows.length > 0) {
      return res.status(409).json({ status: 409, message: 'Username already exists, Please try another one.' });
    } else {
      return res.status(200).json({ status: 200, message: 'Username does not exists' });
    }
  } catch (err) {
    return res.status(500).json({ status: 500, message: 'Internal Server Error' });
  }
});


// Insert a user in users table
app.post('/api/users/create-account', async (req, res) => {
  const { name, email, username, password, created_at, dob } = req.body;

  try {
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(password, salt, async function (err, hash) {
        try {
          const newUser = await pool.query(
            'INSERT INTO users (name, email, created_at, dob, password, username) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [name, email, created_at, dob, hash, username]
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
          const mood = await pool.query('INSERT INTO user_mood (user_id, created_at) VALUES ($1, $2) RETURNING *', [newUser.rows[0].id, new Date()]);
          if (mood.rows.length === 0) {
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
      const friends = await pool.query('SELECT * FROM friends_requests WHERE (req_by_id = $1 OR req_to_id = $1) AND (status = $2)', [result?.rows[0]?.user_id, "accepted"]);
      if (profile.rows.length === 0) {
        return res.status(404).json({ status: 404, message: 'Profile not found', data: null });
      } else {
        res.status(200).json({ status: 200, data: { ...profile.rows[0], totalFriends: friends.rows.length } });
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

// post user_posts_moments 
app.post('/api/users/post_moments', uploadMoments.single('moment'), checkToken, async (req, res) => {
  const token = req.headers.authorization;
  const { caption } = req.query;
  const session = await pool.query('SELECT * FROM user_sessions WHERE token = $1', [token]);
  const moment = await pool.query('INSERT INTO user_posts_moments (user_id, moment, created_at, caption) VALUES ($1, $2, $3, $4) RETURNING *', [session.rows[0].user_id, `/moments/${req.file.filename}`, new Date(), caption]);
  if (moment.rows.length === 0) {
    return res.status(500).json({ status: 500, message: 'Internal Server Error' });
  }
  res.status(200).json({ status: 200, data: moment.rows[0] });
});


app.put('/api/users/profile-update', checkToken, async (req, res) => {
  const { bio, theme, is_public } = req.body;
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

// Update user_mood
app.put('/api/users/update_mood', checkToken, async (req, res) => {
  const { text } = req.body;
  try {
    const token = req.headers.authorization;
    const session = await pool.query('SELECT * FROM user_sessions WHERE token = $1', [token]);
    const profile = await pool.query('UPDATE user_mood SET mood = $1 WHERE user_id = $2 RETURNING *', [text, session.rows[0].user_id]);
    if (profile.rows.length === 0) {
      return res.status(500).json({ status: 500, message: 'Internal Server Error' });
    }
    res.status(200).json({ status: 200, data: profile.rows[0] });
  } catch (err) {
    res.status(400).json({ status: 400, message: 'Bad Request' });
  }
});

// get user_mood
app.get('/api/users/get_mood', checkToken, async (req, res) => {
  try {
    const token = req.headers.authorization;
    const session = await pool.query('SELECT * FROM user_sessions WHERE token = $1', [token]);
    const profile = await pool.query('SELECT * FROM user_mood WHERE user_id = $1', [session.rows[0].user_id]);
    if (profile.rows.length === 0) {
      return res.status(404).json({ status: 404, message: 'Profile not found', data: null });
    } else {
      res.status(200).json({ status: 200, data: profile.rows[0] });
    }
  } catch (err) {
    res.status(500).json({ status: 500, message: 'Internal Server Error' });
  }
});

// post user_posts_memos
app.post('/api/users/post_memos', checkToken, async (req, res) => {
  const { Memo } = req.body;
  try {
    const token = req.headers.authorization;
    const session = await pool.query('SELECT * FROM user_sessions WHERE token = $1', [token]);
    const profile = await pool.query('INSERT INTO user_posts_memos (user_id, memo) VALUES ($1, $2) RETURNING *', [session.rows[0].user_id, Memo]);
    if (profile.rows.length === 0) {
      return res.status(500).json({ status: 500, message: 'Internal Server Error' });
    }
    res.status(200).json({ status: 200, data: profile.rows[0] });
  } catch (err) {
    res.status(400).json({ status: 400, message: 'Bad Request' });
  }
});

// get user_posts_memos
app.get('/api/users/get_memos', checkToken, async (req, res) => {
  try {
    const token = req.headers.authorization;
    const session = await pool.query('SELECT * FROM user_sessions WHERE token = $1', [token]);
    const memo = await pool.query('SELECT * FROM user_posts_memos WHERE user_id = $1', [session.rows[0].user_id]);
    const profile = await pool.query('SELECT * FROM user_profile WHERE user_id = $1', [session.rows[0].user_id]);
    if (memo.rows.length === 0 && profile.rows.length === 0) {
      return res.status(404).json({ status: 404, message: 'Profile not found', data: null });
    } else {
      let data = {
        profile: profile.rows[0],
        memo: memo.rows
      }
      res.status(200).json({ status: 200, data: data });
    }
  } catch (err) {
    res.status(500).json({ status: 500, message: 'Internal Server Error' });
  }
});


// get api to search for users using name or email id
app.get('/api/users/search', checkToken, async (req, res) => {
  const { search, offset } = req.query;
  try {
    const token = req.headers.authorization;
    const session = await pool.query('SELECT * FROM user_sessions WHERE token = $1', [token]);
    if (!session.rows.length) return res.status(404).json({ status: 404, message: 'Authentication fail' });
    const users = await pool.query('SELECT * FROM users WHERE (name ILIKE $1 OR username ILIKE $1) AND id != $2 OFFSET $3 LIMIT $4',
      [`%${search}%`, session.rows[0].user_id, offset, 20]);

    // maps users.rows to fetch from user_profile table user details and save it in data
    const data = await Promise.all(users.rows.map(async (user) => {
      const profile = await pool.query('SELECT * FROM user_profile WHERE user_id = $1', [user.id]);
      return { id: user?.id, name: user?.name, username: user?.username, profile_pic: profile?.rows[0]?.profile_pic };
    }));

    res.status(200).json({ status: 200, data: data });
  } catch (err) {
    res.status(500).json({ status: 500, message: 'Internal Server Error' });
  }
});

// get api to get user profile details
app.get('/api/users/other_profile', checkToken, async (req, res) => {
  const { userId } = req.query;
  try {
    const token = req.headers.authorization;
    const session = await pool.query('SELECT * FROM user_sessions WHERE token = $1', [token]);

    // check if user is authenticated
    if (!session.rows.length) return res.status(404).json({ status: 404, message: 'Authentication fail' });

    // check if user is trying to access other user profile
    const profile = await pool.query('SELECT * FROM user_profile WHERE user_id = $1', [userId]);
    const user = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    // get mood
    const mood = await pool.query('SELECT * FROM user_mood WHERE user_id = $1', [userId]);
    // get total friends
    const friends = await pool.query('SELECT * FROM friends_requests WHERE (req_by_id = $1 OR req_to_id = $1) AND (status = $2)', [userId, "accepted"]);
    delete user.rows[0].password;
    if (!profile.rows.length || !user.rows.length)
      return res.status(404).json({ status: 404, message: 'Profile not found' });
    else
      return res.status(200).json({ status: 200, data: { ...profile.rows[0], ...user.rows[0], mood: mood.rows[0]?.mood ? mood.rows[0]?.mood : null, totalFriends: friends.rows.length } });
  } catch (err) {
    res.status(500).json({ status: 500, message: 'Internal Server Error' });
  }
});

// Store friend request
app.post('/api/users/friend_request', checkToken, async (req, res) => {
  const { userId } = req.query;
  try {
    const token = req.headers.authorization;
    const session = await pool.query('SELECT * FROM user_sessions WHERE token = $1', [token]);

    // check if user is authenticated
    if (!session.rows.length) return res.status(404).json({ status: 404, message: 'Authentication fail' });
    const user_req = await pool.query('INSERT INTO friends_requests (req_by_id, req_to_id, status, created_at) VALUES ($1, $2, $3, $4) RETURNING *', [session.rows[0].user_id, userId, 'pending', new Date()]);
    if (!user_req.rows.length) return res.status(404).json({ status: 404, message: 'Profile not found' });
    else return res.status(200).json({ status: 200, data: user_req.rows[0] });
  } catch (err) {
    res.status(500).json({ status: 500, message: 'Internal Server Error' });
  }
});

// get request status of friend request
app.get('/api/users/friend_request_status', checkToken, async (req, res) => {
  const { userId } = req.query;
  try {
    const token = req.headers.authorization;
    const session = await pool.query('SELECT * FROM user_sessions WHERE token = $1', [token]);

    // check if user is authenticated
    if (!session.rows.length) return res.status(404).json({ status: 404, message: 'Authentication fail' });

    const user_req = await pool.query('SELECT * FROM friends_requests WHERE (req_by_id = $1 AND req_to_id = $2) OR (req_by_id = $2 AND req_to_id = $1)', [session.rows[0].user_id, userId]);
    if (!user_req.rows.length) return res.status(404).json({ status: 404, message: 'Profile not found' });
    else return res.status(200).json({ status: 200, data: user_req.rows[0] });
  } catch (err) {
    res.status(500).json({ status: 500, message: 'Internal Server Error' });
  }
});

// cancel friend request
app.delete('/api/users/cancel_friend_request', checkToken, async (req, res) => {
  const { userId } = req.query;
  try {
    const token = req.headers.authorization;
    const session = await pool.query('SELECT * FROM user_sessions WHERE token = $1', [token]);

    // check if user is authenticated
    if (!session.rows.length) return res.status(404).json({ status: 404, message: 'Authentication fail' });

    const user_req = await pool.query('DELETE FROM friends_requests WHERE (req_by_id = $1 AND req_to_id = $2) OR (req_by_id = $2 AND req_to_id = $1)', [session.rows[0].user_id, userId]);
    if (!user_req.rows.length) return res.status(200).json({ status: 200, message: 'deleted successfully' });
  } catch (err) {
    res.status(500).json({ status: 500, message: 'Internal Server Error' });
  }
});


// accept friend request
app.put('/api/users/accept_friend_request', checkToken, async (req, res) => {
  const { userId } = req.query;
  try {
    const token = req.headers.authorization;
    const session = await pool.query('SELECT * FROM user_sessions WHERE token = $1', [token]);

    // check if user is authenticated
    if (!session.rows.length) return res.status(404).json({ status: 404, message: 'Authentication fail' });

    const user_req = await pool.query('UPDATE friends_requests SET status = $1 WHERE (req_by_id = $2 AND req_to_id = $3) OR (req_by_id = $3 AND req_to_id = $2) RETURNING *', ['accepted', session.rows[0].user_id, userId]);
    if (!user_req.rows.length) return res.status(404).json({ status: 404, message: 'Profile not found' });
    else return res.status(200).json({ status: 200, data: user_req.rows[0] });
  } catch (err) {
    res.status(500).json({ status: 500, message: 'Internal Server Error' });
  }
});


// get pending freinds request list
app.get('/api/users/notify_pending_friends_request', checkToken, async (req, res) => {
  try {
    const token = req.headers.authorization;
    const session = await pool.query('SELECT * FROM user_sessions WHERE token = $1', [token]);

    // check if user is authenticated
    if (!session.rows.length) return res.status(404).json({ status: 404, message: 'Authentication fail' });

    const user_req = await pool.query('SELECT * FROM friends_requests WHERE req_to_id = $1 AND status = $2', [session.rows[0].user_id, 'pending']);
    if (!user_req.rows.length) return res.status(404).json({ status: 404, message: 'Profile not found' });

    else {
      // get user name and profile image
      const data = await Promise.all(user_req.rows.map(async (item) => {
        const user = await pool.query('SELECT * FROM users WHERE id = $1', [item.req_by_id]);
        const profile = await pool.query('SELECT * FROM user_profile WHERE user_id = $1', [item.req_by_id]);
        return { ...item, name: user.rows[0].name, profile_pic: profile.rows[0].profile_pic };
      }));
      return res.status(200).json({ status: 200, data: data });
    }
  } catch (err) {
    res.status(500).json({ status: 500, message: 'Internal Server Error' });
  }
});

// get friends moods
app.get('/api/users/friends_moods', checkToken, async (req, res) => {
  try {
    const token = req.headers.authorization;
    const session = await pool.query('SELECT * FROM user_sessions WHERE token = $1', [token]);

    // check if user is authenticated
    if (!session.rows.length) return res.status(404).json({ status: 404, message: 'Authentication fail' });

    // get friends list
    const friends = await pool.query('SELECT * FROM friends_requests WHERE (req_by_id = $1 OR req_to_id = $1) AND status = $2', [session.rows[0].user_id, 'accepted']);
    if (!friends.rows.length) return res.status(404).json({ status: 404, message: 'No friends found' });
    // get friends moods
    const friends_moods = await Promise.all(friends.rows.map(async (item) => {
      const mood = await pool.query('SELECT * FROM user_mood WHERE user_id = $1', [session.rows[0].user_id === item.req_by_id ? item.req_to_id : item.req_by_id]);
      const user = await pool.query('SELECT * FROM users WHERE id = $1', [session.rows[0].user_id === item.req_by_id ? item.req_to_id : item.req_by_id]);
      const profile = await pool.query('SELECT * FROM user_profile WHERE user_id = $1', [session.rows[0].user_id === item.req_by_id ? item.req_to_id : item.req_by_id]);
      return { theme: profile?.rows[0]?.theme, userID: user?.rows[0]?.id, time: mood?.rows[0].created_at, mood: mood?.rows[0].mood, name: user?.rows[0].name, profile_pic: profile?.rows[0]?.profile_pic };
    }));
    // Sort the array by the 'time' property in descending order
    const sortedData = friends_moods.sort((a, b) => new Date(b.time) - new Date(a.time));
    return res.status(200).json({ status: 200, data: sortedData.filter(item => item.mood !== '') });
  } catch (err) {
    res.status(500).json({ status: 500, message: 'Internal Server Error' });
  }
});

// get feed data from user_posts_memos and user_posts_moments of friends and user itself arranged by time
app.get('/api/users/feed', checkToken, async (req, res) => {

  const currentDate = moment.utc(new Date()).local().format("YYYY-MM-DD");
  const prevDate = moment.utc().local().subtract(1, 'day').format("YYYY-MM-DD");;
  try {
    const token = req.headers.authorization;
    const session = await pool.query('SELECT * FROM user_sessions WHERE token = $1', [token]);

    // check if user is authenticated
    if (!session.rows.length) return res.status(404).json({ status: 404, message: 'Authentication fail' });

    // get friends list
    const friends = await pool.query('SELECT * FROM friends_requests WHERE (req_by_id = $1 OR req_to_id = $1) AND status = $2', [session.rows[0].user_id, 'accepted']);
    if (!friends.rows.length) return res.status(404).json({ status: 404, message: 'No friends found' });

    // get friends posts
    const friends_posts = await Promise.all(friends.rows.map(async (item) => {
      const posts_memos = await pool.query('SELECT * FROM user_posts_memos WHERE user_id = $1 AND DATE(created_at) BETWEEN $2 AND $3 ORDER BY id DESC', [session.rows[0].user_id === item.req_by_id ? item.req_to_id : item.req_by_id, prevDate, currentDate]);
      const posts_moments = await pool.query('SELECT * FROM user_posts_moments WHERE user_id = $1 AND DATE(created_at) BETWEEN $2 AND $3 ORDER BY id DESC', [session.rows[0].user_id === item.req_by_id ? item.req_to_id : item.req_by_id, prevDate, currentDate]);
      const user = await pool.query('SELECT * FROM users WHERE id = $1', [session.rows[0].user_id === item.req_by_id ? item.req_to_id : item.req_by_id]);
      const profile = await pool.query('SELECT * FROM user_profile WHERE user_id = $1', [session.rows[0].user_id === item.req_by_id ? item.req_to_id : item.req_by_id]);
      const dataMemos = [
        ...posts_memos?.rows?.map(item => ({ ...item, type: 'memo', name: user.rows[0].name, profile_pic: profile.rows[0].profile_pic, theme: profile.rows[0].theme })),
      ]
      const dataMoments = posts_moments?.rows?.map(item => ({ ...item, type: 'moment', name: user.rows[0].name, profile_pic: profile.rows[0].profile_pic }));

      return [...dataMemos, dataMoments];
    }));

    // get user memos and moments
    const user_posts_memos = await pool.query('SELECT * FROM user_posts_memos WHERE user_id = $1 AND DATE(created_at)  BETWEEN $2 AND $3 ORDER BY id DESC', [session.rows[0].user_id, prevDate, currentDate]);
    const user_posts_moments = await pool.query('SELECT * FROM user_posts_moments WHERE user_id = $1 AND DATE(created_at)  BETWEEN $2 AND $3 ORDER BY id DESC', [session.rows[0].user_id, prevDate, currentDate]);
    const user = await pool.query('SELECT * FROM users WHERE id = $1', [session.rows[0].user_id]);
    const profile = await pool.query('SELECT * FROM user_profile WHERE user_id = $1', [session.rows[0].user_id]);

    const dataMemos = [
      ...user_posts_memos?.rows?.map(item => ({ ...item, type: 'memo', name: user.rows[0].name, profile_pic: profile.rows[0].profile_pic, theme: profile.rows[0].theme })),
    ]
    const dataMoments = [
      ...user_posts_moments?.rows?.map(item => ({ ...item, type: 'moment', name: user.rows[0].name, profile_pic: profile.rows[0].profile_pic })),
    ]

    const data = [...dataMemos, dataMoments, ...friends_posts.flat()];

    const modifiedData = separateArrayByDate(convertToLocalTimezone(data));
    return res.status(200).json({ status: 200, data: modifiedData.sort(compareCreatedAt) });
  } catch (err) {
    res.status(500).json({ status: 500, message: 'Internal Server Error' });
  }
});

// Get moments and memos of user for profile page moments clubbed by same date
app.get('/api/users/user_profile_posts', checkToken, async (req, res) => {

  const userId = req.query.userId;

  console.log(userId);

  try {
    // get all memos of the user as array of objects
    const user_posts_memos = await pool.query('SELECT * FROM user_posts_memos WHERE user_id = $1 ORDER BY id DESC', [userId]);

    // get last moment from each day of the user as array of objects
    const user_posts_moments = await pool.query('SELECT * FROM user_posts_moments WHERE user_id = $1 ORDER BY id DESC', [userId]);
    const localTimeMoments = getLatestObjectsPerDay(convertToLocalTime(user_posts_moments.rows));
    const localTimeMemos = convertToLocalTime(user_posts_memos.rows);

    if (!user_posts_memos.rows.length && !user_posts_moments.rows.length)
      return res.status(404).json({ status: 404, message: 'No data found' });

    return res.status(200).json({ status: 200, data: { memos: localTimeMemos, moments: localTimeMoments } });

  } catch (err) {
    res.status(500).json({ status: 500, message: 'Internal Server Error' });
  }
});








app.listen(port, () => console.log(`app listening on port ${port}!`));