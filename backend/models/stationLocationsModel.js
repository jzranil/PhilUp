const mongoose = require('mongoose');

const stationLocationsSchema = new mongoose.Schema({
    stationLocID: {
        type: Number,
        required: true,
        unique: true
    },
    brandID: {
        type: Number, // Reference to the Brand collection
        required: false
    },
    stationAddress: {
        type: String,
        required: false
    },
    stationLong: {
        type: String,
        required: false
    },
    statioLat: {
        type: String,
        required: false
    },
    forEval: {
        type: Number,
        default: 0, // Represents 1/0
        min: 0,
        max: 1
    },
    isAccepted: {
        type: Number,
        default: 0, // Represents 1/0
        min: 0,
        max: 1
    },
    uploadedBy: {
        type: Number, // Mapping to userID from your previous schema
        required: false
    }
}, { 
    // Automatically manages dateCreated and dateUpdated
    timestamps: { 
        createdAt: 'dateCreated', 
        updatedAt: 'dateUpdated' 
    } 
});

const StationLocation = mongoose.model('StationLocation', stationLocationsSchema);