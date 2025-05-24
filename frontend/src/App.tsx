import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import { socket } from './socket';
import PlayerMain from './components/PlayerMain';
import AdminMain from './components/AdminMain';
import ResultsPage from './components/ResultsPage';
import { SongProvider } from './context/SongContext';
import LiveAdmin from './components/LiveAdmin';
import LivePlayer from './components/LivePlayer';
import ChooseRolePage from './components/ChooseRolePage';
import AdminSignup from './components/AdminSignup';
import UserSignup from './components/UserSignup';


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
    <SongProvider>
      <Router>
        <Routes>
          <Route path="/" element={<ChooseRolePage />} />
          <Route path="/user-signup" element={<UserSignup />} />
          <Route path="/admin-signup" element={<AdminSignup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/player" element={<PlayerMain />} />
          <Route path="/admin" element={<AdminMain />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/liveplayer" element={<LivePlayer />} />
          <Route path="/liveadmin" element={<LiveAdmin />} />
        </Routes>
      </Router>
    </SongProvider>
  );
}

export default App;
