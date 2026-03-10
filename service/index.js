const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
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

  const user = users[username];

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
app.delete('/api/auth/logout', (req, res) => {
  const token = req.cookies.token;

  if (token) {
    delete sessions[token];
  }

  //clears cookies from browser
  res.clearCookie('token');
  res.json({ message: 'Logged Out'})

});


//checks if currently logged in 
app.get('/api/auth/me', (req, res) => {
  const username = getLoggedInUser(req);
  if (!username) {
    return res.status(401).json({error: 'Not Logged in'});
  }
  res.json({username});
});



//gets all events for the logged in person
app.get('/api/schedule', (req, res) => {
  const username = getLoggedInUser(req);
  if (!username) {
    return res.status(401).json({ error: 'Not Logged in'});
  }
  //returns the persons events
  res.json(scheduleEvents[username] || []);
});


//add a new event 
app.post('/api/schedule', (req, res) => {
  const username = getLoggedInUser(req);
  if (!username) {
    return res.status(401).json({ error: 'Not Logged in'});
  }

  const { name, date } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Event name needed'});
  }

  //build the new event
  const newEvent = {
    id: uuid.v4(), 
    name, 
    date: date || 'No date set',
  };

  //if the person doesnt have an array associated with their events yet add one to their account
  if (!scheduleEvents[username]) {
    scheduleEvents[username] = [];
  }

  scheduleEvents[username].push(newEvent);
  res.json(newEvent);

});


//Delete an event of somekind 
app.delete('/api/schedule/:id', (req, res) => {
  const username = getLoggedInUser(req);
  if (!username) {
    return res.status(401).json({ error: 'Not logged in' });
  }

  const eventId = req.params.id;

  scheduleEvents[username] = (scheduleEvents[username] || [])
    .filter(e => e.id !== eventId);

  res.json({message: 'Deleted'});

});



//below here is where all the community goal stuff will go


//gets all community goals
app.get('/api/goals', (req, res) => {
  res.json(communityGoals);
})


//add a new goal (community)
app.post('/api/goals', (req, res) => {
  const username = getLoggedInUser(req);
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
communityGoals.unshift(newGoal);
res.json(newGoal);
});


//Deletes a goal
app.delete('/api/goals/:id', (req, res) => {
  const username = getLoggedInUser(req);
  if (!username) {
    return res.status(401).json({ error: 'Not logged in'})
  }

  const goalId = req.params.id;

  //find the goal first so we can check ownership.
  const goal = communityGoals.find(g => g.id === goalId);

  if (!goal) {
    return res.status(404).json({ error: 'Goal not found' });
  }

  if (goal.user !== username) {
    return res.status(403).json({ error: 'This is not your goal to delete' });
  }

  const index = communityGoals.indexOf(goal);
  communityGoals.splice(index, 1);

  res.json({message: 'Deleted'});

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


