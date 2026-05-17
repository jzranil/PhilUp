import mongoose from "mongoose";

const brandsSchema = new mongoose.Schema({
    brandDesc: {
        type: String,
        required: false,
        trim: true
    },
    brandImage: {
        type: String, 
        required: false
    }
}, { 
    timestamps: { 
        createdAt: 'dateCreated', 
        updatedAt: 'dateUpdated' 
    } 
});

export default mongoose.model('Brand', brandsSchema);