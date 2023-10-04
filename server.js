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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const sentEmails = [];

// Route handling
app.get('/', (req, res) => {
  res.send('Selamat datang di API Belajar Portofolio BE.');
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
          message: 'Ada kesalahan dalam mengirim email!'
        });
      } else {
        const sentEmail = {
          name: name,
          from: from,
          subject: subject,
          message: message
        };
        sentEmails.push(sentEmail);
        res.send({ message: 'Email berhasil dikirim!' });
      }
    });
  });
  
  // Route untuk melihat data email yang telah dikirim
  app.get('/api/email', (req, res) => {
    res.json(sentEmails);
  });
  
  app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
  });   