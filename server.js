const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mg = require("mailgun-js");
const cors = require("cors");

dotenv.config();

const PORT = process.env.PORT || 5000;

const mailgun = mg({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN
});

// Middleware
app.use(express.static('./'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html'); // Sesuaikan dengan nama file HTML Anda
});

app.post('/api/email', (req, res) => {
  const { name, from, subject, message } = req.body;
  const emailInfo = {
    to: 'putraswastikay@gmail.com',
    name: name,
    from: from,
    subject: subject,
    html: message
  };

  mailgun.messages().send(emailInfo, (error, body) => {
    if (error) {
      console.error(error);
      res.status(500).send({
        message: 'Something went wrong in sending email!'
      });
    } else {
      res.send({ message: 'Email sent successfully!' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
