import React from 'react';
import Home from './Pages/Home';
import { Link, Route, Routes } from 'react-router-dom';
import SignUp from './Pages/SignUp';
import SignIn from './Pages/SignIn';
import Profile from './Pages/Profile';
import Logout from './Pages/Logout';
import Inventory from './Pages/Inventory';
import CreateInventory from './Components/CreateInventory';
import CreateItems from './Components/CreateItems';
import UpdateInventory from './Components/UpdateInventory';
import EditInventory from './Components/EditInventory';
import InventoryDetails from './Components/InventoryDetails';
import ItemDetails from './Components/ItemDetails';
import Categories from './Components/Categories';
import AdminPage from './Pages/AdminPage';
import AdminLogin from './Pages/AdminLogin';
import Contact from './Pages/Contact';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/signin' element={<SignIn />} />
        <Route path='/profile/:companyName' element={<Profile />} />
        <Route path='/profile/:companyName/:inventory' element={<Inventory />} />
        <Route path='/create-inventory' element={<CreateInventory />} />
        <Route path='/update-inventory' element={<UpdateInventory />} />
        <Route path='/edit-inventory' element={<EditInventory />} />
        <Route path='/create-items' element={<CreateItems />} />
        <Route path='/categories' element={<Categories />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/inventory/:inventoryId' element={<InventoryDetails />} />
        <Route path='/item/:itemId' element={<ItemDetails />} />
        <Route path='/logout' element={<Logout />} />
        <Route path='/admin' element={<AdminPage/>} />
        <Route path='/adminLogin' element={<AdminLogin/>} />
      </Routes>
    </div>
  );
}


export default App;
