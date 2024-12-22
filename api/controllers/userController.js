require('dotenv').config();
const crypto = require('crypto'); // Add this import for creating the hash
const User = require('../models/User');

// Generate Gravatar URL based on email
function getGravatarUrl(email) {
    // Prepare the email for hashing
    const formattedEmail = email.trim().toLowerCase();
    const hash = crypto.createHash('md5').update(formattedEmail).digest('hex');
    // Return the Gravatar URL
    return `https://www.gravatar.com/avatar/${hash}`;
}

// Get user profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password -_id -verificationToken -__v');
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Add Gravatar URL to user profile
        const profilePicture = getGravatarUrl(user.email);
        res.json({ ...user.toObject(), profilePicture });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { username, email, country, twoFactorEnabled } = req.body;

        // Check if the user is trying to update email to one that already exists
        if (email) {
            const existingUser = await User.findOne({ email });
            if (existingUser && existingUser.id !== req.user.id) {
                return res.status(400).json({ message: 'Email already in use' });
            }
        }

        // Update user profile information
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { username, email, country, twoFactorEnabled },
            { new: true, runValidators: true }  // Ensure the updated data is returned and validate inputs
        );

        if (!updatedUser) return res.status(404).json({ message: 'User not found' });
        res.json({ message:'Profile updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Admin-only access example
exports.adminAccess = (req, res) => {
    res.json({ message: 'Admin content accessible only to admins' });
};

exports.getAllUsers = async (req, res) => {
    try {
      // Fetch all users excluding sensitive fields
      const users = await User.find({}, '-password -verificationToken -resetPasswordToken -resetPasswordTokenExpiry -updatedAt');
  
      res.json({ users });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Error fetching users.' });
    }
  };

// Update user role
  exports.updateUserRole = async (req, res) => {
    const { id, action } = req.params;
  
    // Define allowed actions and corresponding roles
    const roleActions = {
      'make-admin': 'Admin',
      'remove-admin': 'Admin',
      'make-moderator': 'Moderator',
      'remove-moderator': 'Moderator',
      'make-manager': 'Manager',
      'remove-manager': 'Manager',
      'activate': 'Activate',
      'delete': 'Delete',
    };
  
    // Validate action
    const role = roleActions[action];
    if (!role) {
      return res.status(400).json({ message: 'Invalid action.' });
    }
  
    try {
      // Find user
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      // Update roles based on the action
      if (action === 'activate') {
        // Activate the user
        user.suspendUntil = null;
        user.status = 'Active';
    } else if (action.startsWith('make-')) {
        if (!user.role.includes(role)) {
          user.role.push(role);
        } else {
          return res.status(400).json({ message: `${role} role already assigned to the user.` });
        }
      } else if (action.startsWith('remove-')) {
        if (user.role.includes(role)) {
          user.role = user.role.filter(r => r !== role);
        } else {
          return res.status(400).json({ message: `${role} role not found for the user.` });
        }
      }
      else if (action === 'delete') {
        // Delete the user
        await User.findByIdAndDelete(id);
        return res.json({ message: 'User successfully deleted.' });}
  
      // Save the updated user
      await user.save();
  
      res.json({ message: `User's role updated successfully.`, roles: user.role });
    } catch (error) {
      console.error('Error updating user role:', error);
      res.status(500).json({ message: 'Error updating user role.' });
    }
  };
  
// Suspend user
exports.suspendUser = async (req, res) => {
    const { id } = req.params; // User ID from the URL
    const { type, reason, suspendUntil } = req.body; // Suspension data from the request body

    if (!type || !reason || (type === 'temporary' && !suspendUntil)) {
        return res.status(400).json({ message: 'Invalid request: Missing required fields.' });
    }

    try {
        // Fetch the user
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        if (type === 'temporary') {
            user.suspendUntil = new Date(suspendUntil); // Set temporary suspension end date
            user.status = 'Temporarily Suspended';
        } else if (type === 'permanent') {
            user.suspendUntil = null; // No end date for permanent suspension
            user.status = 'Permanently Suspended';
        }

        // Add suspension to history
        user.suspendHistory.push({
            suspendedUntil: type === 'temporary' ? new Date(suspendUntil) : null,
            reason,
        });

        await user.save();

        res.status(200).json({ 
            message: `User successfully ${type === 'temporary' ? 'temporarily' : 'permanently'} suspended.`,
            user,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while suspending user.' });
    }
};
