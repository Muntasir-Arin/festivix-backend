const Campaign = require('../models/Campaign');
const nodemailer = require('nodemailer');

// Create a new campaign
exports.createCampaign = async (req, res) => {
  try {
    const { eventId, title, description, emailList } = req.body;

    // Save campaign to the database
    const campaign = await Campaign.create({ eventId, title, description, emailList });

    // Send emails
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // or another email service
      auth: {
        user: process.env.EMAIL_USER, // Add your email here
        pass: process.env.EMAIL_PASSWORD, // Add your email password here
      },
    });

    const emailPromises = emailList.map((email) => {
      return transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: `Promotional Campaign: ${title}`,
        text: description,
      });
    });

    await Promise.all(emailPromises);

    res.status(201).json({ success: true, data: campaign });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
