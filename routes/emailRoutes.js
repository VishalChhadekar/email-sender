const express = require('express');
const router = express.Router();
const { sendEmail, sendCheckInEmail, sendComplaintEmail } = require('../controllers/emailController'); // Adjust the path if needed

// POST endpoint for sending email
router.post('/send-email', sendEmail);

// Route for sending web check-in confirmation email
router.post('/sendCheckInEmail', sendCheckInEmail);

// Route for sending complaint raised confirmation email
router.post('/sendComplaintEmail', sendComplaintEmail);

module.exports = router;
