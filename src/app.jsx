import React from 'react';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

// Import components
import { Home } from './home/home';
import { Schedule } from './schedule/schedule';
import { Goals } from './goals/goals';
import { About } from './about/about';

export default function App() {
  return (
    <BrowserRouter>
      <div className="body bg-dark text-light">
        <header>
          <h1>Schedule & Goals App</h1>
          <nav>
            <NavLink to="">Home</NavLink>
            <NavLink to="schedule">My Schedule</NavLink>
            <NavLink to="goals">Community Goals</NavLink>
            <NavLink to="about">About</NavLink>
          </nav>
        </header>

        <Routes>
          <Route path='/' element={<Home />} exact />
          <Route path='/schedule' element={<Schedule />} />
          <Route path='/goals' element={<Goals />} />
          <Route path='/about' element={<About />} />
          <Route path='*' element={<NotFound />} />
        </Routes>

        <footer>
          <p>Created by Hayden Smith</p>
          <p><a href="https://github.com/HaydenRS101/CS260" target="_blank" rel="noopener noreferrer">GitHub Repository</a></p>
          <p>&copy; 2026 Schedule and Goals App</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

function NotFound() {
  return (
    <main className="container-fluid bg-secondary text-center">
      404: Return to sender. Address unknown.
    </main>
  );
}
