import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Banner from '../assets/images/Banner.jpg'
import { IoIosLogOut } from "react-icons/io";
import { axiosInstance } from '../axios';


const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [inventoryItems, setInventoryItems] = useState([]);
  const navigate = useNavigate();
  const { companyName } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await axiosInstance.get(`http://localhost:3000/profile/${companyName}`, { withCredentials: true });
        setUserData(userResponse.data);


        const inventoryResponse = await axiosInstance.get(`http://localhost:3000/inventory/${userResponse.data.userid}`, { withCredentials: true });
        setInventoryItems(inventoryResponse.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        if (error.response && error.response.status === 401) {
          navigate('/signin');
        }
      }
    };

    fetchData();
  }, [navigate, companyName]);

  if (!userData) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 px-8 py-6">
      <div className='h-[35vh] w-full bg-[#124468] rounded-md relative '>
        <img className='h-full w-full object-cover opacity-50 absolute' src={Banner} alt="" />
      </div>
      <div className="flex flex-col  w-full mt-2 ">
        <h1 className="text-[12vh] text-center font-founders-grotesk text-[#124 468] -mb-2 ">Welcome, {userData.companyName}!</h1>
        <div className="text-lg mb-6 rounded-md border border-black p-5 ">
          <div className='flex justify-between ' >
            <h1 className='text-[5vh] font-founders-grotesk'>Company Information</h1>
            <div className=''>
            
            <Link to='/logout' className=" font-regular flex gap-1 text-gray-500 ">
            <IoIosLogOut /> <span className='-mt-[5px]'>Log Out</span>
          </Link>
            </div>
          </div>

          <div className='flex flex-wrap gap-x-[50vh] gap-y-5 '>
            <p className='text-[2.5vh] text-gray-400 '>Company Name <br /> <span className='text-black text-[2.8vh] '  >{userData.companyName}</span> </p>
            <p className='text-[2.5vh] text-gray-400 '>Company Email <br /> <span className='text-black text-[2.8vh] '  >{userData.email}</span></p>
            <p className='text-[2.5vh] text-gray-500'>Phone <br /> <span className='text-black text-[2.8vh] '  >{userData.phone}</span></p>
            <p className='text-[2.5vh] text-gray-400 '>Country<br /> <span className='text-black text-[2.8vh] '  >{userData.country}</span> </p>
            <p className='text-[2.5vh] ml-[67px] text-gray-400 '>State <br /> <span className='text-black text-[2.8vh]  '  >{userData.state}</span></p>
          </div>
        </div>
      </div>

      <div className='h-[10vh] w-full bg-[#124468] rounded-sm flex items-center justify-center hover:bg-blue-950 '>
        <Link to={`/profile/${companyName}/inventory`} className="text-[3vh] text-white ">
          Check out Your Inventory!
        </Link>
      </div>
      <div className='w-full mt-2 hover:underline '>
        <Link to={"/"} className="text-[2.5vh] font-regular text-gray-500 ml-[45%] ">
          Back to Home
        </Link>

      </div>
    </div>
  );
};

export default Profile;
