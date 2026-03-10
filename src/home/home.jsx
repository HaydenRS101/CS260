import React, { useState, useEffect } from 'react';

export function Home() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  //now asks the server if youre logged in
  const [loggedInUser, setLoggedInUser] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState('');

  //now comes from the backend /api/quote area
  const [quote, setQuote] = useState({text: '', author: ''});

  const [error, setError] = useState('');


  //API loading portion
  useEffect(() => {
    fetch('/api/quote')
      .then(res => res.json())
      .then(data => setQuote(data))
      .catch(() => {
        setQuote({
          text: 'The light at the end of the tunnel can sometimes be a train.',
          author: 'Unknown' 
        });
      });
  }, []);


  async function handleLogin(e) {
    e.preventDefault();
    setError('');

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (res.ok) {
      setLoggedInUser(data.username);
      setIsLoggedIn(true);
    }
    else {
      setError(data.error);
    }
  }





  

}




//This will be where the websocket goes in a future week
const mockActivityFeed = [
  "somebody completed goal: stand up", 
  "Somebody different did a goal: sit down"
];


  //every 3 seconds it adds a fake activity message to the feed. 
  useEffect(() => {
    let index = 1;
    const interval = setInterval(() => {
      if (index < mockActivityFeed.length) {
        setActivityFeed(prev => [mockActivityFeed[index], ...prev]);
        index++;
      } else {
        clearInterval(interval); //stops once all the mocks have been shown
      }
    }, 3000);
    //closes once other stuff finished
    return () => clearInterval(interval);
  }, []);

  //this deals with people logging in
  function handleLogin(e) {
    e.preventDefault(); //prevents the page from refreshing
    if (username.trim() === '') return;

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

  async function handleLogout() {
    await fetch ('/api/auth/logout', {method: 'DELETE'});
    setLoggedInUser(null);
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
  }

  // this is the return, it's where all the HTML lives.
  // everything above is logic, everything inside return() is what shows on screen.
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
        {/* show login form or welcome message depending on isLoggedIn */}
        {isLoggedIn ? (
          <div>
            <p>Welcome back, <span id="user-name">{loggedInUser}</span>!</p>
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <form onSubmit={handleLogin}> 
            <label htmlFor="username">Username: </label>
            <input type="text" id="username" name="username" placeholder="Enter username" required
              value={username} onChange={(e) => setUsername(e.target.value)} />
            <br /><br />
            <label htmlFor="password">Password: </label>
            <input type="password" id="password" name="password" placeholder="Enter password" required
              value={password} onChange={(e) => setPassword(e.target.value)} />
            <br /><br />
            <button type="submit">Login</button>
            <button type="button" onClick={handleCreateAccount}>Create Account</button>
          </form>
        )}
      </section>

      <section>
        <h3>Quote of the day (to meet requirements for daily updating thing from the internet)</h3>
        <blockquote id="quote">
          "{quote.text}" -{quote.author}
        </blockquote>
        <p><em>Quote that will be provided by the external API cite thingy</em></p>
      </section>

      <section>
        <h3>Recent Activity</h3>
        <div id="realtime-updates">
          <p><strong>Live updates:</strong></p>
          <ul>
            {activityFeed.map((activity, index) => (
              <li key={index}>{activity}</li>
            ))}
          </ul>
          <p><em>Real-time updates through the web connection thing</em></p>
        </div>
      </section>
    </main>
  );
}