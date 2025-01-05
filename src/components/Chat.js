import React, { useState, useEffect } from 'react';
import { initializeRTMClient } from '../utils/agoraUtils';
import config from '../config';

const Chat = () => {
  const [client, setClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  useEffect(() => {
    const init = async () => {
      const rtmClient = initializeRTMClient();
      await rtmClient.login({ uid: String(config.uid) });
      
      const rtmChannel = rtmClient.createChannel(config.channelName);
      await rtmChannel.join();
      
      rtmChannel.on('ChannelMessage', ({ text }, senderId) => {
        setMessages(prev => [...prev, { text, senderId }]);
      });
      
      setClient(rtmClient);
      setChannel(rtmChannel);
    };
    
    init();
    
    return () => {
      channel?.leave();
      client?.logout();
    };
  }, []);

  const sendMessage = async () => {
    if (inputMessage.trim() === '') return;
    
    try {
      await channel.sendMessage({ text: inputMessage });
      setMessages(prev => [...prev, { text: inputMessage, senderId: String(config.uid) }]);
      setInputMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div>
      <h2>Chat</h2>
      <div style={{ height: '300px', overflowY: 'auto' }}>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.senderId}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;