import React, { useState, useEffect } from "react";
import socket from "../assets/socket"; 
import api from '../instances';
import { UserPlus } from "lucide-react";  
import { toast } from 'react-toastify' 
import { useNavigate } from "react-router-dom"; 
import RedirectModal from "./redirectModel"; 
import SignUpModel from "./signUpModel";

const ChatWindow = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [roomId, setRoomId] = useState(null);
  const [matched, setMatched] = useState(false);
  const [searching, setSearching] = useState(false);
  const [locationSet, setLocationSet] = useState(false);
  const userId = sessionStorage.getItem("userId");  
  const [isTyping, setIsTyping] = useState(false);        // I am typing
const [partnerTyping, setPartnerTyping] = useState(false); 
const [partnerId, setPartnerId] = useState(null);  
const [open, setOpen] = useState(false);
const navigate = useNavigate(); 
const [isOpenSignup, setIsOpenSignup] = useState(false);



  const startChat = () => {
    if (!locationSet) {
      alert("Please wait for location to be set first!");
      return;
    }
    setSearching(true);
    
    socket.emit("find_match", { userId, radiusPreference: 50 });
  };

  const updateLocation = async (userId) => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported in your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        console.log("📍 Attempting to set location:", { latitude, longitude });

        try {
          const response = await api.post("/update-location", {
            userId, 
            latitude, 
            longitude 
          });

          console.log("✅ Location update response:", response.data);
          setLocationSet(true);
          alert(`Location set! Lat: ${latitude}, Lng: ${longitude}`);
        } catch (error) {
          console.error("❌ Location update failed:", error);
          alert("Failed to update location. Check console.");
        }
      },
      (error) => {
        console.error("Location error:", error);
        alert("Please allow location access to use nearby chat.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // Register user once when component mounts
  useEffect(() => {
    if (userId) {
      
      updateLocation(userId);
      socket.emit("register", userId);
    }
  }, [userId]);

  // Socket listeners
  useEffect(() => {
    const handleMatched = ({ roomId, partnerId }) => {
      setPartnerId(partnerId);
      setRoomId(roomId);
      setMatched(true);
      setSearching(false);
    }; 
    socket.on("typing", ({ isTyping }) => {
      setPartnerTyping(isTyping);
    });
    const handleReceiveMessage = (data) => {
      
      setChat((prev) => [...prev, { fromMe: false, text: data.message }]);
    };

    socket.on("matched", handleMatched);
    
    socket.on("receive_message", handleReceiveMessage); 

    socket.on("friendRequest", (data) => {
      toast.info(` ${data.message}`);
    })

    return () => {
      socket.off("matched", handleMatched);
      
      socket.off("receive_message", handleReceiveMessage);
    };
  }, []);

  useEffect(() => {
  socket.on("chat_ended", () => {
    console.log("Chat ended by partner or you");
    endChatUI(true); 
  });

  return () => {
    socket.off("chat_ended");
  };
}, []); 

  const endChatUI = (userLeft = false) => {
  setMatched(false);
  setRoomId(null);
  setPartnerId(null);
  setChat([]);
  setPartnerTyping(false);
  
  if (userLeft) {
    alert("Your chat partner has left the conversation.");
  } else {
    alert("You left the chat.");
  }
} 
  const handleSendFriendRequest = async () => {
    try {
      const response = await api.post('/friend-request/send', {
        fromUserId: userId,
        toUserId: partnerId
      }); 

      if(response.status === 200){
        toast.success('Friend request sent successfully!');
      }
      
    } catch (error) {
      const { status, data } = error.response || {};

    if (status === 403 && data?.requiresSignup) {
     setOpen(true);
      return;
    }

    toast.error('Failed to send friend request.');     
    }
  }


  const sendMessage = () => {
    if (!message.trim() || !roomId) return;

    
    socket.emit("send_message", {
      roomId,
      message
    });

    setChat((prev) => [...prev, { fromMe: true, text: message }]);
    setMessage("");
  }; 

  const handleleave = () => {
    socket.emit("end_chat", { roomId, partnerId }); 
    endChatUI(false);
   
  }

  

  return (
    <div className="flex-1 flex flex-col bg-gray-100"> 

    {searching && (
  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-4 rounded-lg shadow-xl text-center">
      <p className="text-lg font-semibold">Please wait...</p>
      <p className="text-sm  text-gray-600 mt-2">Finding a nearby partner for you</p>
    </div>
  </div>
)}
      {!matched ? (
        <div className="flex flex-col items-center justify-center h-full gap-4">
          <div className="text-center mb-4">
            <p className="text-sm text-gray-600">
              Status: {locationSet ? "✅ Location Set" : "⏳ Setting Location..."}
            </p>
            <p className="text-xs text-gray-500 mt-2">UserId: {userId}</p>
          </div>
          
          <button
            onClick={startChat}
            disabled={searching || !locationSet}
            className={`px-6 py-3 rounded-lg ${
              searching || !locationSet
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-blue-600 hover:bg-blue-700"
            } text-black`}
          >
            {searching ? "Searching..." : "Start Chat"}
          </button>

        </div>
      ) : (
        <>
          <div className="p-4 bg-white shadow-md border-b flex items-center justify-between">
  <h2 className="text-xl font-semibold">You are connected!</h2>

  <button 
  onClick={handleSendFriendRequest}
  className="text-gray-700">
    <UserPlus size={20} />
  </button>
</div>

          <div className="flex-1 p-4 overflow-y-auto">
            {chat.map((msg, index) => (
              <div
                key={index}
                className={`mb-3 flex ${
                  msg.fromMe ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`p-2 rounded-xl max-w-xs ${
                    msg.fromMe ? "bg-blue-500 text-white" : "bg-gray-300"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 flex bg-white border-t">  
            <div className="p-2 text-gray-500">{partnerTyping ? "typing...":""}</div>
            <input
              value={message}
              onChange={(e) => {
                setMessage(e.target.value)  
                if(!isTyping){
                  setIsTyping(true);
                  socket.emit("typing", { roomId, isTyping: true });

                }
                clearTimeout(window.typingTimeout);
                window.typingTimeout = setTimeout(() => {
                  setIsTyping(false);
                  socket.emit("typing", { roomId, isTyping: false });
                }, 2000);
              } 
                
              }
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type..."
              className="flex-1 border p-2 rounded-lg"
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 text-black px-4 ml-2 rounded-lg hover:bg-blue-700"
            >
              Send
            </button> 
             <button onClick={handleleave}>Leave</button>
          </div>
        </>
      )} 
      <RedirectModal
  open={open}
  text="Please Signup to send friend Request?"
  setIsOpenSignup={setIsOpenSignup}
  onClose={() => setOpen(false)}
/> 
      <SignUpModel
        isOpen={isOpenSignup}
        onClose={() => setIsOpenSignup(false)}
      />
    </div>
  );
};

export default ChatWindow;