const express = require('express');
const cors = require('cors');
const userModel = require("./models/user");
const inventoryModel = require("./models/inventory");
const itemModel = require('./models/items');
const adminModel = require('./models/admin');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Signup Route
app.get("/signup", function (req, res) {
    try {
        res.send("hello");
    } catch {
        res.send("Something went wrong");
    }
});

app.post("/signup/create", function (req, res) {
    let { companyName, email, password, country, state, phone } = req.body;

    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(password, salt, async function (err, hash) {
            const createUser = await userModel.create({
                companyName,
                email,
                password: hash,
                country,
                state,
                phone
            });

            let token = jwt.sign({ email, userid: createUser._id }, "shhh");
            res.cookie("token", token, {
                expires: new Date(Date.now() + 25892000000),
                httpOnly: true,
                secure: false
            });
            res.status(200).send({ message: "Account Created Successfully", companyName: createUser.companyName });
        });
    });
});

// Login Route
app.post("/login", async function (req, res) {
    let { email, password } = req.body;
    let verifyUser = await userModel.findOne({ email });
    if (!verifyUser) return res.status(404).send("No user found");

    bcrypt.compare(password, verifyUser.password, function (err, result) {
        if (result) {
            let token = jwt.sign({ email, userid: verifyUser._id }, "shhh");
            res.cookie("token", token, {
                expires: new Date(Date.now() + 25892000000),
                httpOnly: true,
                secure: false
            });
            res.status(200).send({ message: "Login Successful", companyName: verifyUser.companyName });
        } else {
            res.status(401).send("Invalid password");
        }
    });
});

// Profile Route
app.get("/profile/:companyName", isLoggedIn, async function (req, res) {
    let { email, userid } = req.user;
    let userData = await userModel.findOne({ email });
    res.send(userData);
});

app.post("/create/inventory", isLoggedIn, async function (req, res) {
    let { email, userid } = req.user;
    let { name, description } = req.body;

    try {
        // Create the new inventory
        let createInventory = await inventoryModel.create({
            name, 
            description,
            user: userid
        });

        const user = await userModel.findById(userid);
        user.inventories.push(createInventory._id);  
        await user.save(); 

        res.status(201).send({
            message: "Inventory created successfully",
            inventory: createInventory
        });
    } catch (error) {
        res.status(500).send("Error creating inventory: " + error.message);
    }
});

app.get('/inventories', isLoggedIn, async (req, res) => {
    const { email } = req.user; 
    try {
        const user = await userModel.findOne({ email }).populate("inventories");
        if (user && user.inventories) {
            res.json(user.inventories); 
        } else {
            res.status(404).json({ message: "No inventories found for this user" });
        }
    } catch (error) {
        console.error("Error fetching inventories:", error);
        res.status(500).json({ message: "Server Error" });
    }
});



app.post("/inventory/:inventoryId/items/create", isLoggedIn, async function (req, res) {
    let { inventoryId } = req.params;
    let { items } = req.body;

    try {
        let inventory = await inventoryModel.findById(inventoryId).populate('items');

        if (!inventory) {
            return res.status(404).send("Inventory not found");
        }

        const existingItems = inventory.items;
        let currentTotalValue = inventory.totalInventoryValue;
        let currentTotalQuantity = inventory.totalInventoryQuantity;

        for (let item of items) {
            const quantity = parseInt(item.quantity, 10); 
            const price = parseFloat(item.price); 
            const itemName = item.itemName; 

           
            const existingItem = existingItems.find(existing => existing.itemName === itemName);

            if (existingItem) {
                
                existingItem.quantity += quantity;
                currentTotalQuantity += quantity;
                currentTotalValue += price * quantity;

                
                await itemModel.findByIdAndUpdate(existingItem._id, { quantity: existingItem.quantity });
            } else {
                let createItem = await itemModel.create({
                    inventory: inventoryId,
                    itemName: itemName,
                    quantity: quantity,
                    price: price,
                    description: item.description,
                    category: item.category
                });

                inventory.items.push(createItem._id);
      
                currentTotalQuantity += quantity;
                currentTotalValue += price * quantity;
            }
        }

        // Update inventory totals
        inventory.totalInventoryValue = currentTotalValue;
        inventory.totalInventoryQuantity = currentTotalQuantity;
        inventory.totalInventoryItems += items.length;

        await inventory.save();

        res.send("Items added successfully");
    } catch (error) {
        res.status(500).send("Error adding items: " + error.message);
    }
});


