import React, { useEffect, useState } from "react";
import { Button, message } from "antd";
import { AudioOutlined, AudioMutedOutlined } from "@ant-design/icons";

export default function VoiceRecord({ onTranscript, onRecordingStatus }) {
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if (!recognition && (window.SpeechRecognition || window.webkitSpeechRecognition)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = "en-US";

      recognitionInstance.onresult = (event) => {
        let interim = "";
        let final = "";
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += transcript + " ";
          } else {
            interim += transcript;
          }
        }
        
        onTranscript(final, interim);
      };

      recognitionInstance.onerror = (event) => {
        message.error("Voice recognition error: " + event.error);
        stopRecording();
      };

      setRecognition(recognitionInstance);
    }

    return () => stopRecording();
  }, []);

  const startRecording = () => {
    if (recognition) {
      recognition.start();
      setIsRecording(true);
      onRecordingStatus(true);
      message.info("Listening... Speak now");
    }
  };

  const stopRecording = () => {
    if (recognition) {
      recognition.stop();
      setIsRecording(false);
      onRecordingStatus(false);
    }
  };

  const toggleRecording = () => {
    if (!recognition) {
      message.warning("Voice recognition not available");
      return;
    }
    isRecording ? stopRecording() : startRecording();
  };

  return (
    <Button
      type="text"
      icon={isRecording ? <AudioMutedOutlined /> : <AudioOutlined />}
      onClick={toggleRecording}
      style={{ color: isRecording ? "#ff4d4f" : "#1890ff" }}
    />
  );
}