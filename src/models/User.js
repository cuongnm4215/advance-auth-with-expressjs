const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const uniqueValidator = require('mongoose-unique-validator');
const fs = require('fs');
const path = require('path');

const config = require('./../config/config');

const cert = fs.readFileSync(path.join(__dirname, '../../keys/jwtRS256.key'));

const UserSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    confirmed: { type: Boolean, default: false },
    confirm_token: { type: String, default: '' },
    remember_token: { type: String, default: '' },
    fullname: String,
    birthday: { type: Date, default: Date.now },
    address: String,
    created_date: { type: Date, default: Date.now },
    updated_date: { type: Date, default: Date.now },
    del_flag: { type: Boolean, default: false }
});

UserSchema.methods.setPassword = function setPassword(password) {
    this.password = bcryptjs.hashSync(password, 10);
}

UserSchema.methods.isValidPassword = function isValidPassword(password) {
    return bcryptjs.compareSync(password, this.password);
}

UserSchema.methods.generateActiveToken = function generateActiveToken() {
    return jwt.sign({
        email: this.email
    }, cert, {algorithm: 'RS256', expiresIn: '1h'});
}

UserSchema.methods.generateResetPasswordToken = function generateResetPasswordToken() {
    return jwt.sign({
        email: this.email
    }, cert, { algorithm: 'RS256', expiresIn: '1h' });
}

UserSchema.methods.setActiveToken = function setActiveToken() {
    this.confirm_token = this.generateActiveToken();
}

UserSchema.methods.setRememberToken = function setRememberToken(token) {
    this.remember_token = token;
}

UserSchema.methods.generateActiveURL = function generateActiveURL() {
    return `${config.HOST}/users/confirm?token=${this.confirm_token}`;
}

UserSchema.methods.generateResetPasswordURL = function generateResetPasswordURL() {
    return `${config.HOST}/users/reset?token=${this.generateResetPasswordToken()}`;
}

UserSchema.plugin(uniqueValidator, { message: 'This {PATH} is already taken' });

const User = mongoose.model('User', UserSchema);

module.exports = User;
