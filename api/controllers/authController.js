require('dotenv').config();
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { generateToken } = require('../config/auth');
const {sendVerificationEmail, sendTwoFactorCode, sendResetPasswordEmail} = require('../utils/email');

const authController = {
    // User registration
    register: async (req, res) => {
        try {
            const { username, email, password, country} = req.body;
            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                console.log(`[REGISTER-400] Registration failed - User already exists: ${email}`);
                return res.status(400).json({ message: 'User already exists' });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create verification token
            const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '24h' });
            // Create and save new user
            const user = await User.create({
                username,
                email,
                country,
                password: hashedPassword,
                role: 'User', // Default role to 'User'
                isVerified: false,
                verificationToken,
            });

            // Send verification email
            sendVerificationEmail(user, verificationToken);

            res.status(201).json({ message: 'User registered, verification email sent' });
            console.log(`[REGISTER-201] User registered and verification email sent: ${email}`);
        } catch (error) {
            console.error(error);
            console.error(`[REGISTER-500] Error registering user: ${error.message}`);
            res.status(500).json({ message: 'Error registering user' });
        }
    },

    // User login
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            // Find user by email
            const user = await User.findOne({ email });
            if (!user) {
                console.log(`[LOGIN-400] Login failed - Invalid credentials: ${email}`);
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            // Check if the user is verified
            if (!user.isVerified) {
                return res.status(401).json({ message: 'Account not verified' });
            }

            // Compare passwords
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                console.log(`[LOGIN-400] Login failed - Invalid credentials for: ${email}`);
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            // Check account status
        if (user.status === 'Temporarily Suspended') {
            if (user.suspendUntil && user.suspendUntil > new Date()) {
                return res.status(403).json({
                    message: `Your account is temporarily suspended until ${user.suspendUntil.toLocaleDateString()}. If you believe this is an error, please contact muntasirarin@gmail.com.`
                });
            } else {
                // Update status to Active if suspension period has passed
                user.status = 'Active';
                user.suspendUntil = null;
                await user.save();
            }
        } else if (user.status === 'Permanently Suspended') {
            return res.status(403).json({
                message: 'Your account has been permanently suspended. If you believe this is an error, please contact muntasirarin@gmail.com.'
            });
        }
        // Check if 2FA is enabled
        if (user.twoFactorEnabled) {
            const twoFactorCode = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit code
            const jwtPayload = {
                email: user.email,
                twoFactorCode,
                exp: Math.floor(Date.now() / 1000) + 300, // JWT expires in 5 minutes
            };

            const twoFactorToken = jwt.sign(jwtPayload, process.env.JWT_SECRET);

            // Send the 2FA code via email
            sendTwoFactorCode(user, twoFactorCode);

            return res.status(200).json({
                message: '2FA required. Please check your email for the verification code.',
                twoFactorToken,
            });
        }
            user.lastLogin = new Date();
            await user.save();

            // Generate token and respond
            const token = generateToken(user._id);
            res.status(200).json({ token, message: 'Login successful' });
            console.log(`[LOGIN-200] Login successful for user: ${email}`);
        } catch (error) {
            console.error(`[LOGIN-500] Error logging in: ${error.message}`);
            res.status(500).json({ message: 'Error logging in' });
        }
    },

    verify2FA: async (req, res) => {
        try {
            const { twoFactorToken, code } = req.body;    
            // Verify the 2FA token
            const payload = jwt.verify(twoFactorToken, process.env.JWT_SECRET);
    
            if (!payload || (String(payload.twoFactorCode) !== String(code))) {
                return res.status(400).json({ message: 'Invalid or expired 2FA code.' });
            }
            // Find the user by email
            const user = await User.findOne({ email: payload.email });
            if (!user) {
                return res.status(400).json({ message: 'User not found.' });
            }
    
            // Mark the user as logged in and update the last login
            user.lastLogin = new Date();
            await user.save();
    
            // Generate the main JWT token for the session
            const token = generateToken(user._id);
    
            return res.status(200).json({ token, message: 'Login successful.' });
        } catch (error) {
            console.error(`[2FA-500] Error verifying 2FA: ${error.message}`);
            res.status(500).json({ message: 'Error verifying 2FA.' });
        }
    },
    

    // Verify user account
    verifyAccount: async (req, res) => {
        try {
            const { token } = req.params;
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Find user by email and update verification status
            const user = await User.findOneAndUpdate(
                { email: decoded.email, verificationToken: token },
                { isVerified: true, verificationToken: null },
                { new: true }
            );

            if (!user) {
                console.log(`[VERIFY-400] Verification failed - Invalid or expired token for: ${decoded.email}`);
                return res.status(400).json({ message: 'Invalid or expired verification token' });
            }

            res.json({ message: 'Account verified successfully' });
            console.log(`[VERIFY-200] Account verified successfully for user: ${decoded.email}`);
        } catch (error) {
            console.error(`[VERIFY-500] Verification failed: ${error.message}`);
            res.status(500).json({ message: 'Verification failed' });
        }
    },

   
    verifyRole: async (req, res) => {
        try {
            // Get the token from the authorization header
            const token = req.headers['authorization']?.split(' ')[1]; // Extract token from "Bearer <token>"
            if (!token) {
                console.log('[VERIFY_ROLE-400] Token missing');
                return res.status(400).json({ message: 'Authorization token missing' });
            }

            // Verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Find user by ID from decoded token
            const user = await User.findById(decoded.id);
            if (!user) {
                console.log(`[VERIFY_ROLE-404] User not found: ${decoded.id}`);
                return res.status(404).json({ message: 'User not found' });
            }

            // Return the user's role
            res.json({ role: user.role });
            console.log(`[VERIFY_ROLE-200] User role retrieved successfully for user: ${decoded.id}`);
        } catch (error) {
            console.error(`[VERIFY_ROLE-500] Error verifying role: ${error.message}`);
            res.status(500).json({ message: 'Server error' });
        }
    },

    requestPasswordReset: async (req, res) => {
        try {
            const { email } = req.body;

            // Find the user by email
            const user = await User.findOne({ email });
            if (!user) {
                console.log(`[RESET-REQUEST-404] Password reset requested for non-existent user: ${email}`);
                return res.status(404).json({ message: 'User not found' });
            }

            // Generate a reset token and expiry
            const resetToken = crypto.randomBytes(32).toString('hex');
            const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // Token valid for 15 minutes

            // Save the reset token and expiry to the user
            user.resetPasswordToken = resetToken;
            user.resetPasswordTokenExpiry = resetTokenExpiry;
            await user.save();

            // Send the reset password email
            sendResetPasswordEmail(user, resetToken);

            res.status(200).json({ message: 'Password reset email sent' });
            console.log(`[RESET-REQUEST-200] Password reset email sent to: ${email}`);
        } catch (error) {
            console.error(`[RESET-REQUEST-500] Error requesting password reset: ${error.message}`);
            res.status(500).json({ message: 'Error requesting password reset' });
        }
    },

    resetPassword: async (req, res) => {
        try {
            const { resetToken, newPassword } = req.body;

            // Find user by reset token and ensure it's not expired
            const user = await User.findOne({
                resetPasswordToken: resetToken,
                resetPasswordTokenExpiry: { $gt: new Date() }, // Ensure token is not expired
            });

            if (!user) {
                console.log(`[RESET-VERIFY-400] Invalid or expired reset token`);
                return res.status(400).json({ message: 'Invalid or expired reset token' });
            }

            // Hash the new password
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            // Update the user's password and clear reset token fields
            user.password = hashedPassword;
            user.resetPasswordToken = null;
            user.resetPasswordTokenExpiry = null;
            await user.save();

            res.status(200).json({ message: 'Password reset successfully' });
            console.log(`[RESET-VERIFY-200] Password reset successfully for user: ${user.email}`);
        } catch (error) {
            console.error(`[RESET-VERIFY-500] Error resetting password: ${error.message}`);
            res.status(500).json({ message: 'Error resetting password' });
        }
    },

};

module.exports = authController;
