require('dotenv').config();
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
        from: `"Muntasir" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: 'Verify your email address',
        html: `
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Email Verification</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f6f9fc; color: #333333;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100%; background-color: #f6f9fc;">
                    <tr>
                        <td align="center" style="padding: 40px 0;">
                            <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
                                <!-- Header -->
                                <!--<tr>-->
                                <!--    <td align="center" style="padding: 40px 0;">-->
                                <!--        <img src="https://placeholder.com/wp-content/uploads/2018/10/placeholder.com-logo1.png" alt="Logo" width="150" style="display: block; margin: 0 auto;">-->
                                <!--    </td>-->
                                <!--</tr>-->
                                <!-- Welcome Message -->
                                <tr>
                                    <td align="center" style="padding: 70px 40px 30px 40px;">
                                        <h1 style="color: #3498db; font-size: 28px; margin: 0;">Welcome ${user.username}!</h1>
                                    </td>
                                </tr>
                                <!-- Main Content -->
                                <tr>
                                    <td style="padding: 0 40px;">
                                        <p style="font-size: 16px; line-height: 24px; margin: 0 0 20px 0; text-align: center;">
                                            We're excited to have you on board. To get started, please verify your email address by clicking the button below:
                                        </p>
                                    </td>
                                </tr>
                                <!-- Button -->
                                <tr>
                                    <td align="center" style="padding: 20px 0 40px 0;">
                                        <a href="${url}" style="background-color: #3498db; border-radius: 50px; color: #ffffff; display: inline-block; font-size: 16px; font-weight: bold; line-height: 50px; text-align: center; text-decoration: none; width: 200px; -webkit-text-size-adjust: none;">Verify Email</a>
                                    </td>
                                </tr>
                                <!-- Additional Info -->
                                <tr>
                                    <td style="padding: 0 40px;">
                                        <p style="font-size: 14px; line-height: 20px; margin: 0 0 20px 0; text-align: center; color: #666666;">
                                            This link will expire in 24 hours. If you did not request this, you can safely ignore this email.
                                        </p>
                                    </td>
                                </tr>
                                <!-- Footer -->
                                <tr>
                                    <td style="padding: 30px 40px; background-color: #f8f8f8; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
                                        <p style="font-size: 14px; line-height: 20px; margin: 0; text-align: center; color: #666666;">
                                            Thank you for joining us!<br>
                                            Best regards,<br>
                                            Md. Mahim Muntasir Arin
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Verification email sent:', info.response);
        }
    });
};
