import React, { useState, useEffect } from "react";
import { Input, Button, Card, Switch } from "antd";
import { Flex, Spin } from "antd";
import { v4 as uuidv4 } from "uuid";
import { LoadingOutlined } from '@ant-design/icons';
import NarrationLoader from "../Components/NarrationLoader";
import VoiceRecord from "../Components/VoiceRecord";
import ReactMarkdown from 'react-markdown';
import remarkGfm from "remark-gfm";

import {
  SendOutlined,
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
} from "@ant-design/icons";

import { showErrorNotification } from "../CommonElements/CommonFunctions";

import { askLexiBot } from "../Services/Service";

export default function ChatScreen() {
  const { TextArea } = Input;
  const [message, setMessage] = useState("");
  const [showLoader, setShowLoader] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [showNarrationLoader, setShowNarrationLoader] = useState(false);


  const [isRecording, setIsRecording] = useState(false);
  const [interimText, setInterimText] = useState("");



  useEffect(() => {
    // Assign unique session ID
    setSessionId(uuidv4());
  }, []);



  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! I’m LexiBot. What legal question can I help with today?" },
  ]);



  const handleCancelNarration = () => {
    window.speechSynthesis.cancel();
    setShowNarrationLoader(false);
  };



  const handleAutoNarration = (text) => {
     // Check if narration is enabled
    const isNarrationEnabled = localStorage.getItem("chat_narration") === "true";
    if (!isNarrationEnabled) return; // Exit if disabled

    if ('speechSynthesis' in window) {
      const cleanedText = text.replace(/[^\w\s.,!?]/g, ''); // Removes symbols except basic punctuation
      const speech = new SpeechSynthesisUtterance(cleanedText);
      setShowNarrationLoader(true);
      window.speechSynthesis.cancel(); // Stop any previous narration
      window.speechSynthesis.speak(speech);

      // in case if you ll need to change the voice of narration
      // const voices = window.speechSynthesis.getVoices();
      // const preferredVoice = voices.find(voice => voice.name.includes("Google UK English Female")) || voices[0];

      // const speech = new SpeechSynthesisUtterance(text);
      // speech.voice = preferredVoice;
      // speech.pitch = 1;
      // speech.rate = 1;
      
      // speechSynthesis.speak(speech);
    } else {
      console.warn("Text-to-Speech not supported in this browser.");
    }
  };

  const handleSend = async () => {
    const language = localStorage.getItem("chat_language") || "english";
    // showErrorNotification(language)
    if (message.trim() === "") {
      showErrorNotification("Please enter something ");
      return;
    }
    const newUserMessage = { sender: "you", text: message };
    setMessages((prev) => [...prev, newUserMessage]);
    setShowLoader(true);

    try {
      const res = await askLexiBot(message, sessionId,language);
      const newBotMessage = { sender: "lexibot", text: res.answer };
      setMessages((prev) => [...prev, newBotMessage]);
      const narration = localStorage.getItem("chat_narration");
      if(narration){
        handleAutoNarration(newBotMessage.text || "Theree is something wrong ! Please Try Again.")
      }
    } catch (err) {
      console.error(err);
      showErrorNotification("Sorry, something went wrong. Try again later.");
    } finally {
      setShowLoader(false);
      setMessage("");
    }
  };

  

  // const handleSend = async () => {
  //   setShowLoader(true);
  //   if (message.trim() === "") {
  //     showErrorNotification("Please ask some query");
  //     setShowLoader(false);
  //     return;
  //   }
  //   // Add user's message first
  //   setMessages((prev) => [...prev, { sender: "you", text: message }]);
  //   try {
  //     const result = await askLexiBot(message);
  //     console.log(result);

  //     if (result) {
  //       // Add bot's response
  //       setMessages((prev) => [
  //         ...prev,
  //         { sender: "you", text: message }, // Optional (if not already added above)
  //         { sender: "bot", text: result },
  //       ]);
  //     }
  //   } catch (error) {
  //     console.log("Caught error:", error); //See if this logs
  //     showErrorNotification("Sorry, something went wrong. Try again later.");
  //   }
  //   setShowLoader(false);
  //   setMessage(""); // Clear input field after sending
  // };

  // const chatWindow =

  const handleTranscript = (finalTranscript, interimTranscript = "") => {
    if (finalTranscript) {
      setMessage(prev => prev + " " + finalTranscript);
      setInterimText("");
    } else {
      setInterimText(interimTranscript);
    }
  };

  const handleRecordingStatus = (status) => {
    setIsRecording(status);
    if (!status) setInterimText(""); // Clear interim text when recording stops
  };


  return (
    <>
      
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "80vh",
          padding: "1rem",
        }}
      >
        {showNarrationLoader && <NarrationLoader onCancel={handleCancelNarration} />}
        {/* Chat Window */}
        <Card
          title="LexiBot- The Legal Advisor"
          bordered={false}
          style={{
            flex: 1,
            overflowY: "auto",
            marginBottom: "1rem",
            borderRadius: "10px",
          }}
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                textAlign: msg.sender === "you" ? "right" : "left",
                marginBottom: "0.5rem",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  padding: "10px 16px",
                  background: msg.sender === "you" ? "#1890ff" : "#f0f0f0",
                  color: msg.sender === "you" ? "#fff" : "#000",
                  borderRadius: "16px",
                  maxWidth: "70%",
                  wordWrap: "break-word",
                }}
              >
                {/*msg.text*/}
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
     {msg.text.replace(/### 4\. What if you\.\.\?[\s\S]*?(?=(###|\Z))/g, "")     }
</ReactMarkdown>
              </span>
            </div>
          ))}
        </Card>
{/* <h3> Ask your query </h3> */}
        {/* Input Area */}
        <div style={{ position: "relative", marginBottom: "2rem" }}>
          <TextArea
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="ask your query..."
            style={{
              paddingRight: "3rem",
            }}
          />

<div style={{
          position: "absolute",
          right: "0.5rem",
          bottom: "0.5rem",
          display: "flex",
          gap: "0.5rem",
        }}>
          <VoiceRecord onTranscript={handleTranscript} onRecordingStatus={handleRecordingStatus} />
          
          <Button
            type="text"
            icon={showLoader ? <Spin indicator={<LoadingOutlined spin />} /> : <SendOutlined />}
            onClick={handleSend}
            style={{
              color: message.trim() ? "#1890ff" : "#ccc",
              pointerEvents: message.trim() && !showLoader ? "auto" : "none",
            }}
          />
        </div>

      <Button
        type="text"
        icon={
          showLoader ? (
            <Flex align="center" gap="middle">
              <Spin size="small" /> {/* 👈 you can use 'small' to keep it subtle inside the button */}
            </Flex>
          ) : (
            <SendOutlined />
          )
        }
        onClick={handleSend}
        style={{
          position: "absolute",
          right: "0.5rem",
          bottom: "0.5rem",
          zIndex: 1,
          color: message.trim() ? "#1890ff" : "#ccc",
          pointerEvents: message.trim() && !showLoader ? "auto" : "none", // disables during loading too
        }}
      />
        </div>
      </div>
    </>
  );
}