import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [items, setItems] = useState([]);
    const [error, setError] = useState(null);
    const [currencySymbol, setCurrencySymbol] = useState('$'); // Default currency symbol

    // Fetch all categories created by the user
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:3000/categories', { withCredentials: true });
                setCategories(response.data.categories); // Access the 'categories' array from the response
            } catch (error) {
                console.error('Error fetching categories:', error);
                setError('An error occurred while fetching categories.');
            }
        };
        fetchCategories();
    }, []);

    // Fetch country name and set currency symbol
    useEffect(() => {
        const fetchCountryName = async () => {
            try {
                const response = await axios.get('http://localhost:3000/country', { withCredentials: true });
                console.log('Fetched country data:', response.data);

                // Set the currency symbol based on the country name
                if (response.data) {
                    const countryName = response.data;
                    setCurrencySymbol(countryName === 'India' ? '₹' : '$'); // Adjust as necessary for more countries
                }
            } catch (error) {
                console.error('Error fetching country name:', error);
            }
        };
        fetchCountryName();
    }, []);

    // Fetch items when a category is selected
    const handleCategorySelect = async (categoryId) => {
        setSelectedCategory(categoryId);
        try {
            const response = await axios.get(`http://localhost:3000/categories/${categoryId}/items`, { withCredentials: true });
            console.log(response.data);
            setItems(response.data);
        } catch (error) {
            console.error('Error fetching items for the selected category:', error);
            setError('An error occurred while fetching items.');
        }
    };

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    return (
        <div className="p-6 text-black">
            <h2 className="text-2xl font-bold mb-4">Select Category to View Items</h2>

            {/* Category Selection */}
            <div className="mb-6">
                <select
                    value={selectedCategory || ''}
                    onChange={(e) => handleCategorySelect(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                >
                    <option value="" disabled>Select a Category</option>
                    {categories.map((category) => (
                        <option key={category} value={category}> {/* Use category name as key */}
                            {category}
                        </option>
                    ))}
                </select>
            </div>

            {/* Items Table */}
            {items.length > 0 && (
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2">Item Name</th>
                            <th className="border border-gray-300 px-4 py-2">Quantity</th>
                            <th className="border border-gray-300 px-4 py-2">Price</th>
                            <th className="border border-gray-300 px-4 py-2">Total Cost</th>
                            <th className="border border-gray-300 px-4 py-2">Inventory Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => (
                            <tr key={item._id} className="hover:bg-gray-100">
                                <td className="border border-gray-300 px-4 py-2">{item.itemName}</td>
                                <td className="border border-gray-300 px-4 py-2">{item.quantity}</td>
                                <td className="border border-gray-300 px-4 py-2">{currencySymbol}{item.price.toFixed(2)}</td>
                                <td className="border border-gray-300 px-4 py-2">{currencySymbol}{(item.price * item.quantity).toFixed(2)}</td>
                                <td className="border border-gray-300 px-4 py-2">{item.inventoryName}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* No items message */}
            {selectedCategory && items.length === 0 && (
                <p className="text-gray-500">No items found in this category.</p>
            )}
        </div>
    );
};

export default Categories;
