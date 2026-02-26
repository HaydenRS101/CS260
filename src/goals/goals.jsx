import React, { useState, useEffect } from 'react';

// These are the fake "other users'" goals that will simulate incoming WebSocket messages
const mockIncomingGoals = [
  { user: 'Alex', goal: 'Finish a 30-day workout streak' },
  { user: 'Jordan', goal: 'Read one book per month' },
  { user: 'Taylor', goal: 'Wake up at 6am every day' },
  { user: 'Riley', goal: 'Learn to cook 5 new meals' },
  { user: 'Morgan', goal: 'Spend less time on my phone' },
];

export function Goals() {
  const [newGoal, setNewGoal] = useState('');

  // myGoals is the list of goals the logged-in user has posted
  const [myGoals, setMyGoals] = useState(() => {
    const saved = localStorage.getItem('myGoals');
    return saved ? JSON.parse(saved) : [];
  });


  return (
    <main>
      <h2>Everybody's Goals</h2>
      <section>
        <h3>Live Goals</h3>
        <p>Goals for everybody</p>
        <ul>
          <li>Example Goal from somebody</li>
        </ul>
      </section>

      <section>
        <h3>Live Updates</h3>
        <p>Real-Time updates for goals</p>
        <ul>
          <li>Example live goal update</li>
        </ul>
      </section>
    </main>
  );
}
