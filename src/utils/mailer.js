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

function sendConfirmEmail(user) {
    const tranport = setup();
    const email = {
        from,
        to: user.email,
        subject: 'Advance Auth System | Welcome to Advance Auth System',
        html: `
            <p>Welcome to Advance Auth System. Please, confirm your email.</p>
            <p>This email is valid for 1 hour.</p>

            <a href="${user.generateActiveURL()}">Click here</a>
        `
    };
    tranport.sendMail(email);
}

function sendResetPasswordEmail(user) {
    const tranport = setup();
    const email = {
        from,
        to: user.email,
        subject: 'Advance Auth System | Reset Password',
        html: `
            <p>To reset password follow this link.</p>
            <p>This email is valid for 1 hour.</p>

            <a href="${user.generateResetPasswordURL()}">Click here</a>
        `
    };
    tranport.sendMail(email);
}

module.exports = {
    sendConfirmEmail,
    sendResetPasswordEmail
}
