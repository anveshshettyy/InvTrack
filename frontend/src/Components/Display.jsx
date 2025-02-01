import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../axios';

const Display = () => {
  const [companyName, setCompanyName] = useState(null);
  const [totalInventoryValue, setTotalInventoryValue] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [inventories, setInventories] = useState([]);
  const [currencySymbol, setCurrencySymbol] = useState('$');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/inventory", { withCredentials: true });
        
        const { companyName, country, inventories } = response.data;

        setCompanyName(companyName);
        setInventories(inventories);

        // Initialize totals
        let totalValue = 0;
        let totalQty = 0;
        let totalItemsCount = 0;

        // Calculate totals from inventories
        inventories.forEach(inventory => {
          inventory.items.forEach(item => {
            totalQty += item.quantity;
            totalValue += item.quantity * item.price;
            totalItemsCount += 1;
          });
        });

        setTotalInventoryValue(totalValue);
        setTotalQuantity(totalQty);
        setTotalItems(totalItemsCount);

        setCurrencySymbol(country === 'India' ? '₹' : '$');
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className='h-screen w-full bg-gray-100 p-10 font-regular leading-10 tracking-wider overflow-scroll '>
      <div className='flex justify-between items-center'>
        <h1 className='text-[6vh] font-founders-grotesk tracking-normal text-[#124462] '>Inventory Dashboard</h1>
        <h2 className='text-[5vh] font-founders-grotesk tracking-normal text-[#124462] '>{companyName}</h2>
      </div>

      <div className='mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
        <div className='bg-white shadow-md rounded-lg p-6'>
          <h3 className='text-2xl font-semibold text-gray-700'>Total Inventory Value</h3>
          <p className='text-2xl font-bold text-blue-500 mt-2'>
            {currencySymbol}{totalInventoryValue.toLocaleString()}
          </p>
        </div>
        <div className='bg-white shadow-md rounded-lg p-6'>
          <h3 className='text-2xl font-semibold text-gray-700'>Total Quantity</h3>
          <p className='text-2xl font-bold text-green-500 mt-2'>{totalQuantity.toLocaleString()}</p>
        </div>
        <div className='bg-white shadow-md rounded-lg p-6'>
          <h3 className='text-2xl font-semibold text-gray-700'>Total Items</h3>
          <p className='text-2xl font-bold text-orange-500 mt-2'>{totalItems.toLocaleString()}</p>
        </div>
      </div>

      <div className='mt-10 bg-white shadow-md rounded-lg p-6'>
        <h3 className='text-2xl font-bold text-gray-700'>Inventory Overview</h3>
        <div className='h-[1px] mt-2 w-full bg-black'></div>
        <div className='mt-6'>
          {inventories.map((inventory, index) => (
            <div key={index} className='mb-8'>
              <h4 className='text-xl font-bold'>{inventory.name}</h4>
              <p className='text-gray-600 mb-4'>{inventory.description}</p>
              <table className='min-w-full table-auto border border-zinc-600'>
                <thead>
                  <tr className='text-left bg-gray-200 '>
                    <th className='px-4 py-2'>Item Name</th>
                    <th className='px-4 py-2'>Quantity</th>
                    <th className='px-4 py-2'>Price</th>
                    <th className='px-4 py-2'>Category</th>
                    <th className='px-4 py-2'>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.items.map((item, idx) => (
                    <tr key={idx} className='border-t'>
                      <td className='px-4 py-2'>{item.itemName}</td>
                      <td className='px-4 py-2'>{item.quantity}</td>
                      <td className='px-4 py-2'>{currencySymbol}{item.price}</td>
                      <td className='px-4 py-2'>{item.category}</td>
                      <td className='px-4 py-2'>
                        {currencySymbol}{(item.quantity * item.price).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className='h-[1px] w-full bg-zinc-500'></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Display;
