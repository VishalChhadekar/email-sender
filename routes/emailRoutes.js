const express = require('express');
const router = express.Router();
const { sendEmail } = require('../controllers/emailController'); // Ensure the path is correct

// Define the POST route for sending an email
router.post('/send-email', sendEmail);

module.exports = router;
