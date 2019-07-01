const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();

//View engine
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars'); 

//Static Folder
app.use('/public', express.static(path.join(__dirname, 'public')));

//Body Parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.render('contact', {layout: false});
});

app.post('/send', (req,res) => {
    const output=`
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>
        <li>Name: ${req.body.name}</li>
        <li>Company: ${req.body.company}</li>
        <li>Email: ${req.body.email}</li>
        <li>Phone: ${req.body.phone}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
    `;

    let transporter = nodemailer.createTransport({
        host: "mail.traversymedia.com",
        port: 587,
        secure: false,
        auth: {
        user: 'test@traversymedia.com',
        pass: '123abc'
        },
        tls:{
            rejectUnauthorized: false
        }
    });

    let mailOptions = {
        from: '"Nodemailer Contact" <test@traversymedia.com>',
        to: 'Ying.nohyoonho@gmail.com', 
        subject: "Node Contact Request",
        text: "Hello world?", 
        html: output
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error){
            return console.log(error);
        }
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        res.render('contact', {msg:'Email has been sent'});
    });
});

app.listen(3000, () => console.log('Server started...'));
