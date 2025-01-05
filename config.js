const config = {
    appId: process.env.REACT_APP_AGORA_APP_ID,
    certificate: process.env.REACT_APP_AGORA_CERTIFICATE,
    channelName: 'default-channel',
    uid: Math.floor(Math.random() * 10000),
    videoConfig: {
      encoderConfig: '1080p',
      optimizationMode: 'detail',
      streamingMode: 'rtc'
    },
    audioConfig: {
      profile: 'music_standard',
      scenario: 'game_streaming'
    }
  };
  
  export default config;