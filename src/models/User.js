const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const UserSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    token: String,
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

const User = mongoose.model('User', UserSchema);

module.exports = User;
