const config = {
    appId: process.env.REACT_APP_AGORA_APP_ID,
    certificate: process.env.REACT_APP_AGORA_CERTIFICATE,
    
    // Default channel settings
    channelName: 'default-channel',
    uid: Math.floor(Math.random() * 10000),
    
    // Video settings
    videoConfig: {
      encoderConfig: '1080p',
      optimizationMode: 'detail',
      streamingMode: 'rtc'
    },
    
    // Audio settings
    audioConfig: {
      profile: 'music_standard',
      scenario: 'game_streaming'
    }
  };
  
  export default config;