const express = require('express');
const router =  express.Router();
const passport =  require('passport');
const _ = require('lodash');

const User = require('./../models/User');
const sendConfirmEmail = require('./../ultis/mailer').sendConfirmEmail;
const common = require('../ultis/common');

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
            sendConfirmEmail(user);
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

module.exports = router;
