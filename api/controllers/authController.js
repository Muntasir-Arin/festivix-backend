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
            console.log('User registered')
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error registering user' });
            console.log('Error registering user')
        }
    },

    // User login
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            // Find user by email
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            // Check if the user is verified
            // if (!user.isVerified) {
            //     return res.status(401).json({ message: 'Account not verified' });
            // }

            // Compare passwords
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            // Generate token and respond
            const token = generateToken(user._id);
            res.json({ token, message: 'Login successful' });
        } catch (error) {
            console.error(error);
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
                return res.status(400).json({ message: 'Invalid or expired verification token' });
            }

            res.json({ message: 'Account verified successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Verification failed' });
        }
    },
};

module.exports = authController;
