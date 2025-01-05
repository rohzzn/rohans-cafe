import React, { useState, useEffect } from 'react';
import { WhiteWebSdk, DeviceType } from '@netless/white-web-sdk';
import config from '../config';

const Whiteboard = () => {
  const [room, setRoom] = useState(null);
  const [isJoined, setIsJoined] = useState(false);

  useEffect(() => {
    return () => {
      if (room) {
        room.disconnect();
      }
    };
  }, [room]);

  const joinWhiteboard = async () => {
    try {
      const whiteWebSdk = new WhiteWebSdk({
        appIdentifier: config.appId,
        deviceType: DeviceType.Surface
      });

      // In production, get these from your server
      const roomParams = {
        uuid: "whiteboard-demo-room",
        roomToken: "TEMP-TOKEN", // Replace with actual token
      };

      const whiteRoom = await whiteWebSdk.joinRoom({
        uuid: roomParams.uuid,
        roomToken: roomParams.roomToken,
        invisiblePlugins: [],
        useMultiViews: true,
      });

      setRoom(whiteRoom);
      setIsJoined(true);
    } catch (error) {
      console.error('Error joining whiteboard:', error);
    }
  };

  return (
    <div>
      <h2>Interactive Whiteboard</h2>
      <div id="whiteboard" style={{ width: '800px', height: '600px', border: '1px solid #ccc' }}>
        {!isJoined ? (
          <button onClick={joinWhiteboard}>Join Whiteboard</button>
        ) : (
          <div>Whiteboard Connected</div>
        )}
      </div>
    </div>
  );
};

export default Whiteboard;