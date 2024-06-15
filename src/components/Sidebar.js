import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ListGroup, Form, Button} from 'react-bootstrap';
import './Sidebar.css';

function Sidebar({ chats, onCreateChat, onDeleteChat, onSelectChat, username }) {
    const [newChatName, setNewChatName] = useState('');
    const [models, setModels] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [selectedModel, setSelectedModel] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState('');

    useEffect(() => {
        const fetchModels = async () => {
            try {
                const response = await axios.get('http://localhost:5000/models');
                setModels(response.data);
                setSelectedModel(response.data[0]);
            } catch (error) {
                console.error('Failed to fetch models', error);
            }
        };

        const fetchTemplates = async () => {
            try {
                const response = await axios.get('http://localhost:5000/templates');
                setTemplates(response.data);
                setSelectedTemplate(response.data[0]);
            } catch (error) {
                console.error('Failed to fetch templates', error);
            }
        };

        fetchModels();
        fetchTemplates();
    }, []);

    const handleCreateChat = () => {
        if (newChatName.trim()) {
            onCreateChat(newChatName, selectedModel, selectedTemplate);
            setNewChatName('');
        }
    };

    const handleDeleteChat = async (chatName) => {
        try {
            await axios.post(`http://localhost:5000/chats/delete/${username}`, { chat_name: chatName });
            onDeleteChat(chatName);
        } catch (error) {
            console.error('Failed to delete chat', error);
        }
    };

    return (
        <div className="sidebar">
           
        <h5>Nouveau Chat</h5>
        <Form className='new-chat'>
                <Form.Control 
                    type="text"
                    value={newChatName}
                    onChange={(e) => setNewChatName(e.target.value)}
                    placeholder="Nommer le chat"
                />
                <Form.Control as="select" value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)}>
                    <option>Choisissez un modèle</option>
                    {models.map((model) => (
                        <option key={model} value={model}>{model}</option>
                    ))}
                </Form.Control>
                <Form.Control as="select" value={selectedTemplate} onChange={(e) => setSelectedTemplate(e.target.value)}>
                    {templates.map((template) => (
                        <option key={template} value={template}>{template}</option>
                    ))}
                </Form.Control>
            <div className='submit-btn'>
                    <Button onClick={handleCreateChat}>Nouveau Chat</Button>
            </div>
            
        </Form>
            <br />
            <h5>Chats</h5>
            <ListGroup>
                {chats.map((chat) => (
                    <ListGroup.Item key={chat.name} className="d-flex justify-content-between align-items-start">
                        <span onClick={() => onSelectChat(chat)}><h5>{chat.name}</h5></span>
                        <Button variant="danger" size="sm" onClick={() => handleDeleteChat(chat.name)}>Effacer</Button>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </div>
    );
}

export default Sidebar;
