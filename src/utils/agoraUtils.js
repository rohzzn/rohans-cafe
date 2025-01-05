import AgoraRTC from 'agora-rtc-sdk-ng';
import AgoraRTM from 'agora-rtm-sdk';
import config from './config';

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
  const client = AgoraRTM.createInstance(config.appId);
  return client;
};

// Generate token (replace with your token server in production)
export const generateToken = async (channelName, uid) => {
  // In production, make API call to your token server
  return null; // Temporary placeholder
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