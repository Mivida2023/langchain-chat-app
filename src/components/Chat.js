import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Chat({ username, chats }) {
    const [currentChat, setCurrentChat] = useState(null);
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);

    useEffect(() => {
        console.log("Chats updated: ", chats);
    }, [chats]);

    const selectChat = async (chatName) => {
        setCurrentChat(chatName);
        try {
            const response = await axios.get(`http://localhost:5000/chats/${username}`);
            const selectedChat = response.data.chats.find(chat => chat.name === chatName);
            setChatHistory(selectedChat.history);
            console.log("Selected Chat History: ", selectedChat.history);
        } catch (error) {
            console.error('Failed to load chat history', error);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        console.log("handleSendMessage called with message: ", message);
        try {
            const response = await axios.post('http://localhost:5000/chats/response', {
                username,
                chat_name: currentChat,
                message,
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log("Received response: ", response.data.response);
            setChatHistory([...chatHistory, { type: 'Human', content: message }, { type: 'AI', content: response.data.response }]);
            setMessage('');
        } catch (error) {
            console.error('Failed to send message', error);
        }
    };

    return (
        <div>
            <h2>Chats</h2>
            <div>
                {chats.map((chat, index) => (
                    <button key={index} onClick={() => selectChat(chat.name)}>
                        {chat.name}
                    </button>
                ))}
            </div>
            {currentChat && (
                <div>
                    <h3>{currentChat}</h3>
                    <div>
                        {chatHistory.map((msg, index) => (
                            <div key={index} className={msg.type}>
                                {msg.content}
                            </div>
                        ))}
                    </div>
                    <form onSubmit={handleSendMessage}>
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button type="submit">Send</button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default Chat;
