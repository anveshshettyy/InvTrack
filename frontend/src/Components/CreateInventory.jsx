import React, { useState } from 'react';
import axios from 'axios';

const CreateInventory = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isCreated, setIsCreated] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const inventoryData = {
      name,
      description,
      items: [],
    };

    try {
      const response = await axios.post("http://localhost:3000/create/inventory", inventoryData, { withCredentials: true });
      console.log('Inventory created:', response.data);
      setName('');
      setDescription('');
      setIsCreated(true);
      setTimeout(() => setIsCreated(false), 3000); // Hide message after 3 seconds
    } catch (error) {
      console.error('Error creating inventory:', error);
    }
  };

  return (
    <div className="flex h-[90vh] justify-center items-center bg-zinc-100 p-4  ">
      <div className="w-full md:w-3/4 lg:w-2/3 xl:w-1/2 p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-[5vh] font-founders-grotesk text-[#124468] text-center mb-6">Create New Inventory</h2>
        
        {isCreated && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded text-center mb-6">
            Inventory created successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Inventory Name */}
          <div>
            <label className="block text-[2.5vh] font-founders-grotesk tracking-normal text-[#124468]" htmlFor="name">
              Inventory Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#124468]"
              placeholder="Enter inventory name"
              required
            />
          </div>

          {/* Inventory Description */}
          <div>
            <label className="block text-[2.5vh] font-founders-grotesk tracking-normal text-[#124468]" htmlFor="description">
              Inventory Description (Optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#124468]"
              rows="4"
              placeholder="Enter a brief description of the inventory"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full py-3 text-white font-bold bg-[#124468] rounded hover:bg-[#050e14] focus:outline-none focus:ring-2 focus:ring-[#124468]"
            >
              Create Inventory
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInventory;
