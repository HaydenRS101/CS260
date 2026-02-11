import React from 'react';

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
