import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserRecords from '../Components/UserRecords';
import InventoryRecords from '../Components/InventoryRecords';
import ItemRecords from '../Components/ItemRecords';
import axios from 'axios';
import { axiosInstance } from '../axios';

const AdminPage = () => {
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const response = await axiosInstance.get('http://localhost:3000/check-admin', { withCredentials: true });
                setIsAdmin(response.data.isAdmin);
            } catch (error) {
                console.error('Admin check failed:', error);
                navigate('/adminLogin'); // Redirect to Admin Login if not authenticated
            } finally {
                setLoading(false);
            }
        };

        checkAdmin();
    }, [navigate]);

    if (loading) {
        return <div>Loading...</div>; // Optionally show a loading state
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4 p-10 ">Admin Dashboard</h1>
            <UserRecords />
            <InventoryRecords />
            <ItemRecords />
        </div>
    );
};

export default AdminPage;
