import React from 'react';
import VoiceCall from './components/VoiceCall';
import VideoCall from './components/VideoCall';
import LiveStream from './components/LiveStream';
import Chat from './components/Chat';
import './App.css';

const App = () => {
  return (
    <div className="app-container">
      <h1 className="app-title">Agora Integration Demo</h1>
      <div className="features-grid">
        <div className="feature-card">
          <VoiceCall />
        </div>
        <div className="feature-card">
          <VideoCall />
        </div>
        <div className="feature-card">
          <LiveStream />
        </div>
        <div className="feature-card">
          <Chat />
        </div>
      </div>
    </div>
  );
};

export default App;