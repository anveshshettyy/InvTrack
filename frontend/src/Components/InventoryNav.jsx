import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from './Searchbar';
import axios from 'axios';
import logoW from '../assets/logos/InvTrack_LogoWhite.png'
import { AlignJustify, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import Banner from '../assets/images/Buildings.jpg'

const InventoryNav = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [companyName, setCompanyName] = useState('');

  // Function to toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Fetch the company name from the backend
  useEffect(() => {
    const fetchCompanyName = async () => {
      try {
        const response = await axios.get('http://localhost:3000/companyName', { withCredentials: true });
        console.log(response.data);
        
        setCompanyName(response.data); // Assuming the response contains companyName
      } catch (error) {
        console.error('Error fetching company name:', error);
      }
    };

    fetchCompanyName();
  }, []);

  return (
    <div>
      {/* Navbar */}
      <div className='w-full bg-[#124468] px-10 py-3 text-white'>
        <div className='flex items-center justify-between'>
          {/* Left: Inventory title */}
          <div className='h-[30px] w-[110px] '>
            <img className='h-full w-full object-fit' src={logoW} alt="" />
          </div>

          {/* Right: Search bar and links */}
          <div className='flex items-center gap-20 text-[2.5vh] font-regular '>
            <SearchBar />
            <Link to="/" className='hover:underline'>Home</Link>
            <Link to={`/profile/${companyName}`} className='hover:underline'>{companyName || 'Loading...'}</Link> 
            <button className='hover:underline' onClick={toggleSidebar}><AlignJustify size={28} color="#ffffff" /></button>
          </div>
        </div>
      </div>

      {/* Sidebar (slide-in from right) */}
      <div
        className={`fixed top-0 right-0 h-full w-[300px] bg-white text-black p-5 transform transition-transform z-50 ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ transitionDuration: '300ms' }}
      >
        <div className='h-[10vh] w-full rounded-md shadow-xl '>
          <img className='h-full w-full object-fit rounded-md' src={Banner} alt="" />
        </div>
        <div className='h-[1px] w-full bg-black mt-5'></div>
        <h1 className='text-center font-founders-grotesk text-[5vh]'>{companyName}</h1>
        <div className='h-[1px] w-full bg-black -mt-2 '></div>
        <ul className='mt-10 space-y-6'>
          <li><Link to="/" className='hover:underline flex font-regular text-[3vh] items-center text-[#124468] '><ArrowUpRight size={23} color="#000000" />Home</Link></li>
          <div className=''>
            <Link to={`/profile/${companyName}`} className='hover:underline  flex font-regular text-[3vh] items-center text-[#124468] '><ArrowUpRight size={23} color="#000000" />View Profile</Link></div>
          <li><Link to="/contact" className='hover:underline flex font-regular text-[3vh] items-center text-[#124468]  '><ArrowUpRight size={23} color="#000000" />Contact Us</Link></li>
          <li><Link to="/logout" className='hover:underline flex font-regular text-[3vh] items-center text-[#124468] '><ArrowUpRight size={23} color="#000000" />Logout</Link></li>
        </ul>
      </div>

      {/* Background overlay when sidebar is open */}
      {isSidebarOpen && (
        <div
          className='fixed inset-0 bg-black opacity-50 z-40'
          onClick={toggleSidebar}
          style={{ width: 'calc(100% - 300px)', right: 0 }}
        />
      )}
    </div>
  );
};

export default InventoryNav;
