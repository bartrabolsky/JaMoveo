import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './components/Register';
import Login from './components/Login';
import { socket } from './socket';
import PlayerMain from './components/PlayerMain';

function App() {
  useEffect(() => {
    socket.connect();
    console.log('Socket connected from frontend');

    return () => {
      socket.disconnect();
      console.log('Socket disconnected from frontend');
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/signup" />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/player" element={<PlayerMain />} />
      </Routes>
    </Router>
  );
}

export default App;
