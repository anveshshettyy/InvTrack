import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { axiosInstance } from '../axios';

const UserRecords = () => {
    const [users, setUsers] = useState([]);
    const [editingUserId, setEditingUserId] = useState(null);
    const [formData, setFormData] = useState({
        companyName: '',
        email: '',
        country: '',
        phone: ''
    });

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axiosInstance.get('/admin/users', { withCredentials: true });
                if (Array.isArray(response.data)) {
                    setUsers(response.data);
                } else {
                    console.error('Unexpected data format:', response.data);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

    const deleteUser = async (userId) => {
        try {
            await axiosInstance.delete(`/admin/users/${userId}`, { withCredentials: true });
            setUsers(users.filter(user => user._id !== userId));
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };
    

    const editUser = (user) => {
        setEditingUserId(user._id);
        setFormData({
            companyName: user.companyName || '',
            email: user.email || '',
            country: user.country || '',
            phone: user.phone || ''
        });
    };

    const saveUser = async () => {
        try {
            const response = await axiosInstance.put(`/admin/users/${editingUserId}`, formData, { withCredentials: true });
            const updatedUser = response.data;
            setUsers(users.map(user => (user._id === updatedUser._id ? updatedUser : user)));
            setEditingUserId(null);
            setFormData({ companyName: '', email: '', country: '', phone: '' });
        } catch (error) {
            console.error('Error saving user data:', error);
        }
    };

    return (
        <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">User Records</h2>
            <table className="min-w-full bg-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-800 text-white">
                    <tr>
                        <th className="py-3 px-5 text-left">Name</th>
                        <th className="py-3 px-5 text-left">Email</th>
                        <th className="py-3 px-5 text-left">Country</th>
                        <th className="py-3 px-5 text-left">Phone Number</th>
                        <th className="py-3 px-5 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user._id} className="hover:bg-gray-300">
                            {editingUserId === user._id ? (
                                <>
                                    <td className="py-3 px-5">
                                        <input
                                            type="text"
                                            value={formData.companyName}
                                            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                            className="border border-gray-400 p-2 rounded"
                                        />
                                    </td>
                                    <td className="py-3 px-5">
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="border border-gray-400 p-2 rounded"
                                        />
                                    </td>
                                    <td className="py-3 px-5">
                                        <input
                                            type="text"
                                            value={formData.country}
                                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                            className="border border-gray-400 p-2 rounded"
                                        />
                                    </td>
                                    <td className="py-3 px-5">
                                        <input
                                            type="text"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="border border-gray-400 p-2 rounded"
                                        />
                                    </td>
                                    <td className="py-3 px-5">
                                        <button
                                            onClick={saveUser}
                                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                        >
                                            Save
                                        </button>
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td className="py-3 px-5">{user.companyName}</td>
                                    <td className="py-3 px-5">{user.email}</td>
                                    <td className="py-3 px-5">{user.country}</td>
                                    <td className="py-3 px-5">{user.phone}</td>
                                    <td className="py-3 px-5">
                                        <button
                                            onClick={() => editUser(user)}
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deleteUser(user._id)}
                                            className="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserRecords;
