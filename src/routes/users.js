const express = require('express');
const router =  express.Router();
const passport =  require('passport');
const User = require('./../models/User');

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
    const { username, password, confirm } = credentials;

    if (!username || !password || !confirm) {
        req.flash('error', 'Please fill in all fields');
        return res.redirect('/users/register');
    }

    if (password !== confirm) {
        req.flash('error', 'Password do not match');
        return res.redirect('/users/register');
    }

    const user = new User({ username });
    user.setPassword(password);
    user.save()
        .then(() => {
            req.flash('success', 'Register successfully');
            return res.redirect('/users/login');
        })
        .catch(() => {
            req.flash('error', 'Already username');
            return res.redirect('/users/register');
        });
});

module.exports = router;
