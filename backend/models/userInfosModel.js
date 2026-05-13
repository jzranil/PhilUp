const mongoose = require('mongoose');

const userInfosSchema = new mongoose.Schema({
    userID: { 
        type: String, 
        required: false, 
        unique: true 
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
    // Automatically manages dateCreated and dateUpdatedt)
    timestamps: { 
        createdAt: 'dateCreated', 
        updatedAt: 'dateUpdated' 
    } 
});

const UserInfo = mongoose.model('UserInfo', userInfosSchema);