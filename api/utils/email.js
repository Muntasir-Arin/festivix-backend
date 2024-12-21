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
        from: `"Muntasir from FESTiViX" <${process.env.EMAIL_USER}>`,
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

exports.sendTwoFactorCode = (user, twoFactorCode) => {
    const mailOptions = {
        from: `"Muntasir from FESTiViX" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: 'Your Two-Factor Authentication Code',
        html: `
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Two-Factor Authentication Code</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f6f9fc; color: #333333;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100%; background-color: #f6f9fc;">
                    <tr>
                        <td align="center" style="padding: 40px 0;">
                            <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
                                <!-- Header -->
                                <tr>
                                    <td align="center" style="padding: 70px 40px 30px 40px;">
                                        <h1 style="color: #3498db; font-size: 28px; margin: 0;">Hello ${user.username},</h1>
                                    </td>
                                </tr>
                                <!-- Main Content -->
                                <tr>
                                    <td style="padding: 0 40px;">
                                        <p style="font-size: 16px; line-height: 24px; margin: 0 0 20px 0; text-align: center;">
                                            Your Two-Factor Authentication Code is:
                                        </p>
                                    </td>
                                </tr>
                                <!-- Code Display -->
                                <tr>
                                    <td align="center" style="padding: 20px 0;">
                                        <h2 style="font-size: 36px; color: #3498db; margin: 0;">${twoFactorCode}</h2>
                                    </td>
                                </tr>
                                <!-- Additional Info -->
                                <tr>
                                    <td style="padding: 0 40px;">
                                        <p style="font-size: 14px; line-height: 20px; margin: 0 0 20px 0; text-align: center; color: #666666;">
                                            This code is valid for 5 minutes. If you did not request this, please secure your account immediately.
                                        </p>
                                    </td>
                                </tr>
                                <!-- Footer -->
                                <tr>
                                    <td style="padding: 30px 40px; background-color: #f8f8f8; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
                                        <p style="font-size: 14px; line-height: 20px; margin: 0; text-align: center; color: #666666;">
                                            Thank you for using our services!<br>
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


    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.error("Error sending email:", err);
        } else {
            console.log("Email sent:", info.response);
        }
    });
};

exports.sendResetPasswordEmail = (user, resetToken) => {
    const url = `${process.env.CLIENT_URL}/reset-request/${resetToken}`;
    const mailOptions = {
        from: `"Muntasir from FESTiViX" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: 'Reset Your Password',
        html: `
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Reset Password</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f6f9fc; color: #333333;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100%; background-color: #f6f9fc;">
                    <tr>
                        <td align="center" style="padding: 40px 0;">
                            <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
                                <tr>
                                    <td align="center" style="padding: 70px 40px 30px 40px;">
                                        <h1 style="color: #3498db; font-size: 28px; margin: 0;">Reset Your Password</h1>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 0 40px;">
                                        <p style="font-size: 16px; line-height: 24px; margin: 0 0 20px 0; text-align: center;">
                                            You recently requested to reset your password. Click the button below to reset it:
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding: 20px 0 40px 0;">
                                        <a href="${url}" style="background-color: #3498db; border-radius: 50px; color: #ffffff; display: inline-block; font-size: 16px; font-weight: bold; line-height: 50px; text-align: center; text-decoration: none; width: 200px; -webkit-text-size-adjust: none;">Reset Password</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 0 40px;">
                                        <p style="font-size: 14px; line-height: 20px; margin: 0 0 20px 0; text-align: center; color: #666666;">
                                            This link will expire in 24 hours. If you did not request a password reset, please ignore this email.
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 30px 40px; background-color: #f8f8f8; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
                                        <p style="font-size: 14px; line-height: 20px; margin: 0; text-align: center; color: #666666;">
                                            Thank you for using our services!<br>
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

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.error("Error sending email:", err);
        } else {
            console.log("Reset Password email sent:", info.response);
        }
    });
};
