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
