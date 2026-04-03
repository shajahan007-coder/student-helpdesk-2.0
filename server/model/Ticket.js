const ticketSchema = new mongoose.Schema({
    subject: { type: String, required: true },
    status: { type: String, default: 'Open' },
    studentEmail: { type: String, required: true }, // The owner of the ticket
    createdAt: { type: Date, default: Date.now }    // Good for sorting by "Newest"
});