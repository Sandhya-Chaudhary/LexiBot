import React, {useState,useEffect} from 'react'
import { Routes,Route } from "react-router-dom";
import Header from '../Components/Header'
import ChatScreen from '../Pages/ChatScreen'
import ChatHistory from '../Pages/ChatHistory';
import ChatSetting from '../Pages/ChatSetting';

export default function Router() {
    return(
        <Routes>
            <Route path="/" element={<ChatScreen />} />
            <Route path="/history" element={<ChatHistory />} />
            <Route path="/setting" element={<ChatSetting />} />
        </Routes>
    )
}

