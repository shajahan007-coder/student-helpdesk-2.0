const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { 
        type: String, 
        required: true, 
        unique: true,
        lowercase: true, 
        trim: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    role: { 
        type: String, 
        // 🚀 Updated to allow both capitalized and lowercase for safety
        enum: ['student', 'admin', 'Student', 'Admin'], 
        default: 'student',
        lowercase: true // This will automatically convert 'Student' to 'student' before saving
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);