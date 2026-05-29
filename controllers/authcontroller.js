const User = require('../models/User');
const bcrypt = require('bcryptjs');


exports.signupPost = async (req, res) => {
   const { firstName, lastName, email, password, gender, phone, dob } = req.body;
    
    try {
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!password || !password.match(passwordPattern)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Password must be at least 8 characters long and contain 1 uppercase letter, 1 lowercase letter, and 1 number.' 
            });
        }
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
        }

        let assignedRole = 'user';
        if (email && email.toLowerCase().endsWith('@cinex.com')) {
            assignedRole = 'admin';
        }

        const hashed = await bcrypt.hash(password, 10);
        const user = new User({ firstName, lastName, email, password: hashed, gender, phone, dob, role: assignedRole });
        await user.save();

        req.session.userId = user._id;
        req.session.userName = user.firstName;
        const fallbackUrl = user.role === 'admin' ? '/admin' : '/cinemaM';
        const sendRedirectTo = req.session.redirectTo || fallbackUrl;
        delete req.session.redirectTo; 

        req.session.save(() => {
            res.status(201).json({ 
                success: true, 
                message: 'Account created successfully!', 
                role: user.role,
                redirectTo: sendRedirectTo 
            });
        });

    } catch (err) {
        console.error("MongoDB/Validation Error caught:", err);

        if (err.name === 'ValidationError') {
            const firstErrorKey = Object.keys(err.errors)[0];
            const customMessage = err.errors[firstErrorKey].message;
            return res.status(400).json({ success: false, message: customMessage });
        }

        res.status(500).json({ success: false, message: 'Something went wrong. Try again.' });
    }
};

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

const fallbackUrl = user.role === 'admin' ? '/admin' : '/cinemaM';
    const sendRedirectTo = req.session.redirectTo || fallbackUrl;
    delete req.session.redirectTo;
req.session.save(() => {
    res.status(200).json({ 
      success: true, 
      message: 'Login successful!',
      role: user.role ,
      redirectTo: sendRedirectTo
    });
});
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Something went wrong. Try again.' });
  }
};

exports.updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, phone, dob } = req.body;
        await User.findByIdAndUpdate(req.session.userId, {
            firstName, lastName, phone, dob
        });
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.json({ success: false, message: 'Something went wrong.' });
    }
};
exports.changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    try {
        const user = await User.findById(req.session.userId);
        const match = await bcrypt.compare(currentPassword, user.password);
        if (!match) {
            return res.json({ success: false, message: 'Current password is incorrect.' });
        }
        const hashed = await bcrypt.hash(newPassword, 10);
        await User.findByIdAndUpdate(req.session.userId, { password: hashed });
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.json({ success: false, message: 'Something went wrong.' });
    }
};