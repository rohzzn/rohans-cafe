// src/components/Chat.js
import React, { useState, useEffect, useCallback } from 'react';
import { initializeRTMClient } from '../utils/agoraUtils';
import config from '../config';

const Chat = () => {
  const [client, setClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [error, setError] = useState(null);

  const cleanup = useCallback(() => {
    if (channel) {
      channel.leave().catch(console.error);
    }
    if (client) {
      client.logout().catch(console.error);
    }
  }, [channel, client]);

  useEffect(() => {
    const init = async () => {
      try {
        const rtmClient = initializeRTMClient();
        if (!rtmClient) {
          setError('Failed to initialize RTM client');
          return;
        }

        await rtmClient.login({ uid: String(config.uid) });
        const rtmChannel = rtmClient.createChannel(config.channelName);
        await rtmChannel.join();
        
        rtmChannel.on('ChannelMessage', ({ text }, senderId) => {
          setMessages(prev => [...prev, { text, senderId }]);
        });
        
        setClient(rtmClient);
        setChannel(rtmChannel);
      } catch (error) {
        console.error('Error initializing chat:', error);
        setError('Failed to initialize chat. Please try again.');
      }
    };
    
    init();
    return cleanup;
  }, [cleanup]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || !channel) return;
    
    try {
      await channel.sendMessage({ text: inputMessage });
      setMessages(prev => [...prev, { text: inputMessage, senderId: String(config.uid) }]);
      setInputMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
    }
  };

  if (error) {
    return (
      <div>
        <h2>Chat</h2>
        <div className="error-message">{error}</div>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Chat</h2>
      <div className="chat-container" style={{ height: '300px', overflowY: 'auto', border: '1px solid #ddd', padding: '10px', marginBottom: '10px' }}>
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.senderId === String(config.uid) ? 'sent' : 'received'}`}>
            <strong>{msg.senderId === String(config.uid) ? 'You' : msg.senderId}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
          disabled={!channel}
        />
        <button onClick={sendMessage} disabled={!channel || !inputMessage.trim()}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;