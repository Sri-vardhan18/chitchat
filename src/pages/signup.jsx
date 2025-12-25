import React, { useState } from "react";
import {useNavigate} from 'react-router-dom';
import api from '../instances'; 

export default function SignupPage() {
  const [formData, setFormData] = useState({
    emailOrPhone: "",
    name: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const RedirectLogin = () => {
    navigate('/login');
  }

  const handleSubmit = async(e) => { 
    
    e.preventDefault(); 
    const payload ={ 
       username: formData.name,
        email: formData.emailOrPhone,
        password: formData.password,

    }
   
    try{
      const res= await api.post('/signup', 
        payload
      )
      if(res.status===200){
        navigate('/chat')

      }
      else{
        const error = new Error(res.error);
        throw error;
      }

    }catch(error){
      console.log("Signup failed", error);
    }
  
  };

  const handleGuest = async() => {
    console.log("Guest user clicked");
    try{
      const res= await api.post('/guestLogin') 
      sessionStorage.setItem("userId", res.data.user.userId);
      console.log("Guest login response:", res);
      if (res.status===200){
        navigate('/chat')
      }
    } catch(error){
      console.log("Guest login failed", error);
    }
    
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-md">
        
        <h2 className="text-2xl font-semibold text-center mb-6">Create Account</h2>

        <form onSubmit={handleSubmit}>
          {/* Email or Phone */}
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-600">Email or Phone</label>
            <input
              type="text"
              name="emailOrPhone"
              value={formData.emailOrPhone}
              onChange={handleChange}
              placeholder="Enter email or phone"
              className="w-full mt-1 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Name */}
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-600">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full mt-1 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="w-full mt-1 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Continue Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-xl text-lg font-medium hover:bg-blue-700 transition"
          >
            Continue
          </button>
        </form>

        {/* Divider */}
        <div className="my-4 flex items-center gap-2">
          <div className="h-px bg-gray-300 flex-1"></div>
          <span className="text-gray-500 text-sm">or</span>
          <div className="h-px bg-gray-300 flex-1"></div>
        </div>

        {/* Guest Login */}
        <button
          onClick={handleGuest}
          className="w-full bg-gray-200 text-gray-700 py-2 rounded-xl text-lg font-medium hover:bg-gray-300 transition"
        >
          Continue as Guest
        </button>
        <div className="text-sm text-blue-950">Have an accoutn? Login</div>
        <button
          onClick={RedirectLogin}
          className="w-full bg-gray-200 text-gray-700 py-2 rounded-xl text-lg font-medium hover:bg-gray-300 transition"
        >
          Login
        </button>
      </div>
    </div>
  );
}
