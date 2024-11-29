import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import InventoryNav from '../Components/InventoryNav';
import Display from '../Components/Display';
import CreateInventoryForm from '../Components/CreateInventory';
import CreateItems from '../Components/CreateItems';
import UpdateInventory from '../Components/UpdateInventory';
import EditInventory from '../Components/EditInventory';
import Categories from '../Components/Categories';
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

const Inventory = () => {
    const { companyName } = useParams(); // Get companyName from URL params
    const [isInventoryOpen, setIsInventoryOpen] = useState(false);
    const [isItemsOpen, setIsItemsOpen] = useState(false);
    const [activeComponent, setActiveComponent] = useState('display');
    const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

    const toggleInventoryDropdown = () => {
        setIsInventoryOpen(!isInventoryOpen);
    };

    const toggleItemsDropdown = () => {
        setIsItemsOpen(!isItemsOpen);
    };

    const toggleCategoriesDropdown = () => {
        setIsCategoriesOpen(!isCategoriesOpen);
    };

    const handleNavigation = (component) => {
        setActiveComponent(component);
    };

    return (
        <div className="min-h-screen w-full bg-gray-100">
            <InventoryNav />
            <div className="flex">
                {/* Sidebar */}
                <div className="min-h-screen w-[30vh] bg-slate-700 text-white shadow-lg">
                    <div className="flex flex-col py-5 px-3 space-y-4">
                        {/* Dashboard Link */}
                        <Link 
                            to={`/profile/${companyName}/dashboard`} // Navigate with companyName
                            className={`text-lg py-2 px-4 rounded transition border-b ${
                                activeComponent === 'display' ? 'bg-gray-600' : 'hover:bg-slate-600'
                            }`}
                            onClick={() => handleNavigation('display')} 
                        >
                            Dashboard
                        </Link>

                        {/* Create Inventory Dropdown */}
                        <div>
                            <button
                                className={`text-lg w-full text-left border-b py-2 flex px-4 justify-between items-center rounded transition ${
                                    activeComponent === 'createInventory' || activeComponent === 'editInventory' ? 'bg-gray-600' : 'hover:bg-slate-600'
                                }`}
                                onClick={toggleInventoryDropdown}
                            >
                                Create Inventory
                                {isInventoryOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
                            </button>

                            {isInventoryOpen && (
                                <div className="pl-6 mt-2 space-y-2">
                                    <Link 
                                        to={`/profile/${companyName}/create-inventory`} 
                                        className={`text-md block py-2 px-4 rounded transition border-b ${
                                            activeComponent === 'createInventory' ? 'bg-gray-600' : 'hover:bg-slate-600'
                                        }`}
                                        onClick={() => handleNavigation('createInventory')}
                                    >
                                        Create Inventory
                                    </Link>
                        
                                    <Link 
                                        to={`/profile/${companyName}/edit-inventory`} 
                                        className={`text-md block py-2 px-4 rounded transition border-b ${
                                            activeComponent === 'editInventory' ? 'bg-gray-600' : 'hover:bg-slate-600'
                                        }`}
                                        onClick={() => handleNavigation('editInventory')}
                                    >
                                        Edit Inventory
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Create Items Dropdown */}
                        <div>
                            <button
                                className={`text-lg w-full text-left border-b py-2 flex px-4 justify-between items-center rounded transition ${
                                    activeComponent === 'createItems' || activeComponent === 'updateItems' ? 'bg-gray-600' : 'hover:bg-slate-600'
                                }`}
                                onClick={toggleItemsDropdown}
                            >
                                Create Items
                                {isItemsOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
                            </button>

                            {isItemsOpen && (
                                <div className="pl-6 mt-2 space-y-2">
                                    <Link 
                                        to={`/profile/${companyName}/create-item`} 
                                        className={`text-md block py-2 px-4 rounded transition border-b ${
                                            activeComponent === 'createItems' ? 'bg-gray-600' : 'hover:bg-slate-600'
                                        }`}
                                        onClick={() => handleNavigation('createItems')}
                                    >
                                        Create Item
                                    </Link>
                                    <Link 
                                        to={`/profile/${companyName}/update-item`} 
                                        className={`text-md block py-2 px-4 rounded transition border-b ${
                                            activeComponent === 'updateItems' ? 'bg-gray-600' : 'hover:bg-slate-600'
                                        }`}
                                        onClick={() => handleNavigation('updateItems')}
                                    >
                                        Update Item
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Categories Dropdown */}
                        <div>
                            <button
                                className={`text-lg w-full text-left border-b py-2 flex px-4 justify-between items-center rounded transition ${
                                    activeComponent === 'categories' ? 'bg-gray-600' : 'hover:bg-slate-600'
                                }`}
                                onClick={toggleCategoriesDropdown}
                            >
                                Categories
                                {isCategoriesOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
                            </button>

                            {isCategoriesOpen && (
                                <div className="pl-6 mt-2 space-y-2">
                                    <Link 
                                        to={`/profile/${companyName}/categories`} 
                                        className={`text-md block py-2 px-4 rounded transition border-b ${
                                            activeComponent === 'categories' ? 'bg-gray-600' : 'hover:bg-slate-600'
                                        }`}
                                        onClick={() => handleNavigation('categories')}
                                    >
                                        Manage Categories
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-grow bg-white shadow-inner rounded-lg">
                    {activeComponent === 'display' && <Display />}
                    {activeComponent === 'createInventory' && <CreateInventoryForm />}
                    {activeComponent === 'updateItems' && <UpdateInventory />}
                    {activeComponent === 'createItems' && <CreateItems />}
                    {activeComponent === 'editInventory' && <EditInventory />}
                    {activeComponent === 'categories' && <Categories />}
                </div>
            </div>
        </div>
    );
};

export default Inventory;
