const _ = require('lodash');

function parseErrors(errors) {
    let result = {};
    _.forEach(errors, function (val, key) {
        result[key] = val.message;
    });

    return result;
}

module.exports = {
    parseErrors
}
