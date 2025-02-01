import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit  } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { axiosInstance } from '../axios';

const UpdateInventory = () => {
    const [inventories, setInventories] = useState([]);
    const [selectedInventory, setSelectedInventory] = useState('');
    const [items, setItems] = useState([]);
    const [editItemId, setEditItemId] = useState(null);
    const [updatedItemName, setUpdatedItemName] = useState('');
    const [updatedItemPrice, setUpdatedItemPrice] = useState(0);
    const [updatedItemQuantity, setUpdatedItemQuantity] = useState(0);
    const [updatedItemCategory, setUpdatedItemCategory] = useState('');
    const [userCountry, setUserCountry] = useState(''); // State for user country
    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        const fetchUserCountry = async () => {
            try {
                const response = await axiosInstance.get('http://localhost:3000/country', { withCredentials: true });
                setUserCountry(response.data);
            } catch (error) {
                console.error('Error fetching user country:', error);
                setUserCountry(''); // Handle error accordingly
            }
        };
        fetchUserCountry();
    }, []);

    useEffect(() => {
        const fetchInventories = async () => {
            try {
                const response = await axiosInstance.get('http://localhost:3000/inventories', { withCredentials: true });
                setInventories(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching inventories:', error);
                setLoading(false);
            }
        };
        fetchInventories();
    }, []);

    const fetchItems = async () => {
        if (selectedInventory) {
            try {
                const response = await axiosInstance.get(`http://localhost:3000/inventories/${selectedInventory}/items`);
                setItems(response.data);
            } catch (error) {
                console.error('Error fetching items:', error);
            }
        } else {
            setItems([]);
        }
    };

    useEffect(() => {
        fetchItems();
    }, [selectedInventory]);

    const handleEditClick = (item) => {
        setEditItemId(item._id);
        setUpdatedItemName(item.itemName);
        setUpdatedItemPrice(item.price);
        setUpdatedItemQuantity(item.quantity);
        setUpdatedItemCategory(item.category);
    };

    const handleSaveItem = async (itemId) => {
        try {
            await axios.put(`http://localhost:3000/items/${itemId}`, {
                name: updatedItemName,
                price: updatedItemPrice,
                quantity: updatedItemQuantity,
                category: updatedItemCategory,
            });
            resetEditState();
            await fetchItems(); // Refresh the items list
        } catch (error) {
            console.error('Error saving item:', error);
        }
    };

    const handleDeleteItem = async (itemId) => {
        try {
            await axios.delete(`http://localhost:3000/items/${itemId}`);
            setItems((prevItems) => prevItems.filter(item => item._id !== itemId));
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    const resetEditState = () => {
        setEditItemId(null);
        setUpdatedItemName('');
        setUpdatedItemPrice(0);
        setUpdatedItemQuantity(0);
        setUpdatedItemCategory('');
    };

    const formatPrice = (price) => {
        return userCountry === 'India' ? `₹${price}` : `$${price}`;
    };

    return (
        <div className="update-inventory-container p-4 font-regular ">
            <h2 className="text-[6vh] font-founders-grotesk tracking-normal text-[#124462] mb-6">Update Items</h2>

            {loading ? ( 
                <p>Loading...</p>
            ) : (
                <>
                    <select onChange={(e) => setSelectedInventory(e.target.value)} value={selectedInventory} className="mb-4 p-2 border">
                        <option value="">Select Inventory</option>
                        {inventories.map((inventory) => (
                            <option key={inventory._id} value={inventory._id}>
                                {inventory.name}
                            </option>
                        ))}
                    </select>

                    {items.length > 0 ? (
                        <div>
                            <h3 className="text-xl font-semibold mb-2">Items in Selected Inventory</h3>
                            <table className="min-w-full border-collapse border border-gray-200">
                                <thead>
                                    <tr>
                                        <th className="border border-gray-300 px-4 py-2">Item Name</th>
                                        <th className="border border-gray-300 px-4 py-2">Quantity</th>
                                        <th className="border border-gray-300 px-4 py-2">Price</th>
                                        <th className="border border-gray-300 px-4 py-2">Category</th>
                                        <th className="border border-gray-300 px-4 py-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item) => (
                                        <tr key={item._id} className="border border-gray-300">
                                            {editItemId === item._id ? (
                                                <>
                                                    <td className="border border-gray-300 px-4 py-2">
                                                        <input
                                                            type="text"
                                                            value={updatedItemName}
                                                            onChange={(e) => setUpdatedItemName(e.target.value)}
                                                            className="border p-1"
                                                        />
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-2">
                                                        <input
                                                            type="number"
                                                            value={updatedItemQuantity}
                                                            onChange={(e) => setUpdatedItemQuantity(Number(e.target.value))}
                                                            className="border p-1"
                                                        />
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-2">
                                                        <input
                                                            type="number"
                                                            value={updatedItemPrice}
                                                            onChange={(e) => setUpdatedItemPrice(Number(e.target.value))}
                                                            className="border p-1"
                                                        />
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-2">
                                                        <input
                                                            type="text"
                                                            value={updatedItemCategory}
                                                            onChange={(e) => setUpdatedItemCategory(e.target.value)}
                                                            className="border p-1"
                                                        />
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-2">
                                                        <button
                                                            onClick={() => handleSaveItem(item._id)}
                                                            className="bg-transparent text-black border border-zinc-600 hover:bg-zinc-300 px-5 py-1 rounded-sm mr-2 w-full "
                                                        >
                                                            Save
                                                        </button>
                                                    </td>
                                                </>
                                            ) : (
                                                <>
                                                    <td className="border border-gray-300 px-4 py-2">{item.itemName}</td>
                                                    <td className="border border-gray-300 px-4 py-2">{item.quantity}</td>
                                                    <td className="border border-gray-300 px-4 py-2">{formatPrice(item.price)}</td>
                                                    <td className="border border-gray-300 px-4 py-2">{item.category}</td>
                                                    <td className="border border-gray-300 px-4 py-2">
                                                        <div className='flex w-full justify-center'>
                                                        <button
                                                            onClick={() => handleEditClick(item)}
                                                            className="bg-transparent flex  items-center justify-center text-black border border-zinc-600 hover:bg-zinc-300 px-5 w-[45%] py-1 rounded-sm mr-2"
                                                        >
                                                            <FaEdit />
                                                            Update
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteItem(item._id)}
                                                            className="bg-transparent flex items-center justify-center text-black border border-zinc-600 hover:bg-zinc-300 w-[45%] px-5 py-1 rounded-sm mr-2"
                                                        >
                                                            <MdDelete />
                                                            Delete
                                                        </button>
                                                        </div>
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className='ml-[10px]'>No items found.</p>
                    )}
                </>
            )}
        </div>
    );
};

export default UpdateInventory;
