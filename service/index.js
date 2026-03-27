const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const uuid = require('uuid'); 
const DB = require('./database')


const app = express();

//defaults the port to 4000
const port = process.argv.length >2 ? process.argv[2] : 4000;


//lets the reader read json files
app.use(express.json());
//lets read cookies
app.use(cookieParser());

//when the files are public, serve them automatically
app.use(express.static('public'));



//the following bit looks up who is logged in based on the cookie
async function getLoggedInUser(req) {
  const token = req.cookies.token;
  if (!token) return null;
  return await DB.getSession(token);
}


//creates new account
app.post('/api/auth/create', async (req, res) => {
  const { username, password } = req.body;

  //makes sure we have both username and password included
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and Password required'});
  }

  //checks if username is already taken
  const existing = await DB.getUser(username);
  if (existing) {
    return res.status(409).json({ error: 'Sorry, that username is already taken' });
  }

  //part that actually encrypts the password.
  const passwordHash = await bcrypt.hash(password, 10);

 await DB.createUser(username, passwordHash);
  const token = uuid.v4();
  await DB.createSession(token, username);
 
  res.cookie('token', token, { httpOnly: true });
  res.json({ username });
});



//This is for those who already have accounts
app.post('/api/auth/login', async (req, res) => {
  const {username, password} = req.body;

   const user = await DB.getUser(username);

  //if the user doesnt exist or the password is wrong send error message
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ error: 'Username of Password is incorrect or invalid'});
  }

  //creates the token and saves it
  const token = uuid.v4();
  await DB.createSession(token, username);

  res.cookie('token', token, {httpOnly: true});
  res.json({username}); 

});


//Delete or logout function 
app.delete('/api/auth/logout', async (req, res) => {
  const token = req.cookies.token;
 
  if (token) {
    await DB.deleteSession(token);
  }
 
  res.clearCookie('token');
  res.json({ message: 'Logged Out' });
});


//checks if currently logged in 
app.get('/api/schedule', async (req, res) => {
  const username = await getLoggedInUser(req);
  if (!username) {
    return res.status(401).json({ error: 'Not Logged in' });
  }
  const events = await DB.getSchedule(username);
  res.json(events);
});



//add a new event 
app.post('/api/schedule', async (req, res) => {
  const username = await getLoggedInUser(req);
  if (!username) {
    return res.status(401).json({ error: 'Not Logged in' });
  }
 
  const { name, date } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Event name needed' });
  }
 
  const newEvent = {
    id: uuid.v4(),
    username,
    name,
    date: date || 'No date set',
  };
 
  await DB.addEvent(newEvent);
  res.json(newEvent);
});




//Delete an event of somekind 
app.delete('/api/schedule/:id', async (req, res) => {
  const username = await getLoggedInUser(req);
  if (!username) {
    return res.status(401).json({ error: 'Not logged in' });
  }
 
  await DB.deleteEvent(req.params.id, username);
  res.json({ message: 'Deleted' });
});



//below here is where all the community goal stuff will go


//gets all community goals
app.get('/api/goals', async (req, res) => {
  const goals = await DB.getGoals();
  res.json(goals);
});


//add a new goal (community)
app.post('/api/goals', async (req, res) => {
  const username = await getLoggedInUser(req);
  if (!username) {
    return res.status(401).json({ error: 'Not logged in' });
  }

const { goal } = req.body;
if (!goal) {
  return res.status(400).json({ error: 'Goal required'});
}

const newGoal = {
  id: uuid.v4(),
  user: username,
  goal,
};

//adds to the front so newest shows first
await DB.addGoal(newGoal);
res.json(newGoal);
});


//Deletes a goal
app.delete('/api/goals/:id', async (req, res) => {
  const username = await getLoggedInUser(req);
  if (!username) {
    return res.status(401).json({ error: 'Not logged in' });
  }
 
  const goal = await DB.getGoalById(req.params.id);
 
  if (!goal) {
    return res.status(404).json({ error: 'Goal not found' });
  }
 
  if (goal.user !== username) {
    return res.status(403).json({ error: 'This is not your goal to delete' });
  }
 
  await DB.deleteGoal(req.params.id);
  res.json({ message: 'Deleted' });
});


//Fetches the quote from the external API
app.get('/api/quote', async (req, res) => {
  try {
    const response = await fetch('https://api.quotable.io/random');
    const data = await response.json();
    res.json({ text: data.content, author: data.author })
  } catch {
    res.json({
      text: 'The light at the end of the tunnel can sometimes be a train.',
      author: 'Unknown'
    });
  }
});


//this tells Node to listen to the stuff sent via port 4000

app.listen(port, () => {
  console.log(`Backend service running on port ${port}`);
});


