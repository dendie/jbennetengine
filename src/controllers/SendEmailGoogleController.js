const nodemailer = require('nodemailer');
const CONST = require('../constant');

const date = new Date();

// Format the date as "MMMM DD, YY"
const formattedDate = date.toLocaleDateString('en-US', {
    month: 'long',    // Full month name (e.g., "August")
    day: '2-digit',   // Two-digit day (e.g., "20")
    year: '2-digit'   // Two-digit year (e.g., "24")
});
  
// Format the time as "HH:MM AM/PM"
const formattedTime = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true      // 12-hour format with AM/PM
});

async function sendMail (parameters) {
    try {
        // Create a transporter object
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            secure: false,
            logger: true,
            debug: true,
            auth: {
                user: CONST.CONST_EMAIL_NAME, // Replace with your Gmail address
                pass: CONST.CONST_EMAIL_KEY,   // Replace with your App Password
            },
        });

        // Verify SMTP connection
        await transporter.verify();
        console.log('SMTP Server is ready to send emails.');
        
        // Email options
        const mailOptions = {
            from: CONST.CONST_EMAIL_NAME,          // Sender address
            to: parameters.sendTo,     // List of recipients
            subject: 'New message from your website!',         // Subject line
            text: 'This is a plain text email.',   // Plain text body
            html: `<div>
                        <font size="2">
                            <span style="font-size:11pt">
                                <div>
                                    J Bennett Recruiting Team,<br>
                                    <br>
                                    You have received a new message from your website. Please respond in a timely manner.<br>
                                    <br>
                                    Here's the Details of the Inquiry:<br>
                                    <br>
                                    Full Name: ${parameters.name}<br>
                                    Phone: ${parameters.phone}<br>
                                    Email: <a href="mailto:${parameters.email}" rel="noreferrer" target="_blank">${parameters.email}</a><br>
                                    Write Us: ${parameters.message}
                                    <br>
                                    ---<br>
                                    <br>
                                    Date: ${formattedDate}<br>
                                    Time: ${formattedTime}<br>
                                    <br>
                                </div>
                            </span>
                        </font>
                    </div>`,   // HTML body
        };
        
        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return console.error('Error sending email:', error);
          }
          console.log('Email sent:', info.response);
        });
    } catch (err) {
        console.error('Error sending email:', err);
        return false;
    }
}

module.exports = sendMail;