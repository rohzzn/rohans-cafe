import React, { useState, useEffect } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { initializeAgoraClient, joinChannel } from '../utils/agoraUtils';
import config from '../config';

const VideoCall = () => {
  const [client, setClient] = useState(null);
  const [localTracks, setLocalTracks] = useState({ audio: null, video: null });
  const [isJoined, setIsJoined] = useState(false);

  useEffect(() => {
    const init = async () => {
      const agoraClient = initializeAgoraClient();
      setClient(agoraClient);
    };
    init();
    
    return () => {
      Object.values(localTracks).forEach(track => track?.close());
      client?.leave();
    };
  }, []);

  const startCall = async () => {
    try {
      const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      const videoTrack = await AgoraRTC.createCameraVideoTrack();
      
      setLocalTracks({ audio: audioTrack, video: videoTrack });
      
      const joined = await joinChannel(client, config.channelName);
      if (joined) {
        await client.publish([audioTrack, videoTrack]);
        setIsJoined(true);
        
        // Display local video
        videoTrack.play('local-video');
      }
    } catch (error) {
      console.error('Error starting video call:', error);
    }
  };

  const endCall = async () => {
    Object.values(localTracks).forEach(track => track?.close());
    await client?.leave();
    setIsJoined(false);
  };

  return (
    <div>
      <h2>Video Call</h2>
      <div id="local-video" style={{ width: '320px', height: '240px' }}></div>
      <div id="remote-video" style={{ width: '320px', height: '240px' }}></div>
      {!isJoined ? (
        <button onClick={startCall}>Start Video Call</button>
      ) : (
        <button onClick={endCall}>End Call</button>
      )}
    </div>
  );
};

export default VideoCall;