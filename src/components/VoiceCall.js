import React, { useState, useEffect } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { initializeAgoraClient, joinChannel } from '../utils/agoraUtils';
import config from '../config';

const VoiceCall = () => {
  const [client, setClient] = useState(null);
  const [localAudioTrack, setLocalAudioTrack] = useState(null);
  const [isJoined, setIsJoined] = useState(false);

  useEffect(() => {
    const init = async () => {
      const agoraClient = initializeAgoraClient();
      setClient(agoraClient);
    };
    init();
    
    return () => {
      if (localAudioTrack) {
        localAudioTrack.close();
      }
      client?.leave();
    };
  }, []);

  const startCall = async () => {
    try {
      const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      setLocalAudioTrack(audioTrack);
      
      const joined = await joinChannel(client, config.channelName);
      if (joined) {
        await client.publish(audioTrack);
        setIsJoined(true);
      }
    } catch (error) {
      console.error('Error starting voice call:', error);
    }
  };

  const endCall = async () => {
    if (localAudioTrack) {
      localAudioTrack.close();
    }
    await client?.leave();
    setIsJoined(false);
  };

  return (
    <div>
      <h2>Voice Call</h2>
      {!isJoined ? (
        <button onClick={startCall}>Start Call</button>
      ) : (
        <button onClick={endCall}>End Call</button>
      )}
    </div>
  );
};

export default VoiceCall;