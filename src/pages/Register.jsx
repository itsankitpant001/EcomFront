import axios from 'axios';
import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify"

const Register = () => {
  const navigate = useNavigate();
  const userId = window.localStorage.getItem("userId");

  useEffect(()=>{
    if(userId){
      navigate("/")
    }
  },[])
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
 

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://ecomback-1dms.onrender.com/register', { email, username, password });
      console.log(response.data);
      toast(response.data.message)
      if (response.data.message === 'User registered successfully') {
       
        navigate('/login');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-400 to-purple-500">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md transform transition-transform hover:scale-105">
        <h2 className="text-4xl font-bold text-center mb-8 text-gray-800">Register</h2>

        <form onSubmit={handleRegister}>
          {/* Email Field */}
          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300 hover:border-pink-500 hover:bg-pink-100"
              required
            />
          </div>

          {/* Username Field */}
          <div className="mb-6">
            <label htmlFor="username" className="block text-gray-700 font-semibold mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300 hover:border-purple-500 hover:bg-purple-100"
              required
            />
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300 hover:border-purple-500 hover:bg-purple-100"
              required
            />
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-2 px-4 rounded-lg hover:from-pink-500 hover:to-yellow-500 transition-transform duration-300 transform hover:scale-110"
          >
            Register
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-4 text-center">
          <span className="text-gray-600 text-sm">Already have an account?</span>{' '}
          <NavLink
            to="/login"
            className="text-sm text-blue-500 hover:underline hover:text-pink-500 transition-colors duration-300"
          >
            Login
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Register;
