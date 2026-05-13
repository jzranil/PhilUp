const mongoose = require('mongoose');

const fuelPricesSchema = new mongoose.Schema({
    fuelPriceID: {
        type: Number,
        required: true,
        unique: true
    },
    fuelDesc: {
        type: String,
        required: false,
        trim: true
    },
    fuelTypeID: {
        type: Number, // Foreign key reference
        required: false
    },
    stationLocID: {
        type: Number, // Foreign key reference to stationLocations
        required: false
    },
    fuelPrice: {
        type: Number, // Replaces float
        required: false
    },
    forEval: {
        type: Number,
        default: 0,
        min: 0,
        max: 1
    },
    isAccepted: {
        type: Number,
        default: 0,
        min: 0,
        max: 1
    },
    uploadedBy: {
        type: Number, // Reference to userID
        required: false
    }
}, { 
    timestamps: { 
        createdAt: 'dateCreated', 
        updatedAt: 'dateUpdated' 
    } 
});

const FuelPrice = mongoose.model('FuelPrice', fuelPricesSchema);