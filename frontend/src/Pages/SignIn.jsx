import axios from 'axios';
import { House } from 'lucide-react';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loginData = { email, password };

    try {
      const response = await axiosInstance.post('/login', loginData, { withCredentials: true });
      const { companyName } = response.data
      if (response.status === 200) {
        navigate(`/profile/${companyName}`);
      }
    } catch (error) {
      console.error('Error during login:', error.response ? error.response.data : error);
      setErrorMessage('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="flex h-screen justify-center items-center bg-zinc-100">
      <div className='absolute h-[30px] w-[60px]  -mt-[90vh]  -ml-[195vh] flex items-center justify-center rounded-sm '>
        <Link to="/" className='text-white font-regular hover:underline  ' > <House size={28} color="#124468" />
        </Link>
      </div>
      <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-1/2 flex">
        <div className="flex-grow p-8">
          <h2 className="font-founders-grotesk text-[8vh]  text-[#124468] text-center">Sign In to Your Account</h2>
          {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
          <div className='w-full '>
            <p className="text-[3vh] font-regular text-center -mt-4 text-zinc-500 ">Experience seamless inventory management with our cutting-edge software. Sign in to unlock your full potential!</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-[2.5vh] font-founders-grotesk tracking-normal  text-[#124468] " htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="example@mail.com"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-[2.5vh] font-founders-grotesk tracking-normal  text-[#124468]" htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="********"
                required
              />
            </div>
            <div className="flex items-center justify-between mb-4">
              <button
                type="submit"
                className="bg-[#124468] w-full hover:bg-[#050e14] text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Sign In
              </button>
            </div>
            <div className="text-center mt-4">
              <p className="text-sm text-[black]">Don't have an account? <Link to="/signup" className="text-[#124468] hover:text-blue-800 hover:underline">Sign Up</Link></p>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Login;
