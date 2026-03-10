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




