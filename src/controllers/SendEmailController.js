const axios = require('axios');

// const date = new Date().toISOString().slice(0, 19).replace('T', ' ').split(' ');
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

async function sendEmail (parameters) {
    const params = {
        api_key: "api-93D1A03E55FE4E7EB724F5FDDAF5AC56",
        sender: "backend@jbennettrecruiting.com",
        to: ["eva@jbennettrecruiting.com"],
        subject: "New message from your website!",
        html_body: `<div>
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
                    </div>`
    }
    try {
        const response = await axios.post('https://api.smtp2go.com/v3/email/send', params)
        return response.status
    } catch (err) {
        console.error('Error fetching API:', err.message);
    }
}

module.exports = sendEmail;