require('dotenv').config('./.env');
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'userapi@gmail.com',
    pass: 'userpassword'
  }
});

var mailOptions = {
  from: 'userapi@gmail.com',
  to: email,
  subject: 'Email generation',
  text: 'Email generated successfully'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('SUCCESS!!');
  }
});