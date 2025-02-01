import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import inventoryImg from '../assets/images/inventory3.jpeg'; // Import image
import { IoIosArrowBack } from "react-icons/io";
import { axiosInstance } from '../axios';

const ItemDetails = () => {
  const { itemId } = useParams(); // Access itemId from URL
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [error, setError] = useState(null);
  const [currencySymbol, setCurrencySymbol] = useState('$');

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const response = await axiosInstance.get(`/item/${itemId}`, { withCredentials: true });
        setItem(response.data);
      } catch (error) {
        console.error('Error fetching item details:', error);
        setError('An error occurred while fetching item details.');
      }
    };

    fetchItemDetails();
  }, [itemId]);

  useEffect(() => {
    const fetchUserCountry = async () => {
      try {
        const response = await axiosInstance.get('/country', { withCredentials: true });
        setCurrencySymbol(response.data === 'India' ? '₹' : '$');
      } catch (error) {
        console.error('Error fetching user country:', error);
      }
    };

    fetchUserCountry();
  }, []);

  if (error) {
    return <p className="text-red-500 text-center mt-6">{error}</p>;
  }

  if (!item) {
    return <p className="text-center mt-6">Loading...</p>;
  }

  const { itemName, quantity, price, description, inventory } = item;

  return (
    <div className="min-h-screen bg-gray-100 px-8 py-6 font-regular tracking-wide">
      {/* Back to Inventory Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-6 py-3 text-black rounded-xl flex items-center justify-center gap-2 hover:bg-gray-300 transition duration-200 shadow-lg"
      >
        <IoIosArrowBack /> Back to Inventory
      </button>

      {/* Background Image Section */}
      <div className="h-[30vh] w-full bg-[#124462] rounded-md mb-10">
        <img className="h-full w-full object-cover opacity-50 rounded-md" src={inventoryImg} alt="" />
      </div>

      {/* Item Details Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-[8vh] font-semibold text-[#124468] mb-1">
          {itemName} <span className="font-regular tracking-wide text-zinc-300 text-[5vh]">(Item)</span>
        </h2>
        <p className="text-lg text-gray-500 mb-6">{description || 'No description available.'}</p>

        {/* Item Info */}
        <h3 className="text-[4vh] font-semibold text-[#124468] mb-4">Item Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4 text-[2.7vh] ">
          <p className="text-gray-700"><strong>Quantity:</strong> {quantity}</p>
          <p className="text-gray-700"><strong>Price:</strong> {currencySymbol}{price.toFixed(2)}</p>
          <p className="text-gray-700"><strong>Inventory:</strong> {inventory ? inventory.name || 'Unknown Inventory' : 'Unknown Inventory'}</p>
          <p className="text-gray-700"><strong>Total Cost:</strong> {currencySymbol}{(price * quantity).toFixed(2)}</p>
        </div>
      </div>

      {/* Summary Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
        <h4 className="text-[3.5vh] font-semibold text-[#124468] mb-3">Summary</h4>
        <p className="text-[3vh] text-gray-600">Total Quantity: {quantity}</p>
        <p className="text-[3vh] text-gray-600">Total Cost: {currencySymbol}{(price * quantity).toFixed(2)}</p>
      </div>
    </div>
  );
};

export default ItemDetails;
