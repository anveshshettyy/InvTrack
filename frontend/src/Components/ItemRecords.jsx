import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { axiosInstance } from '../axios';

const ItemRecords = () => {
    const [items, setItems] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editFormData, setEditFormData] = useState({});

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axiosInstance.get('/admin/items');
                console.log(response.data);
                setItems(response.data);
            } catch (error) {
                console.error('Error fetching items:', error);
            }
        };
        fetchItems();
    }, []);

    const handleEditClick = (item) => {
        setEditingId(item._id);
        setEditFormData({
            itemName: item.itemName,
            quantity: item.quantity,
            price: item.price,
            description: item.description,
            category: item.category,
            totalValue: item.quantity * item.price,
            name: item.inventory?.name || 'N/A', // Display inventory name or 'N/A'
        });
    };

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditFormData((prevData) => {
            const updatedData = { ...prevData, [name]: value };
            if (name === 'quantity' || name === 'price') {
                updatedData.totalValue = updatedData.quantity * updatedData.price;
            }
            return updatedData;
        });
    };

    const handleSaveClick = async (itemId) => {
        try {
            const response = await axiosInstance.put(
                `/items/${itemId}`, // Updated endpoint
                {
                    name: editFormData.itemName,
                    price: parseInt(editFormData.price), // Ensure correct type
                    quantity: parseInt(editFormData.quantity), // Ensure correct type
                    category: editFormData.category
                },
                { withCredentials: true }
            );
            // Update the state with the updated item
            setItems(items.map(item => item._id === itemId ? response.data.updatedItem : item));
            setEditingId(null);
        } catch (error) {
            console.error('Error updating item:', error);
        }
    };

    const deleteItem = async (itemId) => {
        try {
            const response = await axiosInstance.delete(`/items/${itemId}`, { withCredentials: true });
            // Update the state after deletion
            setItems(items.filter(item => item._id !== itemId));
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    return (
        <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Item Records</h2>
            <table className="min-w-full bg-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-800 text-white">
                    <tr>
                        <th className="py-3 px-5 text-left">Item Name</th>
                        <th className="py-3 px-5 text-left">Quantity</th>
                        <th className="py-3 px-5 text-left">Price</th>
                        <th className="py-3 px-5 text-left">Description</th>
                        <th className="py-3 px-5 text-left">Category</th>
                        <th className="py-3 px-5 text-left">Inventory Name</th>
                        <th className="py-3 px-5 text-left">Total Value</th>
                        <th className="py-3 px-5 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map(item => (
                        <tr key={item._id} className="hover:bg-gray-300">
                            <td className="py-3 px-5">
                                {editingId === item._id ? (
                                    <input
                                        type="text"
                                        name="itemName"
                                        value={editFormData.itemName}
                                        onChange={handleEditFormChange}
                                        className="border p-1 rounded w-full"
                                    />
                                ) : (
                                    item.itemName
                                )}
                            </td>
                            <td className="py-3 px-5">
                                {editingId === item._id ? (
                                    <input
                                        type="number"
                                        name="quantity"
                                        value={editFormData.quantity}
                                        onChange={handleEditFormChange}
                                        className="border p-1 rounded w-full"
                                    />
                                ) : (
                                    item.quantity
                                )}
                            </td>
                            <td className="py-3 px-5">
                                {editingId === item._id ? (
                                    <input
                                        type="number"
                                        name="price"
                                        value={editFormData.price}
                                        onChange={handleEditFormChange}
                                        className="border p-1 rounded w-full"
                                    />
                                ) : (
                                    `$${item.price}`
                                )}
                            </td>
                            <td className="py-3 px-5">
                                {editingId === item._id ? (
                                    <input
                                        type="text"
                                        name="description"
                                        value={editFormData.description}
                                        onChange={handleEditFormChange}
                                        className="border p-1 rounded w-full"
                                    />
                                ) : (
                                    item.description || 'N/A'
                                )}
                            </td>
                            <td className="py-3 px-5">
                                {editingId === item._id ? (
                                    <input
                                        type="text"
                                        name="category"
                                        value={editFormData.category}
                                        onChange={handleEditFormChange}
                                        className="border p-1 rounded w-full"
                                    />
                                ) : (
                                    item.category || 'N/A'
                                )}
                            </td>
                            <td className="py-3 px-5">
                                {item.inventory?.name || 'N/A'}
                            </td>
                            <td className="py-3 px-5">
                                {editingId === item._id ? (
                                    <input
                                        type="text"
                                        name="totalValue"
                                        value={`$${editFormData.totalValue.toFixed(2)}`}
                                        readOnly
                                        className="border p-1 rounded w-full bg-gray-200"
                                    />
                                ) : (
                                    `$${(item.quantity * item.price).toFixed(2)}`
                                )}
                            </td>
                            <td className="py-3 px-5 flex space-x-2">
                                {editingId === item._id ? (
                                    <>
                                        <button
                                            onClick={() => handleSaveClick(item._id)}
                                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => setEditingId(null)}
                                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                                        >
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => handleEditClick(item)}
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deleteItem(item._id)}
                                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                        >
                                            Delete
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ItemRecords;
