const mongoose = require('mongoose');

const fuelTypesSchema = new mongoose.Schema({
    fuelTypeID: {
        type: Number,
        required: true,
        unique: true
    },
    fuelTypeDesc: {
        type: String,
        required: false,
        trim: true
    }
}, { 
    // Automatically manages dateCreated and dateUpdated
    timestamps: { 
        createdAt: 'dateCreated', 
        updatedAt: 'dateUpdated' 
    } 
});

const FuelType = mongoose.model('FuelType', fuelTypesSchema);