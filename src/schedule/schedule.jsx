import React from 'react';

export function Schedule() {
  return (
    <main>
      <h2>My Schedule</h2>
      <br />
      <section>
        <h3>Add Event</h3>
        <form>
          <label htmlFor="event">Event:</label>
          <input type="text" id="event" name="event" />
          <br /><br />
          <label htmlFor="date">Date</label>
          <input type="date" id="date" name="date" />
          <br /><br />
          <button type="submit">Add</button>
        </form>
      </section>

      <section>
        <h3>Your Events</h3>
        <p>when events are made for the user they will be put here</p>
        <ul>
          <li>Meeting - date</li>
          <li>Example 2</li>
        </ul>
      </section>
    </main>
  );
}
