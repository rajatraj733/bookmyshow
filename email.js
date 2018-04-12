var nodemailer = require('nodemailer');
var constants  = require('./consts');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: constants.email.username,
        pass: constants.email.password
    }
});

var mailOptions = {
    from: constants.email.username,
    to: 'rajatraj733@gmail.com',
    subject: 'Sending Email using Node.js from droplet',
    text: 'That was easy!'
};

transporter.sendMail(mailOptions, function(error, info){
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
});