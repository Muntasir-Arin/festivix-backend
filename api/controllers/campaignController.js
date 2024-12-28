const Campaign = require('../models/campaign');
const nodemailer = require('nodemailer');

// Create a new campaign
exports.createCampaign = async (req, res) => {
  try {
    const { eventId, title, description, emailList, coupon } = req.body;

    // Basic validation to ensure the required fields are present
    if (!eventId || !title || !emailList || emailList.length === 0) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Save campaign to the database
    const campaign = await Campaign.create({ eventId, title, description, emailList, coupon });

    // Setup email transporter
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // or another email service like 'Mailgun', 'SendGrid'
      auth: {
        user: process.env.EMAIL_USER, // Add your email here
        pass: process.env.EMAIL_PASSWORD, // Add your email password here
      },
    });

    // Prepare the email sending process
    const emailPromises = emailList.map((email) => {
      return transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: `Promotional Campaign: ${title}`,
        text: description,
      });
    });

    // Send all emails concurrently
    await Promise.all(emailPromises);

    // Respond with success
    res.status(201).json({ success: true, data: campaign });

  } catch (error) {
    console.error('Error in creating campaign or sending emails:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