app.get('/search', isLoggedIn, async (req, res) => {
    try {
        const { query } = req.query; // Get the search query from the request
        const user = await userModel.findOne({ email: req.user.email }).populate({
            path: 'inventories',
            populate: { path: 'items' },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Aggregate items and inventories, and filter based on the query
        const suggestions = [];

        user.inventories.forEach((inventory) => {
            if (inventory.name.toLowerCase().includes(query.toLowerCase())) {
                suggestions.push({
                    _id: inventory._id,
                    name: inventory.name,
                    type: 'inventory',
                });
            }

            inventory.items.forEach((item) => {
                if (item.itemName.toLowerCase().includes(query.toLowerCase()) ||
                    item.category.toLowerCase().includes(query.toLowerCase())) {
                    suggestions.push({
                        _id: item._id,
                        name: item.itemName,
                        type: 'item',
                        category: item.category,
                        inventoryName: inventory.name, // Include inventory name
                    });
                }
            });
        });

        res.json(suggestions);
    } catch (error) {
        console.error('Error fetching search results:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});





app.get("/items", isLoggedIn, async function (req, res) {
    try {
        const { email } = req.user;

        // Fetch user inventories and populate their items
        const user = await userModel.findOne({ email }).populate({
            path: "inventories",
            populate: { path: "items" },
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Aggregate items with their inventory names
        const allItems = user.inventories.flatMap(inventory =>
            inventory.items.map(item => ({
                ...item.toObject(),
                inventory: inventory.name, // Include inventory name
            }))
        );

        res.json(allItems); // Send all items with inventory names
    } catch (error) {
        console.error("Error fetching items:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


// Fetch Inventory Data Route
app.get("/inventory", isLoggedIn, async function (req, res) {
    let { email } = req.user;

    try {
        const user = await userModel.findOne({ email }).populate({
            path: 'inventories',
            populate: {
                path: 'items',
                model: 'Items' // Ensure mongoose uses the correct model for items
            }
        });

        if (!user) return res.status(404).send("User not found");

        // Calculate totals
        const totalInventoryValue = user.inventories.reduce((sum, inv) => sum + inv.totalInventoryValue, 0);
        const totalQuantity = user.inventories.reduce((sum, inv) => sum + inv.totalInventoryQuantity, 0);
        const totalItems = user.inventories.reduce((sum, inv) => sum + inv.totalInventoryItems, 0);

        // Send full inventory data
        res.send({
            companyName: user.companyName,
            country: user.country,
            totalInventoryValue,
            totalQuantity,
            totalItems,
            inventories: user.inventories.map(inventory => ({
                name: inventory.name,
                description: inventory.description,
                totalInventoryValue: inventory.totalInventoryValue,
                totalInventoryQuantity: inventory.totalInventoryQuantity,
                totalInventoryItems: inventory.totalInventoryItems,
                items: inventory.items.map(item => ({
                    itemName: item.itemName,
                    quantity: item.quantity,
                    price: item.price,
                    category: item.category,
                    description: item.description,
                    createdAt: item.createdAt,
                    updatedAt: item.updatedAt
                }))
            }))
        });
    } catch (error) {
        res.status(500).send("Error fetching inventory data: " + error.message);
    }
});

app.delete('/inventories/:inventoryId', async (req, res) => {
    const { inventoryId } = req.params;

    try {
        // Find the inventory to delete
        const inventoryToDelete = await inventoryModel.findById(inventoryId);
        if (!inventoryToDelete) {
            return res.status(404).json({ message: "Inventory not found." });
        }

        // Get the user's ID from the inventory
        const userId = inventoryToDelete.user;

        // Delete associated items (assuming items reference the inventory)
        await itemModel.deleteMany({ inventory: inventoryId });

        // Delete the inventory
        await inventoryModel.deleteOne({ _id: inventoryId });

        // Update the user's inventories by removing the deleted inventory ID
        await userModel.updateOne(
            { _id: userId },
            { $pull: { inventories: inventoryId } } // Remove inventory ID from user's inventories array
        );

        // Optional: Recalculate total quantities, values, etc.
        const user = await userModel.findById(userId).populate("inventories");

        // Recalculate total values or quantities if needed
        // For example, you might want to sum up the quantities from remaining inventories
        let totalQuantity = 0;
        let totalValue = 0;

        user.inventories.forEach(inventory => {
            // Assuming each inventory has a 'totalQuantity' and 'totalValue' field
            totalQuantity += inventory.totalQuantity; // Adjust based on your schema
            totalValue += inventory.totalValue; // Adjust based on your schema
        });

        // Update the user model with new totals (if you have these fields)
        await userModel.updateOne(
            { _id: userId },
            { totalQuantity, totalValue } // Update user with new totals
        );

        res.status(200).json({ message: "Inventory and associated items deleted successfully." });
    } catch (error) {
        console.error("Error deleting inventory:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

app.get('/inventories/:inventoryId/items', async (req, res) => {
    const { inventoryId } = req.params;

    try {
        // Find the inventory by ID and populate its items
        const inventory = await inventoryModel.findById(inventoryId).populate('items'); // Assuming items is an array of ObjectIds referencing Item

        if (!inventory) {
            return res.status(404).json({ message: 'Inventory not found' });
        }

        // Send the items back in the response
        res.json(inventory.items); // Send the items associated with the inventory
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get("/inventories/:inventoryId", async (req, res) => {
    const { inventoryId } = req.params; // Destructure inventoryId from params
    try {
        // Fetch the inventory and populate the items
        const inventory = await inventoryModel.findById(inventoryId).populate('items'); // Adjust the field name if needed
        if (!inventory) {
            return res.status(404).json({ message: 'Inventory not found' });
        }
        res.json(inventory);
    } catch (error) {
        console.error('Error fetching inventory:', error);
        res.status(500).json({ message: 'An error occurred while fetching inventory details.' });
    }
});

app.get('/item/:itemId', isLoggedIn, async (req, res) => {
    try {
        const { itemId } = req.params;
        const item = await itemModel.findById(itemId).populate({
            path: 'inventory', // The field to populate
            select: 'name', // Specify the fields you want to retrieve from the inventory model
        });

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.json(item);
    } catch (error) {
        console.error('Error fetching item details:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



app.put('/items/:itemId', async (req, res) => {
    const { itemId } = req.params;
    const { name, price, quantity, category } = req.body;

    try {
        const oldItem = await itemModel.findById(itemId);
        if (!oldItem) {
            return res.status(404).json({ message: 'Item not found' });
        }

        const updatedItem = await itemModel.findByIdAndUpdate(
            itemId,
            { itemName: name, price, quantity, category },
            { new: true }
        );

        // Calculate the differences using parseInt
        const quantityDifference = parseInt(quantity) - parseInt(oldItem.quantity);
        const valueDifference = (parseInt(price) * parseInt(quantity)) - (parseInt(oldItem.price) * parseInt(oldItem.quantity));

        // Update the associated inventory totals
        const inventory = await inventoryModel.findByIdAndUpdate(
            updatedItem.inventory,
            {
                $inc: {
                    totalInventoryQuantity: quantityDifference,
                    totalInventoryValue: valueDifference,
                    totalInventoryItems: 0 // This remains unchanged unless you change the total items count
                }
            },
            { new: true } // Return the updated inventory
        );

        res.json({ message: 'Item and inventory totals updated successfully', updatedItem, inventory });
    } catch (error) {
        console.error('Error updating item or inventory totals:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


app.put('/inventories/:inventoryId', async (req, res) => {
    const { inventoryId } = req.params;
    const { name } = req.body;

    try {
        const updatedInventory = await inventoryModel.findByIdAndUpdate(
            inventoryId,
            { name },
            { new: true } // Return the updated inventory
        );

        if (!updatedInventory) {
            return res.status(404).json({ message: 'Inventory not found.' });
        }

        res.json(updatedInventory);
    } catch (error) {
        console.error('Error updating inventory:', error);
        res.status(500).json({ message: 'An error occurred while updating the inventory.' });
    }
});



app.delete('/items/:itemId', async (req, res) => {
    const { itemId } = req.params;

    try {
        const deletedItem = await itemModel.findByIdAndDelete(itemId);

        if (!deletedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Find the associated inventory
        const inventory = await inventoryModel.findOne({ items: itemId });

        if (inventory) {
            // Calculate new totals
            const remainingItems = await itemModel.find({ _id: { $in: inventory.items } });
            const newTotalQuantity = remainingItems.reduce((acc, item) => acc + parseInt(item.quantity), 0);
            const newTotalValue = remainingItems.reduce((acc, item) => acc + (parseInt(item.price) * parseInt(item.quantity)), 0);
            const newTotalItems = remainingItems.length;

            // Update the inventory with recalculated totals
            inventory.totalInventoryQuantity = newTotalQuantity;
            inventory.totalInventoryValue = newTotalValue;
            inventory.totalInventoryItems = newTotalItems;

            await inventory.save();
        }

        res.json({ message: 'Item deleted successfully', inventory });
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});






// Logout Route
app.post("/logout", function (req, res) {
    res.cookie("token", "", {
        httpOnly: true,
        secure: false,
        expires: new Date(0),
    });
    res.status(200).send({ message: "Logged out successfully" });
});

app.get("/country", isLoggedIn, async function (req, res) {
    try {
        const { email, userid } = req.user;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user.country);

    } catch (error) {
        console.error('Error fetching user country:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get("/companyName", isLoggedIn, async function (req, res) {
    try {
        const { email, userid } = req.user;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user.companyName);

    } catch (error) {
        console.error('Error fetching user country:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


app.get("/categories", isLoggedIn, async (req, res) => {
    try {
        const { email } = req.user;

        // Find user by email and populate inventories
        const user = await userModel.findOne({ email }).populate("inventories");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Initialize a Set to store unique categories
        const categoriesSet = new Set();

        // Loop through each inventory and retrieve items
        for (const inventory of user.inventories) {
            // Populate items for each inventory
            await inventory.populate("items");

            // Add categories of each item to the Set
            for (const item of inventory.items) {
                if (item.category) {
                    categoriesSet.add(item.category);
                }
            }
        }

        // Convert Set to Array
        const categories = Array.from(categoriesSet);

        res.json({ categories });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Failed to fetch categories', error: error.message });
    }
});


app.get("/categories/:category/items", isLoggedIn, async (req, res) => {
    try {
        const { category } = req.params;
        const { email } = req.user;

        // Find user by email and populate inventories
        const user = await userModel.findOne({ email }).populate({
            path: 'inventories',
            populate: {
                path: 'items', // Populate items in each inventory
                model: 'Items' // Specify the model for items
            }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Initialize an array to store user-specific items of the requested category
        const userItems = [];

        // Loop through each inventory to find items of the specified category
        for (const inventory of user.inventories) {
            // Filter items by category
            const filteredItems = inventory.items.filter(item => 
                item.category === category &&
                item.inventory && // Ensure item.inventory is defined
                item.inventory.toString() === inventory._id.toString() // Check if item belongs to this inventory
            );

            // Add filtered items with inventory name to userItems array
            for (const item of filteredItems) {
                userItems.push({
                    ...item.toObject(), // Convert item to plain object
                    inventoryName: inventory.name // Add inventory name
                });
            }
        }

        res.json(userItems);
    } catch (error) {
        console.error('Error fetching items by category:', error);
        res.status(500).json({ message: 'Failed to fetch items', error: error.message });
    }
});

//--------------ADMIN SETTINGS--------------

app.post("/admin", async (req, res) => {
    // Hardcoded values
    let { username , password } = req.body ;
    const admin  = await adminModel.findOne({ username });
    

    bcrypt.compare(password, admin.password , function (err, result) {
        if (result) {
            let token = jwt.sign({ username}, "shhhh");
            res.cookie("token", token, {
                expires: new Date(Date.now() + 25892000000),
                httpOnly: true,
                secure: false
            });
            res.status(200).send({ message: "Login Successful" });
        } else {
            res.status(401).send("Invalid password");
        }
    });

});

app.get('/check-admin', adminIsLoggedIn, (req, res) => {
    res.status(200).send({ isAdmin: true });
});



app.get("/admin/users" , async (req,res)=> {
    const user = await userModel.find({});
    res.json(user);
});

app.get("/admin/inventories" , async (req,res)=> {
    const inventory = await inventoryModel.find({});
    res.json(inventory);
});

app.get("/admin/items", async (req, res) => {
    try {
        // Fetch all items and populate the inventory field with its 'name'
        const items = await itemModel.find({}).populate('inventory', 'name'); 

        res.json(items); // Send items with populated inventory name
    } catch (error) {
        console.error("Error fetching items with inventory names:", error);
        res.status(500).json({ message: "Server error fetching items." });
    }
});





app.put('/admin/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const updatedData = req.body; // Assuming you're sending the updated user data in the request body

        // Find user by ID and update it
        const updatedUser = await userModel.findByIdAndUpdate(userId, updatedData, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(updatedUser); // Send the updated user data back
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.delete('/admin/users/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Step 1: Find and delete the user
        const user = await userModel.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Step 2: Delete all inventories associated with the user
        const inventories = await inventoryModel.find({ user: id }); // Adjust this if your field name is different
        const inventoryIds = inventories.map(inv => inv._id);

        // Delete the inventories
        await inventoryModel.deleteMany({ user: id });

        // Step 3: Delete all items associated with the deleted inventories
        await itemModel.deleteMany({ inventory: { $in: inventoryIds } }); // Adjust this if your field name is different

        return res.status(200).json({ message: 'User and associated inventories and items deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        return res.status(500).json({ message: 'Server error' });
    }
});

app.put('/admin/inventories/:inventoryId', async (req, res) => {
    const { inventoryId } = req.params;
    const { name, description } = req.body;

    try {
        // Find and update the inventory with new name and description
        const updatedInventory = await inventoryModel.findByIdAndUpdate(
            inventoryId,
            { name, description },
            { new: true }
        );

        if (!updatedInventory) {
            return res.status(404).json({ message: 'Inventory not found' });
        }

        res.json(updatedInventory);
    } catch (error) {
        console.error('Error updating inventory:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Delete Inventory - DELETE /api/inventories/:inventoryId
app.delete('/admin/inventories/:inventoryId', async (req, res) => {
    const { inventoryId } = req.params;

    try {
        // Find the inventory and delete it
        const deletedInventory = await inventoryModel.findByIdAndDelete(inventoryId);

        if (!deletedInventory) {
            return res.status(404).json({ message: 'Inventory not found' });
        }

        // Remove the inventory from the user's document
        await userModel.updateMany(
            { inventories: inventoryId },
            { $pull: { inventories: inventoryId } }
        );

        // Delete all items associated with this inventory
        await itemModel.deleteMany({ inventory: inventoryId });

        res.json({ message: 'Inventory and associated items deleted successfully' });
    } catch (error) {
        console.error('Error deleting inventory:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.put('/items/:itemId', async (req, res) => {
    const { itemId } = req.params;
    const { name, price, quantity, category } = req.body;

    try {
        const oldItem = await itemModel.findById(itemId);
        if (!oldItem) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Update the item details
        const updatedItem = await itemModel.findByIdAndUpdate(
            itemId,
            { itemName: name, price, quantity, category },
            { new: true }
        );

        // Calculate differences for quantity and value
        const quantityDifference = parseInt(quantity) - parseInt(oldItem.quantity);
        const valueDifference = (parseInt(price) * parseInt(quantity)) - (parseInt(oldItem.price) * parseInt(oldItem.quantity));

        // Update the associated inventory totals
        const inventory = await inventoryModel.findByIdAndUpdate(
            updatedItem.inventory,
            {
                $inc: {
                    totalInventoryQuantity: quantityDifference,
                    totalInventoryValue: valueDifference,
                    // Only update item count if the total number of items changes
                    totalInventoryItems: 0 // Update this if necessary
                }
            },
            { new: true } // Return the updated inventory
        );

        res.json({ message: 'Item and inventory totals updated successfully', updatedItem, inventory });
    } catch (error) {
        console.error('Error updating item or inventory totals:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



app.delete('/items/:itemId', async (req, res) => {
    const { itemId } = req.params;

    try {
        const deletedItem = await itemModel.findByIdAndDelete(itemId);
        if (!deletedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Find the associated inventory
        const inventory = await inventoryModel.findOne({ items: itemId });

        if (inventory) {
            // Recalculate totals based on remaining items
            const remainingItems = await itemModel.find({ _id: { $in: inventory.items } });
            const newTotalQuantity = remainingItems.reduce((acc, item) => acc + parseInt(item.quantity), 0);
            const newTotalValue = remainingItems.reduce((acc, item) => acc + (parseInt(item.price) * parseInt(item.quantity)), 0);
            const newTotalItems = remainingItems.length;

            // Update the inventory with recalculated totals
            inventory.totalInventoryQuantity = newTotalQuantity;
            inventory.totalInventoryValue = newTotalValue;
            inventory.totalInventoryItems = newTotalItems; // Update item count
            
            await inventory.save();
        }

        res.json({ message: 'Item deleted successfully', inventory });
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});




//------------MIDDLEWARES-----------

// Authentication Middleware
function isLoggedIn(req, res, next) {
    if (!req.cookies.token) {
        return res.status(401).send("You must be logged in");
    }
    try {
        const data = jwt.verify(req.cookies.token, "shhh");
        req.user = data;
        next();
    } catch (error) {
        return res.status(401).send("Invalid token");
    }
}

function adminIsLoggedIn(req, res, next) {
    if (!req.cookies.token) {
        return res.status(401).send("You must be logged in");
    }
    try {
        const data = jwt.verify(req.cookies.token, "shhhh");
        req.admin = data;
        next();
    } catch (error) {
        return res.status(401).send("Invalid token");
    }
}



//------------SERVER----------------
// Server Listener
app.listen(3000, () => {
    console.log("Server running at port: 3000");
});
