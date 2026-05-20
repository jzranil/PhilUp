import mongoose from "mongoose";

const logsSchema = new mongoose.Schema({
    traceID: {
        type: String,
        required: false,
        trim: true
    },
    userID:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'UserInfo',                     
        required: true
    },
    level: {
        type: String,
        required: false,
        trim: true
    },
    activity: {
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

export default mongoose.model('Logs', logsSchema);