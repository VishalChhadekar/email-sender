const nodemailer = require('nodemailer');
require('dotenv').config();

// /api/send-email.js
const nodemailer = require('nodemailer');

export default function handler(req, res) {
    if (req.method === 'POST') {
        const { to, subject, text } = req.body;

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        let mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).json({ message: 'Error sending email', error });
            } else {
                return res.status(200).json({ message: 'Email sent', info });
            }
        });
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}


module.exports = { sendEmail };
