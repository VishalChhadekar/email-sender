const nodemailer = require('nodemailer');
require('dotenv').config();

const sendEmail = async (req, res) => {
    try {
        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_HOST,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        console.log(req.body)

        const htmlTemplate = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Flight Booking Confirmation</title>
                <style>
                    body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
                    .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); }
                    .header { background-color: #007bff; color: #ffffff; padding: 20px; text-align: center; }
                    .header img { width: 100px; height: auto; }
                    .content { padding: 20px; }
                    .content h2 { color: #333333; margin-bottom: 15px; }
                    .content p { color: #555555; line-height: 1.6; }
                    .footer { background-color: #007bff; color: #ffffff; text-align: center; padding: 10px; }
                    .footer p { margin: 0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <!-- Header -->
                    <div class="header">
                        <img src="https://via.placeholder.com/100x50?text=Logo" alt="Company Logo">
                        <h1>Flight Booking Confirmation</h1>
                    </div>

                    <!-- Content -->
                    <div class="content">
                        <h2>Dear Customer,</h2>
                        <p>Your flight has been successfully booked! Please find the details below:</p>
                        <p><strong>Flight Number:</strong> ABC123</p>
                        <p><strong>Departure:</strong> City {{req.body.departure}} to City {{req.body.destination}}</p>
                        <p><strong>Date:</strong> {{req.body.travelDate}}</p>
                        <p>Thank you for choosing our service. We wish you a pleasant journey!</p>
                    </div>

                    <!-- Footer -->
                    <div class="footer">
                        <p>&copy; 2024 Travel Assist. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: req.body.to,
            subject: 'Your Flight Booking Confirmation',
            html: htmlTemplate,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Email sent successfully.'});
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Failed to send email.', error });
    }
};

module.exports = { sendEmail };
