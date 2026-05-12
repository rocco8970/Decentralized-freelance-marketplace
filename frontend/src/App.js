import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { WalletProvider } from './context/WalletContext';
import './App.css';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import PostJob from './pages/PostJob';
import BrowseJobs from './pages/BrowseJobs';
import Messages from './pages/Messages';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <AuthProvider>
      <WalletProvider>
        <Router>
          <div className="App">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/post-job" element={<PostJob />} />
              <Route path="/browse-jobs" element={<BrowseJobs />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </div>
        </Router>
      </WalletProvider>
    </AuthProvider>
  );
}

export default App;
