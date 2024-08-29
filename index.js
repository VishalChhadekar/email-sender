const express = require('express');
const app = express();
const emailRoutes = require('./routes/emailRoutes'); // Adjust the path if needed

app.use(express.json());

// Use the email routes
app.use('/api', emailRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
