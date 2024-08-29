const express = require('express');
const router = express.Router();
const { sendEmail } = require('../controllers/emailController'); // Adjust the path if needed

// Define the POST route for sending an email
router.post('/send-email', sendEmail);

module.exports = router;
