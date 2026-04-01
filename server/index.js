require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// --- PRODUCTION CORS ---
// Replace the URL with your actual Vercel link once you deploy
app.use(cors({
    origin: ["http://localhost:3000", "https://student-helpdesk-2-0.vercel.app/"]
}));

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("☁️ Cloud Database Connected"))
    .catch(err => console.log(err));

const ticketSchema = new mongoose.Schema({
    subject: String,
    status: { type: String, default: 'Open' }
});

const Ticket = mongoose.model('Ticket', ticketSchema);

// GET ALL
app.get('/all-tickets', async (req, res) => {
    const tickets = await Ticket.find();
    res.json(tickets);
});

// CREATE
app.post('/tickets', async (req, res) => {
    const newTicket = new Ticket({ subject: req.body.subject });
    await newTicket.save();
    res.json(newTicket);
});

// UPDATE
app.put('/tickets/:id', async (req, res) => {
    const updated = await Ticket.findByIdAndUpdate(req.params.id, { status: 'Resolved' }, { new: true });
    res.json(updated);
});

// DELETE
app.delete('/tickets/:id', async (req, res) => {
    await Ticket.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));