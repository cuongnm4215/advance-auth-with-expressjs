const express = require('express');
const router =  express.Router();
const passport =  require('passport');
const jwt = require('jsonwebtoken');
const url = require('url');
const querystring = require('querystring');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');

const User = require('./../models/User');
const mailer = require('./../ultis/mailer');
const common = require('../ultis/common');
const pubkey = fs.readFileSync(path.join(__dirname, './../../keys/jwtRS256.key.pub'));

require('./../config/passport')(passport);

router.get('/login', (req, res) => {
    res.render('login', { title: 'Login' });
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
}));

router.get('/logout', function (req, res) {
    req.logout();
    return res.redirect('/');
});

router.get('/register', (req, res) => {
    res.render('register', { title: 'Register' });
});

router.post('/register', function (req, res) {
    const credentials = req.body;
    const { username, email, password, confirm } = credentials;

    if (!username || !email || !password || !confirm) {
        req.flash('error', 'Please fill in all fields');
        return res.redirect('/users/register');
    }

    if (password !== confirm) {
        req.flash('error', 'Password do not match');
        return res.redirect('/users/register');
    }

    const user = new User({ username, email });
    user.setPassword(password);
    user.setActiveToken();
    user.save()
        .then((user) => {
            mailer.sendConfirmEmail(user);
            req.flash('success', 'Register successfully. Please check email to active your account');
            return res.redirect('/users/login');
        })
        .catch((err) => {
            const error = common.parseErrors(err.errors);
            _.forEach(error, function(val) {
                req.flash('error', val);
            });
            return res.redirect('/users/register');
        });
});

router.get('/confirm', function (req, res) {
    const token = req.query.token;
    if (!!token) {
        User.findOneAndUpdate({ confirm_token: token }, { confirmed: true, confirm_token: '' })
            .then((user) => {
                if (!!user) {
                    req.flash('success', 'Active account successfully');
                    return res.redirect('/users/login');
                }
                req.flash('error', 'Invalid token');
                return res.redirect('/users/login');

            })
            .catch(() => {
                req.flash('error', 'An error occurred. Please try again');
                return res.redirect('/users/login');
            })
    }
});

router.get('/forget', function(req, res) {
    res.render('forget', { title: 'Forget Password' });
});

router.post('/forget', function(req, res) {
    const email = req.body.email;

    if (!!email) {
        User.findOne({ email: email }).then((user) => {
            if (!!user) {
                mailer.sendResetPasswordEmail(user);
                req.flash('success', 'Please check your email to reset password');
                return res.redirect('/users/login');
            } else {
                req.flash('error', 'Invalid email address');
                return res.redirect('/users/forget');
            }
        })
    } else {
        req.flash('error', 'Invalid email address');
        return res.redirect('/users/forget');
    }
});

router.get('/reset', function(req, res) {
    const token = req.query.token;
    if (!!token) {
        const decoded = jwt.decode(token);
        if (!!decoded.email) {
            return res.render('reset', { token, email: decoded.email, title: 'Reset Password' });
        } else {
            req.flash('error', 'Invalid token');
            return res.redirect('/users/forget');
        }
    }
    req.flash('error', 'No token provided');
    return res.redirect('/users/forget');
});

router.post('/reset', function(req, res) {
    const { token, password, confirm } = req.body;
    console.log(token);

    if (!password || !confirm) {
        req.flash('error', 'Please fill in all fields');
        return res.redirect(`/users/reset?token=${token}`);
    }

    if (password !== confirm) {
        req.flash('error', 'Password do not match');
        return res.redirect(`/users/reset?token=${token}`);
    }
    if (!!token) {
        jwt.verify(token, pubkey, function (err, decoded) {
            if (err) {
                req.flash('error', 'Invalid token');
                return res.redirect('/users/login');
            }
            if (!!decoded.email) {
                User.findOne({ email: decoded.email })
                    .then((user) => {
                        user.setPassword(password);
                        user.save()
                            .then(() => {
                                req.flash('success', 'Reset password successfully');
                                return res.redirect('/users/login');
                            })
                            .catch(() => {
                                req.flash('error', 'An error occurred. Please try again');
                                return res.redirect(`/users/reset?token=${token}`);
                            })
                    })
            }
        })
    } else {
        req.flash('error', 'No token provided');
        return res.redirect('/users/login');
    }
});

module.exports = router;
