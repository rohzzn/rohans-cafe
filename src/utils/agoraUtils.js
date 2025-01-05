// src/utils/agoraUtils.js
import AgoraRTC from 'agora-rtc-sdk-ng';
import * as AgoraRTM from 'agora-rtm-sdk';  // Changed to import all as AgoraRTM
import config from '../config';

// Initialize Agora client
export const initializeAgoraClient = () => {
  const client = AgoraRTC.createClient({
    mode: 'rtc',
    codec: 'vp8'
  });
  
  return client;
};

// Initialize RTM client for chat
export const initializeRTMClient = () => {
  try {
    if (!config.appId) {
      throw new Error('Agora App ID is not configured');
    }
    const client = new AgoraRTM.default(config.appId);  // Use AgoraRTM.default
    return client;
  } catch (error) {
    console.error('Error initializing RTM client:', error);
    throw error;  // Throw error to be handled by the component
  }
};

// Join channel helper
export const joinChannel = async (client, channelName, token, uid) => {
  try {
    await client.join(config.appId, channelName, token || null, uid || null);
    return true;
  } catch (error) {
    console.error('Error joining channel:', error);
    return false;
  }
};