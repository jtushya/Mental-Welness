import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PointsProvider } from './context/PointsContext';
import { NotificationsProvider } from './components/NotificationsContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Chat from './pages/Chat';
import FocusSession from './pages/FocusSession';
import BreathingExercise from './pages/BreathingExercise';
import BedtimeRoutine from './pages/BedtimeRoutine';
import Statistics from './pages/Statistics';

function App() {
  return (
    <PointsProvider>
      <NotificationsProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="chat" element={<Chat />} />
              <Route path="focus-session" element={<FocusSession />} />
              <Route path="breathing-exercise" element={<BreathingExercise />} />
              <Route path="bedtime-routine" element={<BedtimeRoutine />} />
              <Route path="statistics" element={<Statistics />} />
            </Route>
          </Routes>
        </Router>
      </NotificationsProvider>
    </PointsProvider>
  );
}

export default App;