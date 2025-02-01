import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoHome } from "react-icons/io5";
import { House } from 'lucide-react';
import { axiosInstance } from '../axios';

const countries = [
    { name: "United States", states: ["California", "Florida", "New York", "Texas"] },
    { name: "Canada", states: ["Alberta", "British Columbia", "Ontario", "Quebec"] },
    { name: "United Kingdom", states: ["England", "Scotland", "Wales", "Northern Ireland"] },
    { 
      name: "India", 
      states: [
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
        "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", 
        "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", 
        "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
        "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",  
        "Uttar Pradesh", "Uttarakhand", "West Bengal"
      ]
    }
];

const SignUp = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    password: '',
    country: '',
    state: '',
    phone: '',
  });
  const [states, setStates] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const selectedCountry = countries.find(c => c.name === formData.country);
    setStates(selectedCountry ? selectedCountry.states : []);
  }, [formData.country]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post('/signup/create', formData, { withCredentials: true });
      const { companyName } = response.data;
      if (response.status === 200) {
        navigate(`/profile/${companyName}`);
      }
    } catch (error) {
      console.error('Error during signup:', error.response ? error.response.data : error);
      setErrorMessage('Signup failed. Please try again.');
    }
  };

  return (
    <div className="flex h-full bg-gray-100 ">
      <div className="hidden md:flex md:w-1/2 bg-[#124468] text-white p-10 flex-col justify-center relative">
      <div className='absolute h-[30px] w-[60px]  -mt-[95vh] -ml-[4.5vh] flex items-center justify-center rounded-sm '>
        <Link to="/" className='' > <House size={28} color="#ffffff" />
        </Link>
      </div>
        <h1 className="text-4xl font-bold mb-4">Welcome to IMS</h1>
        <p className="text-lg">Manage your inventory efficiently with our powerful software solution. Sign up today and take control of your inventory management.</p>
      </div>
      <div className="md:w-1/2 px-8 md:px-32 bg-white flex flex-col justify-center py-5 ">
        <h2 className="font-founders-grotesk   text-[8vh] tracking-normal  text-center text-[#124468] mb-3">Create an Account</h2>
        {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700  font-founders-grotesk text-[2.5vh]  " htmlFor="companyName">Company Name</label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your Company Name"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700  font-founders-grotesk text-[2.5vh]  " htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="example@mail.com"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700  font-founders-grotesk text-[2.5vh]  " htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="********"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700  font-founders-grotesk text-[2.5vh]  " htmlFor="country">Country</label>
            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select your country</option>
              {countries.map((c) => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700  font-founders-grotesk text-[2.5vh]  " htmlFor="state">State</label>
            <select
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={!states.length}
            >
              <option value="">Select your state</option>
              {states.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700  font-founders-grotesk text-[2.5vh]  " htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="123-456-7890"
              required
            />
          </div>
          <div className="flex items-center justify-between mb-4  ">
            <button
              type="submit"
              className="bg-[#124468] hover:bg-[#050e14] text-white font-bold w-full py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Sign Up
            </button>
          </div>
          <div className="text-center mt-4">
            <p className=" text-gray-600">Already a user? <Link to="/signin" className="text-[#124468] hover:text-blue-800 hover:underline">Sign In</Link></p>
          </div>
          <div className="text-center mt-4">
            <p className=" text-gray-600">Or sign up with:</p>
            <div className="flex justify-center gap-4 mt-2">
              <button className="bg-red-600 text-white rounded-full p-2 hover:bg-red-700 transition">
                <i className="fab fa-google"></i> 
              </button>
              <button className="bg-[#124468] text-white rounded-full p-2 hover:bg-blue-700 transition">
                <i className="fab fa-facebook-f"></i>
              </button>
              <button className="bg-blue-400 text-white rounded-full p-2 hover:bg-blue-500 transition">
                <i className="fab fa-twitter"></i>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
