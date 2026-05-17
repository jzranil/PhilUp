import mongoose from "mongoose";

const stationLocationsSchema = new mongoose.Schema({
    brandID:{
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Brand',                     
            required: true
    },
    stationAddress: {
        type: String,
        required: false
    },
    stationLong: {
        type: String,
        required: false
    },
    stationLat: {
        type: String,
        required: false
    },
    forEval: {
        type: Number,
        default: 1, // Defaulting to 1 so all new creations go to evaluation queue
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
    },
    prevVisits: {
        type: Number, 
        required: false
    },
    weeklyVisits: {
        type: Number, 
        required: false
    }
}, { 
    timestamps: { 
        createdAt: 'dateCreated', 
        updatedAt: 'dateUpdated' 
    } 
});

export default mongoose.model('StationLocation', stationLocationsSchema);