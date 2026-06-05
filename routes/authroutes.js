const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/signup', authController.signupPost);
router.post('/login', authController.loginPost);
router.post('/updateProfile', authController.updateProfile);
router.post('/changePassword', authController.changePassword);
router.post('/forgotPassword', authController.forgotPassword);
router.post('/resetPassword',  authController.resetPassword);

router.post('/deleteAccount', authController.deleteAccount);
module.exports = router;