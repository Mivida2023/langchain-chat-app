import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './components/Login';
import Chat from './components/Chat';

function App() {
  const [authenticated, setAuthenticated] = useState(true);
  const [username, setUsername] = useState('user1');
  const [chats, setChats] = useState([]);

  const handleLogin = (username) => {
    console.log("handleLogin called with username: ", username);
    setUsername(username);
    setAuthenticated(true);
    loadChats(username);
  };

  const loadChats = async (username) => {
    console.log("loadChats called for username: ", username);
    try {
      const response = await axios.get(`http://localhost:5000/chats/${username}`);
      console.log("Loaded Chats: ", response.data.chats);
      setChats(response.data.chats);
    } catch (error) {
      console.error('Failed to load chats', error);
    }
  };

  useEffect(() => {
    if (authenticated) {
      loadChats(username);
    }
  }, [authenticated]);

  if (!authenticated) {
    return <Login onLogin={handleLogin(username)} />;
  }

  return <Chat username={username} chats={chats} />;
}

export default App;
