// api/utils/email.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

exports.sendVerificationEmail = (user, token) => {
    const url = `${process.env.CLIENT_URL}/verify/${token}`;
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Verify your email address',
        html: `<p>Hello ${user.name},</p>
               <p>Please verify your email by clicking the link below:</p>
               <a href="${url}">Verify Email</a>
               <p>This link will expire in 24 hours.</p>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Verification email sent:', info.response);
        }
    });
};
