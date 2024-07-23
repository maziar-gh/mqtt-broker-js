require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const app = express();

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors());

const encryptionKey = process.env.ENCRYPTION_KEY;
const jwtSecret = process.env.JWT_SECRET;

// Middleware to authenticate token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Endpoint to generate token (usually you have a login endpoint to provide the token)
app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username) {
    return res.status(400).send('username is required');
  }else if( username != process.env.USERNAME && password != process.env.PASSWORD){
    return res.status(401).send('username or password is incorect');
  }

  const user = { name: username, password: password };
  const accessToken = jwt.sign(user, jwtSecret, { expiresIn: '1h' }); // Token expires in 1 hour
  res.json({ accessToken });
});

// Secure endpoint to provide the encryption key
app.get('/get-key', authenticateToken, (req, res) => {
  res.json({ key: encryptionKey });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
