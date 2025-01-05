// src/components/LiveStream.js
import React, { useState, useEffect, useCallback } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { initializeAgoraClient } from '../utils/agoraUtils';
import config from '../config';  // Fixed import path

const LiveStream = () => {
  const [client, setClient] = useState(null);
  const [localTracks, setLocalTracks] = useState({ audio: null, video: null });
  const [isStreaming, setIsStreaming] = useState(false);

  const cleanup = useCallback(() => {
    if (localTracks) {
      Object.values(localTracks).forEach(track => track?.close());
    }
    if (client) {
      client.leave();
    }
  }, [client, localTracks]);

  useEffect(() => {
    const init = async () => {
      const agoraClient = AgoraRTC.createClient({
        mode: 'live',
        codec: 'vp8'
      });
      setClient(agoraClient);
    };
    init();

    return cleanup;
  }, [cleanup]);

  const startStream = async () => {
    try {
      // Set role as host
      await client.setClientRole('host');
      
      const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      const videoTrack = await AgoraRTC.createCameraVideoTrack();
      
      setLocalTracks({ audio: audioTrack, video: videoTrack });
      
      await client.join(config.appId, config.channelName, null, config.uid);
      await client.publish([audioTrack, videoTrack]);
      
      videoTrack.play('local-stream');
      setIsStreaming(true);
    } catch (error) {
      console.error('Error starting stream:', error);
    }
  };

  const stopStream = async () => {
    cleanup();
    setIsStreaming(false);
  };

  return (
    <div>
      <h2>Live Stream</h2>
      <div id="local-stream" className="video-player"></div>
      {!isStreaming ? (
        <button onClick={startStream}>Start Streaming</button>
      ) : (
        <button onClick={stopStream}>Stop Streaming</button>
      )}
    </div>
  );
};

export default LiveStream;