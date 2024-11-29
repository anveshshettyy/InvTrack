const mongoose = require('mongoose');

const itemsSchema = new mongoose.Schema({
    itemName: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    category: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    inventory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Inventory"
    }
});

const Items = mongoose.model('Items', itemsSchema);

module.exports = Items;
