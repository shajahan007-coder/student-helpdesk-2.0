const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load variables from .env file

// Import Models
const User = require('./models/User');
const Ticket = require('./models/Ticket');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: "https://student-helpdesk-2-0.vercel.app/", // Put your REAL Vercel URL here
  methods: ["GET", "POST", "PATCH", "DELETE"],
  credentials: true
}));
// --- AUTH ROUTES ---

// REGISTER
app.post('/register', async (req, res) => {
    try {
        const { email, password, role } = req.body;
        
        // Hash the password (Security 101)
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = new User({ 
            email: email.toLowerCase(), 
            password: hashedPassword, 
            role 
        });
        
        await newUser.save();
        res.status(201).json({ message: "User created!" });
    } catch (err) {
        res.status(400).json({ error: "Email already exists or invalid data" });
    }
});

// LOGIN
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) return res.status(400).json({ error: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Wrong password" });

        // Create a Token using your Secret Key from .env
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

// CREATE TICKET
app.post('/tickets', async (req, res) => {
    try {
        const { subject, studentEmail } = req.body;
        const newTicket = new Ticket({ subject, studentEmail });
        await newTicket.save();
        res.status(201).json(newTicket);
    } catch (err) {
        res.status(500).json({ error: "Could not create ticket" });
    }
});

// GET ALL TICKETS (For Admin)
app.get('/tickets', async (req, res) => {
    try {
        const tickets = await Ticket.find().sort({ createdAt: -1 });
        res.json(tickets);
    } catch (err) {
        res.status(500).json({ error: "Error fetching tickets" });
    }
});

// GET TICKETS FOR A SPECIFIC STUDENT
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

// DELETE TICKET
app.delete('/tickets/:id', async (req, res) => {
    try {
        await Ticket.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted" });
    } catch (err) {
        res.status(500).json({ error: "Delete failed" });
    }
});

// UPDATE TICKET STATUS (Resolve)
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

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("☁️ Secure Database Connected");
        app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    })
    .catch(err => console.error("❌ MongoDB Connection Error:", err));