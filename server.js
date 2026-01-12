const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Setup Email Transporter (Example using Gmail)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'crvarun17@gmail.com',
        pass: 'kimd gkuy sfwd dbrb' // Use a Gmail App Password, not your real password
    }
});

app.post('/send-report', (req, res) => {
    const { score, status, timestamp } = req.body;

    const mailOptions = {
        from: 'crvarun17@gmail.com',
        to: 'varunbharathi.cr.cse.2022@snsct.org',
        subject: `Engagement Report: ${status}`,
        text: `Student Engagement Update:
        Date/Time: ${timestamp}
        Status: ${status}
        Score: ${score}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send(error.toString());
        }
        res.status(200).send('Email sent: ' + info.response);
    });
});

app.listen(3000, () => console.log('Server running on port 3000'));