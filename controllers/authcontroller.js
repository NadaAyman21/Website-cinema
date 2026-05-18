const User = require('../models/User');
const bcrypt = require('bcryptjs');

// SIGNUP
exports.signupPost = async (req, res) => {
  const { firstName, lastName, email, password, gender, phone, dob } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ firstName, lastName, email, password: hashed, gender, phone, dob });
    await user.save();

    res.status(201).json({ success: true, message: 'Account created successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Something went wrong. Try again.' });
  }
};

// LOGIN
exports.loginPost = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'No account found with this email.' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ success: false, message: 'Incorrect password.' });
    }

    req.session.userId = user._id;
req.session.userName = user.firstName;
req.session.save(() => {
    res.status(200).json({ success: true, message: 'Login successful!' });
});
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Something went wrong. Try again.' });
  }
};