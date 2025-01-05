// src/components/VideoCall.js
import React, { useState, useEffect, useCallback } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { initializeAgoraClient, joinChannel } from '../utils/agoraUtils';
import config from '../config';

const VideoCall = () => {
  const [client, setClient] = useState(null);
  const [localTracks, setLocalTracks] = useState({ audio: null, video: null });
  const [isJoined, setIsJoined] = useState(false);
  const [remoteUsers, setRemoteUsers] = useState([]);

  const cleanup = useCallback(() => {
    Object.values(localTracks).forEach(track => track?.close());
    if (client) {
      client.leave();
    }
  }, [client, localTracks]);

  useEffect(() => {
    const init = async () => {
      const agoraClient = initializeAgoraClient();
      
      agoraClient.on('user-published', async (user, mediaType) => {
        await agoraClient.subscribe(user, mediaType);
        if (mediaType === 'video') {
          setRemoteUsers(prev => [...prev, user]);
          user.videoTrack.play(`remote-video-${user.uid}`);
        }
        if (mediaType === 'audio') {
          user.audioTrack.play();
        }
      });

      agoraClient.on('user-left', user => {
        setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid));
      });

      setClient(agoraClient);
    };

    init();
    return cleanup;
  }, [cleanup]);

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

  return (
    <div>
      <h2>Video Call</h2>
      <div id="local-video" className="video-player"></div>
      {remoteUsers.map(user => (
        <div 
          id={`remote-video-${user.uid}`} 
          key={user.uid} 
          className="video-player"
        ></div>
      ))}
      {!isJoined ? (
        <button onClick={startCall}>Start Video Call</button>
      ) : (
        <button onClick={cleanup}>End Call</button>
      )}
    </div>
  );
};

export default VideoCall;