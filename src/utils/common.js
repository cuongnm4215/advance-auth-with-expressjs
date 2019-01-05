const _ = require('lodash');

function parseErrors(errors) {
    let result = {};
    _.forEach(errors, function (val, key) {
        result[key] = val.message;
    });

    return result;
}

function randomString(len = 32) {
    let result = '';
    const alphabetic = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const length = alphabetic.length;

    for (let i = 0; i < len; i++) {
        result += alphabetic[Math.floor(Math.random() * length)];
    }

    return result;
}

module.exports = {
    parseErrors,
    randomString
}
