const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path'); // Only declare this ONCE
const fs = require('fs');     // Only declare this ONCE
require('dotenv').config();

// --- 📂 DEBUG LOGS ---
// This will tell us EXACTLY what files Render sees in your models folder
const modelsPath = path.join(__dirname, 'models');
console.log("📂 Checking models directory at:", modelsPath);

if (fs.existsSync(modelsPath)) {
    console.log("✅ Models folder found. Files inside:", fs.readdirSync(modelsPath));
} else {
    console.log("❌ Models folder NOT found at that path!");
}

// --- 🚀 FAIL-SAFE IMPORTS ---
const User = require(path.join(__dirname, 'models', 'User'));
const Ticket = require(path.join(__dirname, 'models', 'Ticket'));

const app = express();

// Middleware
app.use(express.json());

// 🛡️ UPDATED CORS
app.use(cors({
  origin: "https://student-helpdesk-2-0.vercel.app", 
  methods: ["GET", "POST", "PATCH", "DELETE"],
  credentials: true
}));

// --- AUTH ROUTES ---
app.post('/register', async (req, res) => {
    try {
        const { email, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = new User({ 
            email: email.toLowerCase().trim(), 
            password: hashedPassword, 
            role: role.toLowerCase() 
        });
        
        await newUser.save();
        res.status(201).json({ message: "User created!" });
    } catch (err) {
        console.error("Signup Error:", err);
        res.status(400).json({ error: "Email already exists or invalid data" });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email.toLowerCase().trim() });

        if (!user) return res.status(400).json({ error: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Wrong password" });

        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET || "fallback_secret", 
            { expiresIn: '24h' }
        );

        res.json({ token, role: user.role, email: user.email });
    } catch (err) {
        res.status(500).json({ error: "Server error during login" });
    }
});

// --- TICKET ROUTES ---
app.post('/tickets', async (req, res) => {
    try {
        const { subject, studentEmail } = req.body;
        const newTicket = new Ticket({ subject, studentEmail: studentEmail.toLowerCase() });
        await newTicket.save();
        res.status(201).json(newTicket);
    } catch (err) {
        res.status(500).json({ error: "Could not create ticket" });
    }
});

app.get('/tickets', async (req, res) => {
    try {
        const tickets = await Ticket.find().sort({ createdAt: -1 });
        res.json(tickets);
    } catch (err) {
        res.status(500).json({ error: "Error fetching tickets" });
    }
});

app.get('/my-tickets/:email', async (req, res) => {
    try {
        const tickets = await Ticket.find({ 
            studentEmail: req.params.email.toLowerCase() 
        }).sort({ createdAt: -1 });
        res.json(tickets);
    } catch (err) {
        res.status(500).json({ error: "Error fetching your tickets" });
    }
});

app.delete('/tickets/:id', async (req, res) => {
    try {
        await Ticket.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted" });
    } catch (err) {
        res.status(500).json({ error: "Delete failed" });
    }
});

app.patch('/tickets/:id', async (req, res) => {
    try {
        const updatedTicket = await Ticket.findByIdAndUpdate(
            req.params.id, 
            { status: "Resolved" }, 
            { new: true }
        );
        res.json(updatedTicket);
    } catch (err) {
        res.status(500).json({ error: "Update failed" });
    }
});

// --- SERVER START ---
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error("❌ MONGO_URI is missing from Environment Variables!");
    process.exit(1);
}

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("☁️ Secure Database Connected");
        app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server running on port ${PORT}`));
    })
    .catch(err => {
        console.error("❌ MongoDB Connection Error:", err);
        process.exit(1);
    });