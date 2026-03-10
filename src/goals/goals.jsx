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



  async function handleDeleteGoal(id) {
    const res = await fetch(`/api/goals/${id}`, { method: 'DELETE' });

    if (res.ok) {
      // Remove it from community goals — myGoals updates automatically
      // because of the useEffect above that watches communityGoals
      setCommunityGoals(prev => prev.filter(g => g.id !== id));
    }
  }



   return (
    <main>
      <h2>Everybody's Goals</h2>

      {!currentUser && (
        <p style={{ color: 'orange' }}>
          Please log in on the Home page to add goals.
        </p>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <section>
        <h3>Add a Goal</h3>
        <form onSubmit={handleAddGoal}>
          <label htmlFor="goal">Your Goal:</label>
          <input
            type="text"
            id="goal"
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            placeholder="Enter a goal..."
            required
          />
          <br /><br />
          <button type="submit">Add Goal</button>
        </form>
      </section>

      <section>
        <h3>My Goals</h3>
        {myGoals.length === 0 ? (
          <p>You haven't added any goals yet!</p>
        ) : (
          <ul>
            {myGoals.map(g => (
              <li key={g.id}>
                <strong>{g.goal}</strong>
                <button onClick={() => handleDeleteGoal(g.id)}>Delete</button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h3>Community Goals</h3>
        <p><em>Real-time updates via WebSocket coming in a future deliverable</em></p>
        <ul>
          {communityGoals.map((g, index) => (
            <li key={g.id || index}>
              <strong>{g.user}:</strong> {g.goal}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

