const ManagerApplication = require('../models/ManagerApplication');
const User = require('../models/User');

exports.applyForManager = async (req, res) => {
  try {
    const { applicationReason } = req.body;
    const userId = req.user._id; 
    if (!applicationReason || applicationReason.trim().length === 0) {
        return res.status(400).json({ message: 'Application reason is required' });
      }
    const existingApplication = await ManagerApplication.findOne({ user: userId, applicationStatus: 'Pending' });
    if (existingApplication) {
      return res.status(400).json({ message: 'You already have a pending application.' });
    }
    const newApplication = new ManagerApplication({
      user: userId,
      applicationReason
    });
    await newApplication.save();
    res.status(201).json({ message: 'Application for manager submitted successfully.' });
  } catch (error) {
    console.error('[MANAGER_APPLICATION-500]', error);
    res.status(500).json({ message: 'Error submitting manager application.' });
  }
};

exports.getAllApplications = async (req, res) => {
  try {
    const applications = await ManagerApplication.find()
      .populate('user', 'username email')
      .populate('checkedBy', 'username')
      .sort({ applicationDate: -1 });

    res.json({ applications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching applications.' });
  }
};

exports.reviewApplication = async (req, res) => {
  try {
    const { applicationId, status } = req.body;
    const checkBy = req.user._id;
    const checkDate = Date.now();
    if (!['Approved', 'Declined'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }

    const application = await ManagerApplication.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: 'Application not found.' });
    }
    application.applicationStatus = status;
    application.checkedBy = checkBy;
    application.checkDate = checkDate || Date.now(); 
    await application.save();
    if (status === 'Approved') {
      const user = await User.findById(application.user);
      if (user) {
        user.role.push('Manager');
        await user.save();
      }
    }
    res.json({ message: `Application ${status} successfully.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error reviewing application.' });
  }
};
