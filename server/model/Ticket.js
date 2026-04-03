const mongoose = require('mongoose'); // 1. CRITICAL: You must import mongoose

const ticketSchema = new mongoose.Schema({
    subject: { 
        type: String, 
        required: [true, "Please provide a subject for the ticket"] 
    },
    status: { 
        type: String, 
        enum: ['Open', 'Resolved', 'In Progress'], // 2. Prevents random status strings
        default: 'Open' 
    },
    studentEmail: { 
        type: String, 
        required: true,
        lowercase: true, // 3. Ensures emails match regardless of casing
        trim: true
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

// 4. Export the model so server/index.js can use it
module.exports = mongoose.model('Ticket', ticketSchema);