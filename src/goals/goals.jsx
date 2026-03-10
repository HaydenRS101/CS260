import React, { useState, useEffect } from 'react';

export function Goals() {

  const [newGoal, setNewGoal] = useState('');
  //comes from server not from localstorage
  const [communityGoals, setCommunityGoals] = useState([]);
  const [myGoals, setMyGoals] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState('');


  useEffect(() => {
  
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.username) {
          setCurrentUser(data.username);
        }
      })
      .catch(() => {});

    //loads all community goals from the server
    fetch('/api/goals')
      .then(res => res.json())
      .then(data => {
        setCommunityGoals(data);
      })
      .catch(() => {});
  }, []);


  useEffect(() => {
    if (currentUser) {
      setMyGoals(communityGoals.filter(g => g.user === currentUser));
    }
  }, [communityGoals, currentUser]);



  async function handleAddGoal(e) {
    e.preventDefault();
    setError('');
    if (newGoal.trim() === '') return;

    const res = await fetch('/api/goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ goal: newGoal }),
    });

    const data = await res.json();

    if (res.ok) {
      // Add to the front of community goals so newest shows first
      setCommunityGoals(prev => [data, ...prev]);
      setNewGoal('');
    } else {
      setError(data.error);
    }
  }

  function handleDeleteGoal(id) {
    setMyGoals(prev => prev.filter(g => g.id !== id));
  }

  import React, { useState, useEffect } from 'react';

export function Schedule() {
  //These two things track what the user is putting in the form
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');

  //events now come from the server instead of local storage
  const [events, setEvents] = useState([]);
  //tracks if user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.username) {
          setIsLoggedIn(true);
          return fetch('/api/schedule');
        }
      })
      .then(res => {
        if (res) return res.json();
      })
      .then (data => {
        if (data) setEvents(data);
      })
      .catch(() => {});
  }, []);



  async function handleAddEvent(e) {
    e.preventDefault();
    if (eventName.trim() === '') return;

    const res = await fetch('/api/schedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: eventName, date: eventDate }),
    });

    const newEvent = await res.json();

    if (res.ok) {
      setEvents([...events, newEvent]);
      setEventName('');
      setEventDate('');
    }
   }



  

  
  async function handleDeleteEvent(id) {
    const res = await fetch(`/api/schedule/${id}`, { method: 'DELETE'});

    if (res.ok) {
      setEvents(events.filters(event => event.id !== id));
    }
  }





   return (
    <main>
      <h2>My Schedule</h2>
      <br />

      {!isLoggedIn && (
        <p style={{ color: 'orange' }}>
          Please log in on the Home page to save your schedule.
        </p>
      )}

      <section>
        <h3>Add Event</h3>
        <form onSubmit={handleAddEvent}>
          <label htmlFor="event">Event:</label>
          <input
            type="text"
            id="event"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            required
          />
          <br /><br />
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
          />
          <br /><br />
          <button type="submit">Add</button>
        </form>
      </section>

      <section>
        <h3>Your Events</h3>
        {events.length === 0 ? (
          <p>No events yet, add one above!</p>
        ) : (
          <ul>
            {events.map(event => (
              <li key={event.id}>
                <strong>{event.name}</strong> — {event.date}
                <button onClick={() => handleDeleteEvent(event.id)}>Delete</button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
}