var nodemailer = require('nodemailer');
var constants  = require('./consts');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: constants.email.username,
        pass: constants.email.password
    }
});




const sendMail = (recipient, subject, txt) => {
    let mailOptions = {
        from: constants.email.username,
        to: recipient,
        subject: subject,
        text: txt
    };
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}
module.exports.sendMail = sendMail;