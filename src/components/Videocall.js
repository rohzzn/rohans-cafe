import React, { useState, useEffect, useCallback } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { initializeAgoraClient, joinChannel } from '../utils/agoraUtils';
import config from '../config';  // Fixed import path

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

  // Rest of the component remains the same
};

export default VideoCall;