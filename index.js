const express = require('express');
const app = express();
const emailRoutes = require('./routes/emailRoutes'); // Ensure the path is correct

app.use(express.json()); // Parse JSON bodies

// Use the email routes
app.use('/api', emailRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
