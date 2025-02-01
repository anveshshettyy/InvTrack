import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { axiosInstance } from '../axios';

const InventoryRecords = () => {
    const [inventories, setInventories] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editFormData, setEditFormData] = useState({ name: '', description: '' });

    useEffect(() => {
        const fetchInventories = async () => {
            try {
                const response = await axiosInstance.get('/admin/inventories', { withCredentials: true });
                setInventories(response.data);
            } catch (error) {
                console.error('Error fetching inventories:', error);
            }
        };
        fetchInventories();
    }, []);

    const handleEditClick = (inventory) => {
        setEditingId(inventory._id);
        setEditFormData({
            name: inventory.name || '',
            description: inventory.description || '',
        });
    };

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSaveClick = async (inventoryId) => {
        try {
            const response = await axios.put(`/admin/inventories/${inventoryId}`, editFormData, { withCredentials: true });
            setInventories((prevInventories) =>
                prevInventories.map((inv) => (inv._id === inventoryId ? response.data : inv))
            );
            setEditingId(null);
        } catch (error) {
            console.error('Error updating inventory:', error);
        }
    };

    const deleteInventory = async (inventoryId) => {
        try {
            await axios.delete(`/admin/inventories/${inventoryId}`, { withCredentials: true });
            setInventories(inventories.filter(inv => inv._id !== inventoryId));
        } catch (error) {
            console.error('Error deleting inventory:', error);
        }
    };

    return (
        <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Inventory Records</h2>
            <table className="min-w-full bg-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-800 text-white">
                    <tr>
                        <th className="py-3 px-5 text-left">Name</th>
                        <th className="py-3 px-5 text-left">Description</th>
                        <th className="py-3 px-5 text-left">Created At</th>
                        <th className="py-3 px-5 text-left">Total Value</th>
                        <th className="py-3 px-5 text-left">Total Quantity</th>
                        <th className="py-3 px-5 text-left">Total Items</th>
                        <th className="py-3 px-5 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {inventories.map(inv => (
                        <tr key={inv._id} className="hover:bg-gray-300">
                            <td className="py-3 px-5">
                                {editingId === inv._id ? (
                                    <input
                                        type="text"
                                        name="name"
                                        value={editFormData.name}
                                        onChange={handleEditFormChange}
                                        className="border p-1 rounded w-full"
                                    />
                                ) : (
                                    inv.name
                                )}
                            </td>
                            <td className="py-3 px-5">
                                {editingId === inv._id ? (
                                    <input
                                        type="text"
                                        name="description"
                                        value={editFormData.description}
                                        onChange={handleEditFormChange}
                                        className="border p-1 rounded w-full"
                                    />
                                ) : (
                                    inv.description || 'N/A'
                                )}
                            </td>
                            <td className="py-3 px-5">
                                {new Date(inv.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-5">${inv.totalInventoryValue.toFixed(2)}</td>
                            <td className="py-3 px-5">{inv.totalInventoryQuantity}</td>
                            <td className="py-3 px-5">{inv.totalInventoryItems}</td>
                            <td className="py-3 px-5 flex space-x-2">
                                {editingId === inv._id ? (
                                    <>
                                        <button
                                            onClick={() => handleSaveClick(inv._id)}
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
                                            onClick={() => handleEditClick(inv)}
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deleteInventory(inv._id)}
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

export default InventoryRecords;
