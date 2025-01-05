import React from 'react';
import VoiceCall from './components/VoiceCall';
import VideoCall from './components/VideoCall';
import LiveStream from './components/LiveStream';
import Chat from './components/Chat';
import Whiteboard from './components/Whiteboard';

const App = () => {
  return (
    <div>
      <h1>Agora Integration Demo</h1>
      <VoiceCall />
      <VideoCall />
      <LiveStream />
      <Chat />
      <Whiteboard />
    </div>
  );
};

export default App;