require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { generateToken } = require('../config/auth');
const sendVerificationEmail = require('../utils/email');

const authController = {
    // User registration
    register: async (req, res) => {
        try {
            const { username, email, password} = req.body;
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
                password: hashedPassword,
                role: 'User', // Default role to 'User'
                isVerified: false,
                verificationToken,
            });

            // Send verification email
            // sendVerificationEmail(email, verificationToken);

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
            // if (!user.isVerified) {
            //     return res.status(401).json({ message: 'Account not verified' });
            // }

            // Compare passwords
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                console.log(`[LOGIN-400] Login failed - Invalid credentials for: ${email}`);
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            // Generate token and respond
            const token = generateToken(user._id);
            res.json({ token, message: 'Login successful' });
            console.log(`[LOGIN-200] Login successful for user: ${email}`);
        } catch (error) {
            console.error(`[LOGIN-500] Error logging in: ${error.message}`);
            res.status(500).json({ message: 'Error logging in' });
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
};

module.exports = authController;
