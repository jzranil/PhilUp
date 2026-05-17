import mongoose from "mongoose";

const fuelPricesSchema = new mongoose.Schema({
    fuelDesc: {
        type: String,
        required: false,
        trim: true
    },
    fuelTypeID: {
        type: mongoose.Schema.Types.ObjectId, // Tells MongoDB this is a default _id
        ref: 'FuelType',                      // Tells Mongoose WHICH model this ID belongs to
        required: true
    },
    stationLocID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StationLocation',               // Links to your StationLocation model
        required: true
    },
    fuelPrice: {
        type: Number, 
        required: false
    },
    forEval: {
        type: Number,
        default: 1, // Changed from 0 to 1 so all new entries default to "pending evaluation"
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
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'UserInfo',                     
        required: true
    }
}, { 
    timestamps: { 
        createdAt: 'dateCreated', 
        updatedAt: 'dateUpdated' 
    } 
});

export default mongoose.model('FuelPrice', fuelPricesSchema);