import React from 'react';
import { useSpeechRecognition } from 'react-speech-recognition';
import { MicrophoneOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';

const VoiceRecognition = ({ text, onTranscriptChange }) => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <div>Your browser doesn't support speech recognition.</div>;
  }

  if (!isMicrophoneAvailable) {
    return <div>Microphone is not connected or permission is not granted.</div>;
  }

  const handleListen = () => {
    if (listening) {
      SpeechRecognition.stopListening();
      // Pass the transcript to parent component if needed
      if (onTranscriptChange) {
        onTranscriptChange(transcript);
      }
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <h1>I am Sandhya, {text}</h1>
      <Button
        type={listening ? 'primary' : 'default'}
        danger={listening}
        icon={<MicrophoneOutlined />}
        onClick={handleListen}
        shape="circle"
      />
      {listening && <p>Listening...</p>}
      {transcript && <p>You said: {transcript}</p>}
    </div>
  );
};

export default VoiceRecognition;