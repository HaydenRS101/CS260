import React, { useState, useEffect } from 'react';

export function Schedule() {
  //These two things track what the user is putting in the form
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');

  //This is a list of events. We put it in local storage so that it
  // survives a page refresh. The function inside useState() only runs once when the cite loads
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('scheduleEvents');
    //If theres saved data we parse and use it
    //Otherwise start with an empty array.
    return saved ? JSON.parse(saved) : [];
  });


  useEffect(() => {
    localStorage.setItem('scheduleEvents', JSON.stringify(events));
  }, [events]); // the events means it will refresh when a new event is edited or added. 

  function handleAddEvent(e) {
    e.preventDefault(); //stops the form from refreshing the page
    if (eventName.trim() === '') return;

    //creates a new event object
    const newEvent = {
      id: Date.now(), //gets an id thats unique
      name: eventName,
      date: eventDate || 'No date set',
    };


    //This adds, merges, and keeps all the events so we don't lose them. 
    setEvents([...events, newEvent]);

    //Clears the form inputs after adding
    setEventName('');
    setEventDate('');
  }

  function handleDeleteEvent(id) {
    //gets rid of the duplicates
    setEvents(events.filter(event => event.id !== id));
  }


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
