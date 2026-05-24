const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { 
    type: String, 
    required: [true, 'First name is required'],
    trim: true,
    match: [/^[a-zA-Z]{2,}$/, 'First name must contain only letters and be at least 2 characters long']
  },
  lastName:  { 
    type: String, 
    required: [true, 'Last name is required'],
    trim: true,
    match: [/^[a-zA-Z]{2,}$/, 'Last name must contain only letters and be at least 2 characters long']
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[^ ]+@[^ ]+\.[a-z]{2,3}$/, 'Please enter a valid email address']
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'] 
  },
  gender: { 
    type: String, 
    required: [true, 'Gender is required'],
    enum: ['male', 'female']
  },
  phone: { 
    type: String, 
    required: [true, 'Phone number is required'],
    trim: true,
    validate: {
      validator: function(v) {
        return /^\d{11}$/.test(v);
      },
      message: props => `${props.value} is not a valid 11-digit phone number!`
    }
  },
  dob: { 
    type: String, 
    required: [true, 'Date of birth is required'],
    validate: {
      validator: function(v) {
        const birthDate = new Date(v);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age >= 13;
      },
      message: 'You must be at least 13 years old.'
    }
  },

  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }

});

module.exports = mongoose.model('User', userSchema);