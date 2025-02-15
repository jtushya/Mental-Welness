import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PointsProvider } from './context/PointsContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import FocusSession from './pages/FocusSession';
import BreathingExercise from './pages/BreathingExercise';
import BedtimeRoutine from './pages/BedtimeRoutine';

function App() {
  return (
    <PointsProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="focus-session" element={<FocusSession />} />
            <Route path="breathing-exercise" element={<BreathingExercise />} />
            <Route path="bedtime-routine" element={<BedtimeRoutine />} />
          </Route>
        </Routes>
      </Router>
    </PointsProvider>
  );
}

export default App;