import mongoose from "mongoose";

const fuelTypesSchema = new mongoose.Schema({
    fuelTypeDesc: {
        type: String,
        required: false,
        trim: true
    }
}, { 
    timestamps: { 
        createdAt: 'dateCreated', 
        updatedAt: 'dateUpdated' 
    } 
});

export default mongoose.model('FuelType', fuelTypesSchema);