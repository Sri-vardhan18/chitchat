import { useState } from "react"; 
import api from '../instances';
function SignupModal({ isOpen, onClose, }) {
    if (!isOpen) return null;
  const [formData, setFormData] = useState({
      email: "",
      name: "",
      password: "",
    });

  const handleSignup = async(e) => { 
    const userId = sessionStorage.getItem("userId");
    e.preventDefault(); 
    const payload ={ 
       username: formData.name,
        email: formData.email,
        password: formData.password,
      

    }
    if(userId){
      payload.userId = userId;
    }
    try{
      const res= await api.post('/signup', 
        payload
      )
      if(res.status===200){
        onClose();

      }
      else{
        const error = new Error(res.error);
        throw error;
      }

    }catch(error){
      console.log("Signup failed", error);
    }
  
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
      <div className="bg-white p-4 rounded-lg w-80">
        <h2>Continue as Guest</h2>

        <input
          className="border p-2 mt-2 w-full"
          placeholder="Enter name"
          value={formData.name}
          onChange={e => setFormData({...formData, name: e.target.value})}
        />

        <input
          className="border p-2 mt-2 w-full"
          placeholder="Enter email"
          value={formData.email}
          onChange={e => setFormData({...formData, email: e.target.value})}
        />

        <input
          className="border p-2 mt-2 w-full"
          placeholder="Enter password"
          value={formData.password}
            onChange={e => setFormData({...formData, password: e.target.value})}
        />

        <button
          className="bg-blue-500 text-white p-2 mt-4 w-full"
          onClick={handleSignup}
        >
          Continue
        </button>

        <button className="p-2 w-full mt-2" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default SignupModal;