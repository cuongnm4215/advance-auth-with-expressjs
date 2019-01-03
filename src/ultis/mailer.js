const nodemailer = require('nodemailer');
const config = require('./../config/config');

const from = '"Advance Auth ExpressJS" <info@advanceauth.com>';

function setup() {
    return nodemailer.createTransport({
        host: config.MAIL_HOST,
        port: config.MAIL_PORT,
        auth: {
            user: config.MAIL_USER,
            pass: config.MAIL_PASS
        }
    });
}

exports.sendConfirmEmail = function sendConfirmEmail(user) {
    const tranport = setup();
    const email = {
        from,
        to: user.email,
        subject: 'Welcome to Advance Auth System',
        html: `
            <p>Welcome to Advance Auth System. Please, confirm your email.</p>
            <p>This email is valid for 1 hour.</p>

            <a href="${user.generateActiveURL()}">Click here</a>
        `
    };
    tranport.sendMail(email);
}

exports.sendResetPasswordEmail =  function sendResetPasswordEmail(user) {
    const tranport = setup();
    const email = {
        from,
        to: user.email,
        subject: 'Reset Password',
        html: `
            <p>To reset password follow this link.</p>

            <a href="${user.generateResetPasswordUrl()}">Click here</a>
        `
    };
    tranport.sendMail(email);
}
