const nodemailer = require('nodemailer');
require('dotenv').config();
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');


const generateBoardingPass = (pnr, passengerName, flightNumber, departure, destination, departureTime, arrivalTime, seatNumber, gateNumber) => {
    const doc = new PDFDocument({ size: 'A4', margins: { top: 50, bottom: 50, left: 50, right: 50 } });
    const filePath = path.join(__dirname, 'boarding-pass.pdf');

    // Pipe the PDF into a writable stream
    doc.pipe(fs.createWriteStream(filePath));

    // Set document title and author
    doc.info.Title = 'Boarding Pass';
    doc.info.Author = 'TravelMate Airlines';

    // Styling
    const primaryColor = '#007bff';
    const secondaryColor = '#f4f4f4';
    const textColor = '#333';

    // Add Airline Logo
    // doc.image('', 50, 50, { fit: [100, 50] });

    // Add Title and Branding
    doc.fillColor(primaryColor).fontSize(30).text('BOARDING PASS', 50, 120, { align: 'center' });
    doc.moveTo(50, 160).lineTo(550, 160).stroke(primaryColor); // Header underline

    // Flight Information Section
    doc.fillColor(textColor).fontSize(18).text(`Passenger: ${passengerName}`, 50, 180);
    doc.text(`PNR: ${pnr}`, 50, 210);
    doc.text(`Flight: ${flightNumber}`, 50, 240);
    doc.moveDown();

    // Departure & Destination
    doc.fontSize(14).text(`Departure: ${departure}`, 50, 280);
    doc.text(`Destination: ${destination}`, 50, 310);
    doc.text(`Departure Time: ${departureTime}`, 50, 340);
    doc.text(`Arrival Time: ${arrivalTime}`, 50, 370);

    // Divider Line
    doc.moveTo(50, 400).lineTo(550, 400).stroke();

    // Gate and Seat Information
    doc.fillColor(textColor).fontSize(16).text(`Gate: ${gateNumber}`, 50, 420);
    doc.text(`Seat Number: ${seatNumber}`, 50, 450);

    // Important Notes Section
    doc.moveDown();
    doc.fillColor(primaryColor).fontSize(12).text('IMPORTANT INFORMATION', 50, 490);
    doc.moveTo(50, 510).lineTo(550, 510).stroke(primaryColor);

    doc.fillColor(textColor).fontSize(10).text('• Please arrive at the boarding gate 45 minutes before departure.', 50, 530);
    doc.text('• This boarding pass is valid only for the mentioned flight.', 50, 550);
    doc.text('• Ensure you carry a valid government-issued ID along with this boarding pass.', 50, 570);

    // Footer Section
    doc.fillColor(primaryColor).moveTo(50, 650).lineTo(550, 650).stroke(primaryColor);
    doc.fillColor(textColor).fontSize(10).text('© 2024 TravelMate Airlines. All rights reserved.', { align: 'center', baseline: 'bottom' });

    // Bar Code (Placeholder)
    // doc.image('path-to-barcode.png', 50, 600, { fit: [150, 50] });

    // Finalize PDF
    doc.end();

    return filePath;
};

// Common function for sending emails
const createTransporter = () => {
    return nodemailer.createTransport({
        service: process.env.EMAIL_HOST,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
};

// Handler for flight booking confirmation email
const sendEmail = async (req, res) => {
    try {
        const transporter = createTransporter();
        const { to, departure, destination, travelDate, flightNumber } = req.body;

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
                        <p><strong>PNR:</strong> ${flightNumber}</p>
                        <p><strong>Departure:</strong> ${departure}</p>
                        <p><strong>Arrival:</strong>  ${destination}</p>
                        <p><strong>Date:</strong> ${travelDate}</p>
                        <p>Thank you for choosing TravelMate. We wish you a pleasant journey!</p>
                    </div>

                    <!-- Footer -->
                    <div class="footer">
                        <p>&copy; 2024 TravelMate. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject: 'Your Flight Booking Confirmation',
            html: htmlTemplate,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Flight booking confirmation email sent successfully.' });
    } catch (error) {
        console.error('Error sending flight booking confirmation email:', error);
        res.status(500).json({ message: 'Failed to send flight booking confirmation email.', error });
    }
};

// Handler for web check-in email
const sendCheckInEmail = async (req, res) => {
    try {
        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_HOST,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const { to, pnr, seatNumber, checkInDate, passengerName, flightNumber, departure, destination, departureTime, arrivalTime, gateNumber } = req.body;

        // HTML template for the email
        const htmlTemplate = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Web Check-In Confirmation</title>
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
                        <h1>Web Check-In Confirmation</h1>
                    </div>

                    <!-- Content -->
                    <div class="content">
                        <h2>Dear Customer,</h2>
                        <p>Your web check-in has been completed successfully!</p>
                        <p><strong>PNR:</strong> ${pnr}</p>
                        <p><strong>Check-In Date:</strong> ${checkInDate}</p>
                        <p><strong>Seat Number:</strong> ${seatNumber}</p>
                        <p>Thank you for flying with us. Attached is your boarding pass.</p>
                    </div>

                    <!-- Footer -->
                    <div class="footer">
                        <p>&copy; 2024 TravelMate. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        // Generate the PDF
        // const pdfPath = generateBoardingPass(pnr, checkInDate, seatNumber);
        // const pdfPath = generateBoardingPass(pnr, passengerName, flightNumber, departure, destination, departureTime, arrivalTime, seatNumber, gateNumber, checkInDate);
        const filePath = path.join(__dirname, '../public/img/boarding-pass.png');
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: to,
            subject: 'Your Web Check-In is Successful - Boarding Pass Attached',
            html: htmlTemplate,
            // attachments: [
            //     {
            //         filename: 'BoardingPass.pdf',
            //         path: filePath, // Path to the dynamically generated PDF
            //         contentType: 'application/pdf',
            //     }
            // ],
            attachments: [
                {
                    filename: 'boarding-pass.png', // The name of the file as it will appear in the email
                    path: filePath, // Path to the PNG image
                    contentType: 'image/png' // MIME type for PNG
                }
            ]
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Check-in email sent with boarding pass attachment.' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Failed to send email.', error });
    }
};

// Handler for raised complaint email
const sendComplaintEmail = async (req, res) => {
    try {
        const transporter = createTransporter();
        const { to, ticketNumber, issueDescription, raisedDate, category } = req.body;

        const htmlTemplate = `
                <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Complaint Raised Confirmation</title>
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
                <h1>Complaint Raised Confirmation</h1>
            </div>

            <!-- Content -->
            <div class="content">
                <h2>Dear Customer,</h2>
                <p>Your complaint has been raised successfully. We will get back to you shortly.</p>
                <p><strong>Complaint Number:</strong> ${ticketNumber}</p>
                <p><strong>Complaint Category:</strong> ${category}</p>
                <p><strong>Issue Description:</strong> ${issueDescription}</p>
                <p><strong>Raised Date:</strong> ${raisedDate}</p>
                <p>Thank you for bringing this to our attention. We value your feedback!</p>
            </div>

            <!-- Footer -->
            <div class="footer">
                <p>&copy; 2024 TravelMate. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
        `;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject: 'Complaint Raised Confirmation',
            html: htmlTemplate,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Complaint raised email sent successfully.' });
    } catch (error) {
        console.error('Error sending complaint raised email:', error);
        res.status(500).json({ message: 'Failed to send complaint raised email.', error });
    }
};

module.exports = { sendEmail, sendCheckInEmail, sendComplaintEmail };
