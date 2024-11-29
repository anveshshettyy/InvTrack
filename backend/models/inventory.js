const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },  
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    items: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Items"
        }
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    totalInventoryValue: { type: Number, default: 0 }, 
    totalInventoryQuantity: { type: Number, default: 0 },
    totalInventoryItems: { type: Number, default: 0 }  
});

const Inventory = mongoose.model('Inventory', inventorySchema);

module.exports = Inventory;
