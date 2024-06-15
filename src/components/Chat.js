import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container} from 'react-bootstrap';
import './Chat.css';

function Chat({ chat, username }) {
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState(chat.history);

    useEffect(() => {
        setChatHistory(chat.history);
    }, [chat]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`http://localhost:5000/chats/message/${username}`, {
                chat_name: chat.name,
                message,
            });
            const response = await axios.post(`http://localhost:5000/chats/response/${username}`, {
                chat_name: chat.name,
                message,
            });
            setChatHistory([...chatHistory, { type: 'Human', content: message }, { type: 'AI', content: response.data.response }]);
            setMessage('');
        } catch (error) {
            console.error('Failed to send message', error);
        }
    };

    return (
 
        <Container className="chat-container d-flex justify-content-center">
            <h3>{chat.name}</h3>
            <div className="chat-history">
                {chatHistory.map((msg, index) => (
                    <div key={index} className={`chat-message ${msg.type.toLowerCase()}`}>
                        {msg.content}
                    </div>
                ))}
            </div>
            <div className="chat-footer">
                <form className="chat-input" onSubmit={handleSendMessage}>
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message"
                    />
                    <button type="submit">Send</button>
                </form>
            </div>
        </Container>
    );
}

export default Chat;
