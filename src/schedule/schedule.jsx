import React, { useState, useEffect } from 'react';

export function Schedule() {
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [events, setEvents] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('');


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
      .then(data => {
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
    } else {
      setError(newEvent.error);
    }
  }


  async function handleDeleteEvent(id) {
    const res = await fetch(`/api/schedule/${id}`, { method: 'DELETE' });

    if (res.ok) {
      setEvents(events.filter(event => event.id !== id));
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

      {error && <p style={{ color: 'red' }}>{error}</p>}

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