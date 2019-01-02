$('#register').validate({
    rules: {
        username: 'required',
        password: 'required',
        confirm: {
            required: true,
            equalTo: '#password'
        }
    },
    messages: {
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
