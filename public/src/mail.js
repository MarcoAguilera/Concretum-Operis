const nodemailer = require('nodemailer');
const mailGun = require('nodemailer-mailgun-transport');
const express = require('express');

//MailGunner Api for email authentication (Account needed for service)
const auth = {
  auth: {
    api_key: '3c4d934ba96344bd0f499d3907c93ffc-4879ff27-5fdcf4ff',
    domain: 'sandboxf6e54bb0c9454de1aa4ac4d752a0e71e.mailgun.org'
  }
};

const transporter = nodemailer.createTransport(mailGun(auth));

const sendMail = (email, subject, text, options, cb) => {
  const mailOptions = {
    from: '<operis@contact.mailgun.org>',
    to: 'webdevoperis@gmail.com', // Company Email or recipient
    subject: subject,
    html: options,
    text: text
  };

  transporter.sendMail(mailOptions, function(err, data) {
    if (err) {
      console.log("Error");
      cb(err, null);
    }else{
      cb(null, data);
    }
  });
}

module.exports = sendMail;
