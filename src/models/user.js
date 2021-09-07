const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minLength: [7, 'Password is too small'],
    validate(value) {
      if (value.toLowerCase().includes('password')) {
        throw new Error("Using the word 'PASSWORD' is not allowed");
      }
    },
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Email is invalid!');
      }
    },
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error('Age must be a positive number!');
      }
    },
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner',
});

//define Public Profile Method
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

// define a method to create JWT authentication
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, 'thisismynewcourse');

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

// define a method that searchs by email and verifies the password
userSchema.statics.findByCredentials = async function (email, password) {
  // first try to find the user
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('Unable to login.');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error('Unable to login.');
  }

  return user;
};

// Has the plaintext password before saving
userSchema.pre('save', async function (next) {
  const user = this;

  if (user.isModified('password')) {
    // has password if user has modified password
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

// Delete user tasks when user is removed
userSchema.pre('remove', async function (next) {
  const user = this;

  await Task.deleteMany({ owner: user._id });
  next();
});

// DEFINE USER MODEL
const User = mongoose.model('User', userSchema);

module.exports = User;
