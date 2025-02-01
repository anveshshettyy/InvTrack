import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import inventoryImg from '../assets/images/inventory3.jpeg';
import { IoIosArrowBack } from "react-icons/io";
import { axiosInstance } from '../axios';

const InventoryDetails = () => {
  const { inventoryId } = useParams(); // Access inventoryId from URL
  const navigate = useNavigate();
  const [inventory, setInventory] = useState(null);
  const [error, setError] = useState(null);
  const [currencySymbol, setCurrencySymbol] = useState('$');
  const [companyName, setCompanyName] = useState(''); // State to store company name

  useEffect(() => {
    const fetchInventoryDetails = async () => {
      try {
        const response = await axiosInstance.get(`/inventories/${inventoryId}`, { withCredentials: true });
        setInventory(response.data);
      } catch (error) {
        console.error('Error fetching inventory details:', error);
        setError('An error occurred while fetching inventory details.');
      }
    };

    fetchInventoryDetails();
  }, [inventoryId]);

  useEffect(() => {
    const fetchUserCountryAndCompany = async () => {
      try {
        const countryResponse = await axiosInstance.get('/country', { withCredentials: true });
        setCurrencySymbol(countryResponse.data === 'India' ? '₹' : '$');

        const companyResponse = await axiosInstance.get('/companyName', { withCredentials: true });
        setCompanyName(companyResponse.data); // Set the company name
      } catch (error) {
        console.error('Error fetching user country or company name:', error);
      }
    };

    fetchUserCountryAndCompany();
  }, []);

  if (error) {
    return <p className="text-red-500 text-center mt-6">{error}</p>;
  }

  if (!inventory) {
    return <p className="text-center mt-6">Loading...</p>;
  }

  const { name, description, items } = inventory;
  const totalQuantity = items.reduce((total, item) => total + (item.quantity || 0), 0);
  const totalItems = items.length;
  const totalCost = items.reduce((total, item) => total + (item.price || 0) * (item.quantity || 0), 0).toFixed(2);

  return (
    <div className="min-h-screen bg-gray-100 px-8 py-6 font-regular tracking-wide">
      {/* Back to Main Page Button */}
      <button
        onClick={() => navigate(`/profile/${companyName}/inventory`)} // Use companyName for navigation
        className="mb-6 px-6 py-3  text-black rounded-xl flex items-center justify-center gap-2  hover:bg-gray-300 transition duration-200 shadow-lg"
      >
        <IoIosArrowBack />Back to Main Page
      </button>

      <div className='h-[30vh] w-full bg-[#124462] rounded-md mb-10'>
        <img className='h-full w-full object-cover opacity-50 rounded-md  ' src={inventoryImg} alt="" />
      </div>

      {/* Inventory Details Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-[8vh] font-founders-grotesk tracking-normal font-semibold text-[#124468] mb-1">{name} <span className='font-regular tracking-wide text-zinc-300 text-[5vh] '>(Inventory)</span> </h2>
        <p className="text-lg text-gray-500 mb-6">{description || 'No description available.'}</p>

        {/* Items Table */}
        <h3 className="text-2xl font-semibold text-[#124468] mb-4">Items in Inventory</h3>
        {items.length > 0 ? (
          <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
            <thead className="bg-[#124468] text-white">
              <tr>
                <th className="border border-gray-300 px-6 py-4 text-left">Item Name</th>
                <th className="border border-gray-300 px-6 py-4 text-left">Quantity</th>
                <th className="border border-gray-300 px-6 py-4 text-left">Price</th>
                <th className="border border-gray-300 px-6 py-4 text-left">Total Cost</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-6 py-4">{item.itemName}</td>
                  <td className="border border-gray-300 px-6 py-4">{item.quantity}</td>
                  <td className="border border-gray-300 px-6 py-4">{currencySymbol}{(item.price || 0).toFixed(2)}</td>
                  <td className="border border-gray-300 px-6 py-4">{currencySymbol}{((item.price || 0) * (item.quantity || 0)).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No items available in this inventory.</p>
        )}
      </div>

      {/* Summary Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
        <h4 className="text-xl font-semibold text-[#124468] mb-4">Summary</h4>
        <p className="text-lg text-gray-600 mb-2">Total Quantity: {totalQuantity}</p>
        <p className="text-lg text-gray-600 mb-2">Total Items: {totalItems}</p>
        <p className="text-lg text-gray-600 mb-2">Total Cost: {currencySymbol}{totalCost}</p>
      </div>
    </div>
  );
};

export default InventoryDetails;
