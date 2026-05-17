import mongoose from "mongoose";

const userInfosSchema = new mongoose.Schema({
    userPermissionLevel:{
        type: Number,
        required: false,
        default: 0 // Good practice to set default here rather than just the controller
    },
    userFName: { 
        type: String, 
        required: false 
    },
    userLName: { 
        type: String, 
        required: false 
    },
    userBirthDate: { 
        type: Date, 
        required: false 
    },
    userAddress: { 
        type: String, 
        required: false 
    },
    userEmail: { 
        type: String, 
        required: false, 
        lowercase: true 
    },
    userContact: { 
        type: String, 
        required: false 
    },
    userName: { 
        type: String, 
        required: false 
    },
    userPassword: { 
        type: String, 
        required: false 
    }
}, { 
    timestamps: { 
        createdAt: 'dateCreated', 
        updatedAt: 'dateUpdated' 
    } 
});

export default mongoose.model('UserInfo', userInfosSchema);