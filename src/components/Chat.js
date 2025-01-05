import React, { useState, useEffect, useCallback } from 'react';
import { initializeRTMClient } from '../utils/agoraUtils';
import config from './config';  // Fixed import path

const Chat = () => {
  const [client, setClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  const cleanup = useCallback(() => {
    if (channel) {
      channel.leave();
    }
    if (client) {
      client.logout();
    }
  }, [channel, client]);

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
    return cleanup;
  }, [cleanup]);

  // Rest of the component remains the same
};

export default Chat;