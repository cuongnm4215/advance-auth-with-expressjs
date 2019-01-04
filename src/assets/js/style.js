function loginValidate() {
    $('#login').validate({
        rules: {
            username: 'required',
            password: 'required',
        },
        messages: {
            username: 'Field is required',
            password: 'Field is required',
        },
        errorClass: 'is-invalid',
        validClass: 'is-valid',
    });
}

function registerValidate() {
    $('#register').validate({
        rules: {
            email: {
                required: true,
                email: true
            },
            username: 'required',
            password: 'required',
            confirm: {
                required: true,
                equalTo: '#password'
            }
        },
        messages: {
            email: {
                required: 'Field is required',
                email: 'Invalid email address'
            },
            username: 'Field is required',
            password: 'Field is required',
            confirm: {
                required: 'Field is required',
                equalTo: 'Password do not match'
            }
        },
        errorClass: 'is-invalid',
        validClass: 'is-valid',
    });
}

function forgotValidate() {
    $('#forget').validate({
        rules: {
            email: {
                required: true,
                email: true
            },
        },
        messages: {
            email: {
                required: 'Field is required',
                email: 'Invalid email address'
            },
        },
        errorClass: 'is-invalid',
        validClass: 'is-valid',
    });
}

function resetValidate() {
    $('#reset').validate({
        rules: {
            password: 'required',
            confirm: {
                required: true,
                equalTo: '#password'
            }
        },
        messages: {
            password: 'Field is required',
            confirm: {
                required: 'Field is required',
                equalTo: 'Password do not match'
            }
        },
        errorClass: 'is-invalid',
        validClass: 'is-valid',
    });
}

function parseQueryString() {
    let query = {}, hash;
    let hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');

    for (let i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        query[hash[0]] = hash[1];
    }
    return query;
}

function prepareResetPassword() {
    $('#reset_password').click(function(e) {
        e.preventDefault();
        const query = parseQueryString();
        const { token } = query;
        if (!!token) {
            const input = $("<input>")
                .attr("type", "hidden")
                .attr("name", "token").val(token);
            $('#reset').append(input);
            $('#reset').submit();
        }
    });
}

$(document).ready(function() {
    loginValidate();
    registerValidate();
    forgotValidate();
    resetValidate();
    prepareResetPassword();
});
