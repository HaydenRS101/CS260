const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bycryptjs');
const uuid = require('uuid'); 

const app = express();

//defaults the port to 4000
const port = process.argv.length >2 ? process.argv[2] : 4000;



//lets the reader read json files
app.use(express.json());
//lets read cookies
app.use(cookieParser());

//when the files are public, serve them automatically
app.use(express.static('public'));

//stores user info. Bycrypt automatically encrypts the password. 
const users = {};

//this stores a persons token which we save and pull back up later so we know the info they have etc.
const sessions = {};

//maps the user to the events
const scheduleEvents = {};

//shared goals from other users in an array
//includes examples
const communityGoals = [
  { id: uuid.v4(), user: 'Sam', goal: 'Run a 5K this spring' },
  { id: uuid.v4(), user: 'Jacob', goal: 'Journal every night before bed' }
];



//the following bit looks up who is logged in based on the cookie
function getLoggedInUser(req) {
  const token = req.cookies.token;
  if (!token) return null;
  return sessions[token] || null;
}


//creates new account
app.post('/api/auth/create', async (req, res) => {
  const { username, password } = req.body;

  //makes sure we have both username and password included
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and Password required'});
  }

  //checks if username is already taken
  if (users[username]) {
    return res.status(409).json({error: 'Sorry, that username is already taken'});
  }

  //part that actually encrypts the password.
  const passwordHash = await bycrypt.hash(password, 10);

  //saves the new user
  users[username] = {id: uuid.v4(), username, passwordHash };

  //creates the session token thing
  const token = uuid.v4();
  sessions[token] = username;

  //sends the token back securely
  res.cookie('token', token, {httpOnly: true});

  //sends back the username so the frontend knows whos logged in
  res.json({username});

});

//This is for those who already have accounts
app.post('/api/auth/login', async (req, res) => {
  const {username, password} = req.body;

  const user = user[username];

  //if the user doesnt exist or the password is wrong send error message
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ error: 'Username of Password is incorrect or invalid'});
  }

  //creates the token and saves it
  const token = uuid.v4();
  sessions[token] = username;

  res.cookie('token', token, {httpOnly: true});
  res.json({username}); 

});


//Delete or logout function 
const token = uuid.v4();
sessions[token] = username



