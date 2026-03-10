import React, { useState, useEffect } from 'react';

//These are the fake goals from other users
const mockIncomingGoals = [
  { user: 'Alex', goal: 'Finish a 30-day workout streak' },
  { user: 'Jordan', goal: 'Read one book per month' },
  { user: 'Taylor', goal: 'Wake up at 6am every day' },
  { user: 'Riley', goal: 'Learn to cook 5 new meals' },
  { user: 'Morgan', goal: 'Spend less time on my phone' },
];

export function Goals() {
  const [newGoal, setNewGoal] = useState('');

  //myGoals is the list of goals the logged-in user has
  const [myGoals, setMyGoals] = useState(() => {
    const saved = localStorage.getItem('myGoals');
    return saved ? JSON.parse(saved) : [];
  });

  //communityGoals is the feed of everyone's goals
  const [communityGoals, setCommunityGoals] = useState([
    { user: 'Sam', goal: 'Run a 5K this spring' },
    { user: 'Chris', goal: 'Journal every night before bed' },
  ]);

  //Saves the user's own goals to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('myGoals', JSON.stringify(myGoals));
  }, [myGoals]);

  //Simulates incoming goals from other users every 4 seconds (will put websocket here later)
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < mockIncomingGoals.length) {
        //Add the new mock goal to the top
        setCommunityGoals(prev => [mockIncomingGoals[index], ...prev]);
        index++;
      } else {
        clearInterval(interval); //stops after all fake goals are shown
      }
    }, 4000);

    return () => clearInterval(interval); //cleanup
  }, []);

  function handleAddGoal(e) {
    e.preventDefault();
    if (newGoal.trim() === '') return;

    const userName = localStorage.getItem('userName') || 'Guest';

    const goalEntry = {
      id: Date.now(),
      user: userName,
      goal: newGoal,
    };

    //Adds to your personal list
    setMyGoals(prev => [...prev, goalEntry]);

    //Also add to the community feed so others can see it
    setCommunityGoals(prev => [goalEntry, ...prev]);

    setNewGoal('');
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