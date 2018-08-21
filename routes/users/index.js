import { Router } from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

import { User, Token } from '../../models';

const router = new Router();

router.post('/register', (req, res) => {
  const {
    firstName,
    lastName,
    username,
    email,
    password,
    confirmPassword
  } = req.body;
  const fullName = `${firstName} ${lastName}`;
  if (password !== confirmPassword) {
    res.status(400).json({ success: false, message: 'Passwords do not match. Please make sure they match (case-sensitive), and try again.' });
    return;
  }
  const user = User.findOne({ email });
  if(user){
    res.status(400).json({ success: false, message: `User previously registered with this email: ${email}.` });
    return;
  } else {
    const newUser = new User ({
      firstName,
      lastName,
      fullName,
      username,
      password
    })
    let salt = bcrypt.genSalt(10);
    let hash = bcrypt.hash(password, salt);
    newUser.password = hash;
    newUser.save((err) => {
      if (err) {
        res.status(400).json({ success: false, message: 'Unable to save user into database!' });
      }
      const token = new Token ({
        userId: newUser._id,
        token: crypto.randomBytes(16).toString('hex')
      })
      token.save((err) => {
        if(err){
          return res.status(500).json({ success: false, msg: err.message });
        }
        nodemailer.createTestAccount((err, account) => {
          if (err) {
            res.status(400).json({ success: false, message: 'Unable to access email server.' });
            return process.exit(1);
          }
          const { user, pass, smtp } = account;
          const { host, port, secure } = smtp;
          const transporter = nodemailer.createTransport({
            host,
            port,
            secure,
            auth: {
              user,
              pass
            }
          });
          const message = {
            from: 'EkoTraffic <auth@ekotraffic.io>',
            to: `${newUser.fullName} <${newUser.email}>`,
            subject: 'Verify your EkoTraffic account',
            text: `Hello, ${newUser.fullName}, \n\n Please verify your newly created EkoTraffic account by clicking on this link: \nhttp://${req.headers.host}/users/confirmation?token=${token.token}. \n\n If you did not register for EkoTraffic, please kindly disregard this email. \n\n Regards, \nEkoTraffic Team.`
          }
          transporter.sendMail(message, (err, info) => {
            if (err) {
              res.status(400).json({
                success: false,
                message: 'An error occured while trying to send verfication emsil.'
              });
              return process.exit(1);
            }
            res.status(200).json({
              success: true,
              message: 'An link has been sent to your email. Kindly click on it to verify your email.'
            });
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
          });
        });
      });
    })
  }
})

router.post('/login', (req, res) => {
  const { username, password } = req.body;
})

export default router;