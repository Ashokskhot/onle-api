'use strict';

var mongoose = require('mongoose'),
  bcrypt = require('bcryptjs'),
  Schema = mongoose.Schema;

/**
 * User Schema
 */
var UserSchema = new Schema({
  fullName: {
    type: String,
    trim: true,
    required: true
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: true
  },
  hash_password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  class_name: {
    type: String,
    trim: true
  },
  section_name: {
    type: String,
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  reset_password_token: {
    type: String
  },
  reset_password_expires: {
    type: Date
  }
});

UserSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.hash_password);
};


mongoose.model('User', UserSchema);
