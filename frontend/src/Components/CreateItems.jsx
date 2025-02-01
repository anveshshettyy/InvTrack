import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BadgeCheck } from 'lucide-react';
import { axiosInstance } from '../axios';

const CreateItems = ({ inventoryId }) => {
    const categories = [
        'Electronics', 'Furniture', 'Clothing', 'Food & Beverage',
        'Office Supplies', 'Tools', 'Automotive', 'Pharmaceuticals',
        'Household Goods', 'Sporting Goods', 'Toys', 'Books', 'Raw Materials',
        'Cosmetics', 'Medical Supplies', 'Pet Supplies', 'Accessories', 'Others'
    ];

    const [inventories, setInventories] = useState([]);
    const [itemData, setItemData] = useState({
        itemName: '',
        quantity: '',
        price: '',
        description: '',
        category: '',
        inventory: inventoryId || '',
    });
    const [filteredCategories, setFilteredCategories] = useState(categories);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    useEffect(() => {
        const fetchInventories = async () => {
            try {
                const response = await axiosInstance.get('/inventories', { withCredentials: true });
                setInventories(response.data);
            } catch (error) {
                console.error("Error fetching inventories:", error);
            }
        };
        fetchInventories();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setItemData({ ...itemData, [name]: value });

        if (name === 'category') {
            setShowCategoryDropdown(true);
            setFilteredCategories(
                categories.filter(category =>
                    category.toLowerCase().includes(value.toLowerCase())
                )
            );
        }
    };

    const handleCategorySelect = (category) => {
        setItemData({ ...itemData, category });
        setShowCategoryDropdown(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post(`/inventory/${itemData.inventory}/items/create`, {
                items: [itemData]
            }, { withCredentials: true });
            setAlertMessage("Item added successfully!");
            setItemData({
                itemName: '',
                quantity: '',
                price: '',
                description: '',
                category: '',
                inventory: inventoryId || ''
            });
            setTimeout(() => setAlertMessage(''), 3000);
        } catch (error) {
            console.error("Error creating item:", error);
        }
    };  

    return (
        <div className="w-full h-full p-10 rounded-sm  shadow-sm bg-gray-50 ">
            <h2 className="text-[6vh] font-founders-grotesk text-[#124468] mb-6">Add New Item</h2>
            
            {alertMessage && (
                <div className="flex items-center mb-4 p-3 text-green-700 bg-green-100 rounded-sm  shadow-sm">
                    <span className="material-icons-outlined text-green-500 mr-2"><BadgeCheck size={28} color="#46d876" /></span>
                    {alertMessage}
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                
                {/* Left column */}
                <div>
                    <label className="block text-sm font-medium text-gray-600 font-regular">Item Name</label>
                    <input
                        type="text"
                        name="itemName"
                        value={itemData.itemName}
                        onChange={handleChange}
                        required
                        className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-sm  shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-600 font-regular">Quantity</label>
                    <input
                        type="number"
                        name="quantity"
                        value={itemData.quantity}
                        onChange={handleChange}
                        required
                        className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-sm  shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-600 font-regular">Price</label>
                    <input
                        type="number"
                        name="price"
                        value={itemData.price}
                        onChange={handleChange}
                        required
                        className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-sm  shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
                    />
                </div>

                {/* Right column */}
                <div className="col-span-1 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-600 font-regular">Description</label>
                    <textarea
                        name="description"
                        value={itemData.description}
                        onChange={handleChange}
                        className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-sm  shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
                        rows="3"
                    />
                </div>

                <div className="relative col-span-1 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-600 font-regular">Category</label>
                    <input
                        type="text"
                        name="category"
                        value={itemData.category}
                        onChange={handleChange}
                        required
                        placeholder="Type to search or select category"
                        className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-sm  shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
                        onFocus={() => setShowCategoryDropdown(true)}
                    />
                    {showCategoryDropdown && filteredCategories.length > 0 && (
                        <div
                            className="absolute z-10 bg-white border border-gray-300 rounded-sm  mt-1 masmh-40 w-full overflow-y-auto shadow-lg"
                            onMouseDown={(e) => e.preventDefault()} // prevent blur when clicking on dropdown
                        >
                            {filteredCategories.map((category, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleCategorySelect(category)}
                                    className="px-4 py-2 hover:bg-blue-500 hover:text-white cursor-pointer"
                                >
                                    {category}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="col-span-1 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-600 font-regular">Select Inventory</label>
                    <select
                        name="inventory"
                        value={itemData.inventory}
                        onChange={handleChange}
                        required
                        className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-sm  shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
                    >
                        <option value="">Select Inventory</option>
                        {inventories.map((inventory) => (
                            <option key={inventory._id} value={inventory._id}>
                                {inventory.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Submit button */}
                <div className="col-span-2 mt-6">
                    <button
                        type="submit"
                        className="w-full py-3 text-white font-semibold rounded-sm  shadow-sm bg-[#124462] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-black font-regular"
                    >
                        Add Item
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateItems;
