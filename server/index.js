const User = require('./models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// REGISTER
app.post('/register', async (req, res) => {
    try {
        const { email, password, role } = req.body;
        // Hash the password (security 101)
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = new User({ email, password: hashedPassword, role });
        await newUser.save();
        res.json({ message: "User created!" });
    } catch (err) {
        res.status(400).json({ error: "Email already exists" });
    }
});

// LOGIN
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ error: "User not found" });

    // Compare entered password with hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Wrong password" });

    // Create a Token (the user's digital ID card)
    const token = jwt.sign({ id: user._id, role: user.role }, "SECRET_KEY", { expiresIn: '1h' });

    res.json({ token, role: user.role, email: user.email });
});

app.delete('/tickets/:id', async (req, res) => {
    // In a "Perfect Website," you'd check the JWT token here
    // to see if the user is an Admin before deleting.
    await Ticket.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
});

// CREATE TICKET
app.post('/tickets', async (req, res) => {
    try {
        const { subject, studentEmail } = req.body;
        
        const newTicket = new Ticket({ 
            subject, 
            studentEmail 
        });

        await newTicket.save();
        res.json(newTicket);
    } catch (err) {
        res.status(500).json({ error: "Could not create ticket" });
    }
});

// GET TICKETS FOR A SPECIFIC STUDENT
app.get('/my-tickets/:email', async (req, res) => {
    try {
        const email = req.params.email;
        const tickets = await Ticket.find({ studentEmail: email }).sort({ createdAt: -1 });
        res.json(tickets);
    } catch (err) {
        res.status(500).json({ error: "Error fetching your tickets" });
    }
});

// Use process.env to hide your secrets
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET; 

mongoose.connect(MONGO_URI)
    .then(() => console.log("☁️ Secure Database Connected"))
    .catch(err => console.log(err));

// Use the secret for signing tokens
const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
