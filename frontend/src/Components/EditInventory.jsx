import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit  } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { axiosInstance } from '../axios';

const EditInventory = () => {
  const [inventories, setInventories] = useState([]);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(null); // Track which inventory is being edited
  const [updatedName, setUpdatedName] = useState('');

  // Fetch inventories from backend on component mount
  useEffect(() => {
    axiosInstance.get('/inventories', { withCredentials: true })
      .then(response => {
        if (Array.isArray(response.data)) {
          setInventories(response.data);
        } else {
          console.error('Unexpected response format:', response.data);
          setError('Failed to load inventories.');
        }
      })
      .catch(error => {
        console.error('Error fetching inventories:', error);
        setError('An error occurred while fetching inventories.');
      });
  }, []);

  // Delete inventory function
  const handleDelete = (inventoryId) => {
    axios.delete(`/inventories/${inventoryId}`)
      .then(() => {
        // Remove the deleted inventory from the list
        setInventories(prevInventories => prevInventories.filter(inventory => inventory._id !== inventoryId));
      })
      .catch(error => {
        console.error('Error deleting inventory:', error);
        setError('An error occurred while deleting the inventory.');
      });
  };

  // Rename inventory function
  const handleRename = (inventoryId) => {
    axios.put(`/inventories/${inventoryId}`, { name: updatedName })
      .then(response => {
        // Update the inventory in the state
        setInventories(prevInventories => 
          prevInventories.map(inventory =>
            inventory._id === inventoryId ? { ...inventory, name: updatedName } : inventory
          )
        );
        setEditMode(null); // Exit edit mode
        setUpdatedName(''); // Clear input
      })
      .catch(error => {
        console.error('Error renaming inventory:', error);
        setError('An error occurred while renaming the inventory.');
      });
  };

  return (
    <div className="p-4 font-regular tracking-wide ">
      <h2 className="text-[6vh] font-founders-grotesk tracking-normal text-[#124462]">Edit Inventory</h2>
      {error && <p className="text-red-500">{error}</p>}
      <div className="space-y-4">
        {inventories.length > 0 ? inventories.map((inventory) => (
          <div key={inventory._id} className="flex justify-between items-center p-4 border border-gray-300 rounded-lg">
            <div className="flex-grow">
              {editMode === inventory._id ? (
                <>
                  <input 
                    type="text" 
                    value={updatedName} 
                    onChange={(e) => setUpdatedName(e.target.value)} 
                    className="border border-gray-400 rounded px-2 py-1" 
                    placeholder="New Inventory Name" 
                    required
                  />
                  <button 
                    onClick={() => handleRename(inventory._id)}
                    className="bg-transparent border border-zinc-600  text-black px-4 py-1 rounded-sm hover:bg-zinc-300 ml-2"
                  >
                    Save
                  </button>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-semibold">{inventory.name}</h3>
                  <p className="text-gray-700">{inventory.description}</p>
                </>
              )}
            </div>
            <div className="flex space-x-2">
              {editMode === inventory._id ? null : (
                <button 
                  onClick={() => {
                    setEditMode(inventory._id);
                    setUpdatedName(inventory.name); // Set current name for editing
                  }}
                  className=" bg-transparent border border-zinc-800  text-black px-4 py-2 rounded-lg hover:bg-zinc-300 flex items-center justify-center gap-1 "
                >
                  <FaEdit />
                  Rename
                </button>
              )}
              <button 
                onClick={() => handleDelete(inventory._id)}
                className="bg-transparent border border-zinc-800  text-black px-4 py-2 rounded-lg hover:bg-zinc-300 flex items-center justify-center gap-1 "
              >
                <MdDelete />
                Delete
              </button>
            </div>
          </div>
        )) : (
          <p className="text-gray-500 ">No inventories available.</p>
        )}
      </div>
    </div>
  );
};

export default EditInventory;
