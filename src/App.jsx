import { useEffect, useState } from 'react'

import './App.css'
import { Routes, Route, Link } from "react-router-dom";
import SignupPage from './pages/signup';
import LoginPage from './pages/login';
import Chat from './pages/chat';
// import  socketIO from 'socket.io-client';
// const socket = socketIO.connect('http://localhost:5000',{
//     autoConnect: false
// });  

import socket from './assets/socket';

import {useDispatch, useSelector} from 'react-redux';
import { setSocketConnected, setSocketID } from './store/socketReducer'; 


function App() { 
  // const [socketConnected, setSocketConnected] = useState(false);  
  const dispatch = useDispatch();
  useEffect(() => {
      // Manually initiate the connection
    if (!socket.connected) {
       socket.connect();
      // setSocketConnected(true);
      // dispatch(setSocketID(socket.id));
      // dispatch(setSocketConnected(true));
    }

    socket.on('connect', () => {
      // setSocketConnected(true); 
      dispatch(setSocketConnected(true));
      dispatch(setSocketID(socket.id));
      console.log('Socket connected:', socket.id);
    });

    socket.on('disconnect', () => {
      // setSocketConnected(false);
      dispatch(setSocketConnected(false));
      dispatch(setSocketID(null));
      console.log('Socket disconnected');
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);
  
  

  return (
    <div className='h-screen w-100%'>
      <Routes>
        <Route path="/" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
         <Route path="/chat" element={<Chat />} />
        
      </Routes>
      
      
      
    </div>
  )
}

export default App
