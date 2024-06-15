import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import Chat from './components/Chat';
import { Container, Row, Col} from 'react-bootstrap';
import './App.css';

function App() {
  const [defaultUser, setDefaultUser] = useState('user1');
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);

  useEffect(() => {
    loadChats(defaultUser);
  }, [defaultUser]);

  const loadChats = async (username) => {
    try {
      const response = await axios.get(`http://localhost:5000/chats/${username}`);
      setChats(response.data.chats);
    } catch (error) {
      console.error('Failed to load chats', error);
    }
  };

  const handleCreateChat = async (chatName, model, template) => {
    try {
      await axios.post(`http://localhost:5000/chats/${defaultUser}`, { chat_name: chatName, template, model });
      loadChats(defaultUser);
    } catch (error) {
      console.error('Failed to create chat', error);
    }
  };

  const handleDeleteChat = async (chatName) => {
    try {
      await axios.post(`http://localhost:5000/chats/delete/${defaultUser}`, { chat_name: chatName });
      loadChats(defaultUser);
    } catch (error) {
      console.error('Failed to delete chat', error);
    }
  };

  return (
    <Container fluid className="app-container d-flex h-100">
      <Row className="flex-grow-1">
        <Col md={3} className="sidebar-container">
          <Sidebar
            chats={chats}
            onCreateChat={handleCreateChat}
            onDeleteChat={handleDeleteChat}
            onSelectChat={setCurrentChat}
            username={defaultUser} // Pass the username as a prop
          />
        </Col>
        <Col md={9} className="chat-container">  {/* Main content column */}
          {currentChat && <Chat chat={currentChat} username={defaultUser} />}
        </Col>
      </Row>
    </Container>
  );
}

export default App;
