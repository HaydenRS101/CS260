import React, { useState, useEffect } from 'react';

//this is the quote, I will replace this portion with a api thingy later
function getMockQuote() {
  return { text: "The light at the end of the tunnel can sometimes be a train.", author: "Me"};
}

//This will be where the websocket goes in a future week
const mockActivityFeed = [
  "somebody completed goal: stand up", 
  "Somebody different did a goal: sit down"
];

export function Home() {
  //This tracks whether the person is currently typing in these areas
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  //This controls whether we show the login form or logged in veiw
  const [LoggedInUser, setLoggedInUser] = useState( () => localStorage.getItem('userName') !== null)
  //this is the quotes state
  const [quote, setQuote] = useState({ text: '', author: ''})
  //This is the live updates at the bottom. 
  const [activityFeed, setActivityFeed] = useState([mockActivityFeed[0]])
  
  //here is where we load the quote
  useEffect(() => {
    //API fetcher here later**
    const q = getMockQuote();
    setQuote(q);
  }, []); // The [] means to only run this once it loads**


  //every 3 seconds it adds a fake activity message to the feed. 
  useEffect(() => {
    let index = 1;
    const interval = setInterval(() => {
      if (index < mockActivityFeed.length) {
        setActivityFeed(prev => [mockActivityFeed[index], ...prev]);
        index++;
      } else {
        clearInterval(interval); //stops once all the mocks ahave been shown
      }
    }, 3000);
    //closes once other stuff finished
    return () => clearInterval(interval);
  }, []);
}

//this deals with people logging in
function handleLogin(e) {
  e.preventDefault(); //prevents the page from refreshing
  if (username.trim() == '') return;

  //saves to the other pages/cites
  localStorage.setItem('userName', username);
  setLoggedInUser(username);
  setIsLoggedIn(true);
}

function handleCreateAccount(e) {
  e.preventDefault();
  if (username.trim() === '') return; 

  localStorage.setItem('userName', username);
  setLoggedInUser(username);
  setIsLoggedIn(true);
  alert(`Account created for ${username}! (This will be stored at a later point)`)
}


function handleLogout() {
  localStorage.removeItem('userName');
  setLoggedInUser('Guest');
  setIsLoggedIn(false);
  setUsername('');
  setPassword('');
}



export function Home() {
  return (
    <main>
      <section>
        <h2>This will be where the Schedules and Goals are</h2>
        <p>text here</p>
        <p>
          <img 
            src="https://i.pinimg.com/originals/ef/6d/ed/ef6ded9690230bdddee45cb5371b8e95.jpg" 
            alt="calendar" 
            width="300"
          />
        </p>
      </section>

      <section>
        <h3>Login</h3>
        <form> 
          <label htmlFor="username">Username: </label>
          <input type="text" id="username" name="username" placeholder="Enter username" required />
          <br /><br />
          <label htmlFor="password">Password: </label>
          <input type="password" id="password" name="password" placeholder="Enter password" required />
          <br /><br />
          <button type="submit">Login</button>
          <button type="button">Create Account</button>
        </form>
      </section>

      <section>
        <p>Logged in as: <span id="user-name">Guest</span></p>
      </section>
      <br />

      <section>
        <h3>Quote of the day (to meet requirements for daily updating thing from the internet)</h3>
        <blockquote id="quote">
          "I don't know what to put here yet" -Hayden Smith
        </blockquote>
        <p><em>Quote that will be provided by the external API cite thingy</em></p>
      </section>

      <section>
        <h3>Recent Activity</h3>
        <div id="realtime-updates">
          <p><strong>Live updates:</strong></p>
          <ul>
            <li>Time stamps and names for people who completed goals example</li>
          </ul>
          <p><em>Real-time updates through the web connection thing</em></p>
        </div>
      </section>
    </main>
  );
}
