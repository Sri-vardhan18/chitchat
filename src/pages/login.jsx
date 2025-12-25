import React, { useState } from "react";
import api from '../instances';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    emailOrPhone: "",
    
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try{
      const res= api.post(`/login`, 
        {
          email: formData.emailOrPhone,
          password: formData.password,
        }
      )

      console.log("Login response:", res);
      if(res.status===200){
        sessionStorage.setItem("userId", res.data.userId);
        navigate('/chat') }
    } 
    catch(error){
      console.log("Login failed", error);
    }

  };


  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-md">
        
        <h2 className="text-2xl font-semibold text-center mb-6">Login into Account</h2>

        <form onSubmit={handleSubmit}>
          {/* Email or Phone */}
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-600"> Phone Number</label>
            <input
              type="text"
              name="emailOrPhone"
              value={formData.emailOrPhone}
              onChange={handleChange}
              placeholder="Enter phone number"
              className="w-full mt-1 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Name */}
         

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
            className="w-full bg-blue-600 text-black py-2 rounded-xl text-lg font-medium hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

       

        
      </div>
    </div>
  );
}
