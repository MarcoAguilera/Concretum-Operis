const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS
  }
});

const sendMail = (email, link) => {
  var mailOptions = {
    from: 'operis@recovery.com',
    to: email,
    subject: 'Operis Password Recovery',
    html: `<h3>Click this link to recover password <i>(Expires in 5 minutes)</i></h3>` + `<div>Link: ${link}</div>`
  };
 
  transporter.sendMail(mailOptions, function(err, info) {
    if(err) {
        console.log(err);
    }
    else {
        console.log('Email sent: ' + info.response);
    }
  });

}

module.exports = sendMail;