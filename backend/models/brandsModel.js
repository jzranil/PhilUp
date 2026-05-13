const mongoose = require('mongoose');

const brandsSchema = new mongoose.Schema({
    brandID: {
        type: Number,
        required: true,
        unique: true
    },
    brandDesc: {
        type: String,
        required: false,
        trim: true
    },
    brandImage: {
        type: String, // Stores the image URL or file path
        required: false
    }
}, { 
    // Automatically manages dateCreated and dateUpdated
    timestamps: { 
        createdAt: 'dateCreated', 
        updatedAt: 'dateUpdated' 
    } 
});

const Brand = mongoose.model('Brand', brandsSchema);