const User = require('../models/User');
const OTP = require('../models/OTP');
const jwt = require('jsonwebtoken');
const { generateOTP, sendOTPEmail, sendResetOTPEmail } = require('../utils/email');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new user (sends OTP email)
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    // Check if user already exists and is verified
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    // If unverified user exists, delete so they can re-register
    if (existingUser && !existingUser.isVerified) {
      await User.deleteOne({ email });
    }

    // Create user (unverified)
    const user = await User.create({ 
      name, 
      email, 
      phone, 
      password, 
      role: role || 'farmer',
      isVerified: false 
    });

    // Generate and save OTP
    const otp = generateOTP();
    await OTP.deleteMany({ email }); // Clear any previous OTPs
    await OTP.create({ email, otp });

    // Send OTP email
    await sendOTPEmail(email, otp, name);

    res.status(201).json({
      message: 'Registration successful! Please check your email for the verification code.',
      email: user.email,
      name: user.name,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Please provide email and OTP' });
    }

    // Find OTP record
    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired verification code' });
    }

    // Mark user as verified
    const user = await User.findOneAndUpdate(
      { email },
      { isVerified: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Clean up OTP
    await OTP.deleteMany({ email });

    res.json({
      message: 'Email verified successfully! You can now sign in.',
      verified: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No account found with this email' });
    }
    if (user.isVerified) {
      return res.status(400).json({ message: 'This email is already verified' });
    }

    // Generate new OTP
    const otp = generateOTP();
    await OTP.deleteMany({ email });
    await OTP.create({ email, otp });

    await sendOTPEmail(email, otp, user.name);

    res.json({ message: 'A new verification code has been sent to your email' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: 'Please verify your email before signing in', needsVerification: true, email: user.email });
    }

    if (await user.matchPassword(password)) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        farmLocation: user.farmLocation,
        language: user.language,
        units: user.units,
        role: user.role,
        notifications: user.notifications,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.phone = req.body.phone || user.phone;
      user.farmLocation = req.body.farmLocation || user.farmLocation;
      if (req.body.password) {
        user.password = req.body.password;
      }
      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        farmLocation: updatedUser.farmLocation,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Forgot Password (sends OTP)
// @route   POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Please provide an email address' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No account found with this email' });
    }

    // Generate and save OTP
    const otp = generateOTP();
    await OTP.deleteMany({ email });
    await OTP.create({ email, otp });

    // Send Reset OTP email
    await sendResetOTPEmail(email, otp, user.name);

    res.json({ message: 'A password reset code has been sent to your email' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password
const resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    if (!email || !otp || !password) {
      return res.status(400).json({ message: 'Please provide email, OTP, and new password' });
    }

    // Verify OTP
    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired reset code' });
    }

    // Find and update user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.password = password; // Will be hashed by pre-save hook
    await user.save();

    // Clean up OTP
    await OTP.deleteMany({ email });

    res.json({ message: 'Password reset successful! You can now sign in with your new password.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  registerUser, 
  verifyOTP, 
  resendOTP, 
  loginUser, 
  getUserProfile, 
  updateUserProfile,
  forgotPassword,
  resetPassword
};
