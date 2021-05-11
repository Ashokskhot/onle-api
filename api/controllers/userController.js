'use strict';

var mongoose = require('mongoose'),
  jwt = require('jsonwebtoken'),
  bcrypt = require('bcryptjs'),
  User = mongoose.model('User'),
  path = require('path'),
  async = require('async'),
  crypto = require('crypto'),
  _ = require('lodash'),
  hbs = require('nodemailer-express-handlebars'),
  email = process.env.MAILER_EMAIL_ID || 'ajithjbdvt@gmail.com',
  pass = process.env.MAILER_PASSWORD || 'Silvermoon@123',
  nodemailer = require('nodemailer');


var smtpTransport = nodemailer.createTransport({
  service: process.env.MAILER_SERVICE_PROVIDER || 'Gmail',
  auth: {
    user: email,
    pass: pass
  }
});


// var handlebarsOptions = {
//   viewEngine: 'handlebars',
//   partialsDir: './api/templates/',
//   viewPath: path.resolve('./api/templates/'),
//   extName: '.html'
// };

const handlebarsOptions = {
  viewEngine: {
    extName: '.html',
    partialsDir: path.resolve('./api/templates/'),
    layoutsDir: path.resolve('./api/templates/'),
  },
  viewPath: path.resolve('./api/templates/'),
  extName: '.html',
};

smtpTransport.use('compile', hbs(handlebarsOptions));


exports.register = function(req, res) {
  var newUser = new User(req.body);
  newUser.hash_password = bcrypt.hashSync(req.body.password, 10);
  newUser.save(function(err, user) {
    if (err) {
      return res.status(400).send({
        message: err
      });
    } else {
      user.hash_password = undefined;
      return res.json(user);
    }
  });
};

exports.index = function(req, res) {
  return res.sendFile(path.resolve('./public/home.html'));
};

exports.render_forgot_password_template = function(req, res) {
  return res.sendFile(path.resolve('./public/forgot-password.html'));
};

exports.render_reset_password_template = function(req, res) {
  return res.sendFile(path.resolve('./public/reset-password.html'));
};

exports.sign_in = function(req, res) {
  User.findOne({
    email: req.body.email,
    role: req.body.role
  }, function(err, user) {
    if (err) throw err;
    if (!user || !user.comparePassword(req.body.password)) {
      return res.status(401).json({ message: 'Authentication failed. Invalid user or password.' });
    }
    return res.json({id: user._id, email: user.email, fullName: user.fullName, class_name: user.class_name, section_name: user.section_name, token: jwt.sign({ email: user.email, fullName: user.fullName, _id: user._id }, 'OnLeBaCkEnD') });
  });
};

exports.updateById = function(req, res, next) {
  User.findByIdAndUpdate(req.body.id,{email: req.body.email, fullName: req.body.fullName, class_name:req.body.class_name, section_name: req.body.section_name}, function(err, classNameInfo){

    if(err)
      next(err);
    else {
      res.json({status:"success", message: "Class updated successfully!!!", data:null});
    }
  });
};

exports.student_sign_in = function(req, res) {
  User.findOne({
    email: req.body.email,
    role: 'Student'
  }, function(err, user) {
    if (err) throw err;
    if (!user || !user.comparePassword(req.body.password)) {
      return res.status(401).json({ message: 'Authentication failed. Invalid user or password.' });
    }
    return res.json({email: user.email, fullName: user.fullName, class_name: user.class_name, section_name: user.section_name, token: jwt.sign({ email: user.email, fullName: user.fullName, _id: user._id }, 'OnLeBaCkEnD') });
  });
};

exports.loginRequired = function(req, res, next) {
  if (req.user) {
    next();
  } else {
    return res.status(401).json({ message: 'Unauthorized user!' });
  }
};

exports.forgot_password = function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({
        email: req.body.email
      }).exec(function(err, user) {
        if (user) {
          done(err, user);
        } else {
          done('User not found.');
        }
      });
    },
    function(user, done) {
      // create the random token
      crypto.randomBytes(20, function(err, buffer) {
        var token = buffer.toString('hex');
        done(err, user, token);
      });
    },
    function(user, token, done) {
      User.findByIdAndUpdate({ _id: user._id }, { reset_password_token: token, reset_password_expires: Date.now() + 86400000 }, { upsert: true, new: true }).exec(function(err, new_user) {
        done(err, token, new_user);
      });
    },
    function(token, user, done) {
      var data = {
        to: user.email,
        from: email,
        template: 'forgot-password-email',
        subject: 'Password help has arrived!',
        context: {
          url: 'http://localhost:3000/auth/reset_password?token=' + token,
          name: user.fullName.split(' ')[0]
        }
      };

      smtpTransport.sendMail(data, function(err) {
        if (!err) {
          return res.json({ message: 'Kindly check your email for further instructions' });
        } else {
          return done(err);
        }
      });
    }
  ], function(err) {
    return res.status(422).json({ message: err });
  });
};

/**
 * Reset password
 */
exports.reset_password = function(req, res, next) {
  User.findOne({
    reset_password_token: req.body.token,
    reset_password_expires: {
      $gt: Date.now()
    }
  }).exec(function(err, user) {
    if (!err && user) {
      if (req.body.newPassword === req.body.verifyPassword) {
        user.hash_password = bcrypt.hashSync(req.body.newPassword, 10);
        user.reset_password_token = undefined;
        user.reset_password_expires = undefined;
        user.save(function(err) {
          if (err) {
            return res.status(422).send({
              message: err
            });
          } else {
            var data = {
              to: user.email,
              from: email,
              template: 'reset-password-email',
              subject: 'Password Reset Confirmation',
              context: {
                name: user.fullName.split(' ')[0]
              }
            };

            smtpTransport.sendMail(data, function(err) {
              if (!err) {
                return res.json({ message: 'Password reset' });
              } else {
                return done(err);
              }
            });
          }
        });
      } else {
        return res.status(422).send({
          message: 'Passwords do not match'
        });
      }
    } else {
      return res.status(400).send({
        message: 'Password reset token is invalid or has expired.'
      });
    }
  });
};
