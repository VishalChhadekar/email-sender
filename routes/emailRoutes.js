const express = require('express');
const router = express.Router();
const { sendEmail } = require('../controllers/emailController'); // Adjust the path if needed

// POST endpoint for sending email
router.post('/send-email', sendEmail);

module.exports = router;
