import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Use Link for navigation
import axios from 'axios';
import SearchBar from './Searchbar';
import logo from '../assets/logos/InvTrack_Logo.png'
import { axiosInstance } from '../axios';

const Navbar = () => {
  const [companyName, setCompanyName] = useState(null);

  useEffect(() => {
    // Fetch company name from backend
    const fetchCompanyName = async () => {
      try {
        const response = await axiosInstance.get('/companyName', { withCredentials: true });
        console.log('Fetched company data:', response.data);

        if (response.data) {
          setCompanyName(response.data); // Assuming companyName is a property in the response
        }
      } catch (error) {
        console.error('Error fetching company name:', error);
      }
    };

    fetchCompanyName();
  }, []);

  return (
    <div className="bg-zinc-100 bg-blend-saturation ">
      <div className="h-[15vh] w-full flex items-center justify-between px-10 ">
        <div className='h-[110px] w-[225px] '>
          <img className='h-full w-full object-cover' src={logo} alt="" />
        </div>

        <div className="hidden md:flex gap-20 mt-3 ">
          <Link 
            to={companyName ? `/profile/${companyName}/dashboard` : '/signin'} 
            className="text-gray-800 text-[18px] font-regular hover:text-[#124468] hover:underline transition"
          >
            Dashboard
          </Link>
          <Link 
            to={companyName ? `/profile/${companyName}/inventory` : "/signin"} 
            className="text-gray-800 text-[18px] font-regular hover:text-[#124468] hover:underline transition"
          >
            Inventory
          </Link>
          <Link 
            to={companyName ? "/categories" : "/signin"} 
            className="text-gray-800 text-[18px] font-regular hover:text-[#124468] hover:underline transition"
          >
            Categories
          </Link>
          <Link 
            to="/contact" // About Us link functional for all users
            className="text-gray-800 text-[18px] font-regular hover:text-[#124468] hover:underline transition"
          >
            Contact Us
          </Link>
        </div>

        <div className="hidden md:flex items-center mt-3">
          {companyName && <SearchBar />}

          {companyName ? (
            <Link to={`/profile/${companyName}`} className="text-[#124468] font-bold text-[3vh] px-10 ">
              {companyName}
            </Link>
          ) : (
            <>
              <Link to="/signup" className="px-6 py-2  text-black rounded-lg hover:text-[#124468] font-regular text-[18px] hover:underline transition">
                Sign Up
              </Link>
              <Link to="/signin" className="px-6 py-2  text-black rounded-lg hover:text-[#124468] font-regular text-[18px] hover:underline transition">
                Sign In
              </Link>
              
            </>
          )}
        </div>

        <div className="md:hidden">
          <button className="text-gray-800 text-[18px] font-regular hover:text-[#124468] hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden">
        <div className="flex flex-col gap-4 p-4">
          <Link 
            to={companyName ? `/profile/${companyName}/dashboard` : '/signin'} 
            className="text-gray-800 text-[18px] font-regular hover:text-[#124468] hover:underline transition"
          >
            Dashboard
          </Link>
          <Link 
            to={companyName ? `/profile/${companyName}/inventory` : "/signin"} 
            className="text-gray-800 text-[18px] font-regular hover:text-[#124468] hover:underline transition"
          >
            Inventory
          </Link>
          <Link 
            to={companyName ? "/categories" : "/signin"} 
            className="text-gray-800 text-[18px] font-regular hover:text-[#124468] hover:underline transition"
          >
            Categories
          </Link>
          <Link 
            to="/about" // About Us link functional for all users
            className="text-gray-800 text-[18px] font-regular hover:text-[#124468] hover:underline transition"
          >
            About Us
          </Link>
          {companyName ? (
            <Link to={`/profile/${companyName}`} className="text-center text-blue-600 font-semibold">
              {companyName}
            </Link>
          ) : (
            <Link to="/signup" className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-center">
              Sign Up
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
