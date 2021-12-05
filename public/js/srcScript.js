document.addEventListener('DOMContentLoaded', (event) => {

    //__________|__________| LogIn Form Toggle |__________|__________\\
    document.getElementById("login").onclick = function () {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }
        fetch('/login_account', options)
            .then((res) => res.text())
            .then((data) => {
                let fetch_obj = JSON.parse(data);
                if (fetch_obj[0].msg == "Authorized") {
                    document.getElementById("login-drop-down-menu").classList.toggle("popup");
                } else if (fetch_obj[0].msg == "Unauthorized") {
                    document.getElementById("login-form").classList.toggle("popup");
                } else { console.log(fetch_obj[0].msg) }
            })
            .catch((error) => { console.error(error); });
    };

    //__________|__________| Login Submit |__________|__________\\
    document.getElementById("login-submit-btn").onclick = function () {
        document.getElementById("login-form-check-statement").innerHTML = "";
        login_email = document.getElementById("login-email").value;
        login_password = document.getElementById("login-password").value;
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'login_email': `${login_email}`,
                'login_password': `${login_password}`
            })
        }
        fetch('/login', options)
            .then((res) => res.text())
            .then((data) => {
                let fetch_obj = JSON.parse(data);
                if (fetch_obj[0].msg == "LogIn Successful") {
                    document.getElementById("snackbar").innerText = "LogIn Successful";
                    document.getElementById("snackbar").className = "show-toast";
                    setTimeout(() => {
                        document.getElementById("snackbar").className = document.getElementById("snackbar").className.replace("show-toast", "");
                    },
                        3000
                    );
                    if (document.getElementById("login-form").classList.contains("popup"))
                        document.getElementById("login-form").classList.remove("popup");
                } else if (fetch_obj[0].msg == "Password Doesn't Match") {
                    document.getElementById("login-form-check-statement").innerHTML = "'! Wrong Password !'.\nPlease check your password to continue.";
                    document.getElementById("login-form-check-statement").style.color = "#911616";
                } else if (fetch_obj[0].msg == "Email Doesn't Exist") {
                    document.getElementById("login-form-check-statement").innerHTML = `We couldn't find any account with Email ID (${login_email}).\nPlease check the Email entered or Register`;
                    document.getElementById("login-form-check-statement").style.color = "#1577c7";
                } else if (fetch_obj[0].msg == "Invalid value") {
                    document.getElementById("login-form-check-statement").innerHTML = `Please check the form`;
                    document.getElementById("login-form-check-statement").style.color = "#dbd82c";
                } else { console.log(fetch_obj[0].msg) }
            })
            .catch((error) => { console.error(error); });
    };

    //__________|__________| Registration Email Validation |__________|__________\\
    document.getElementById("registration-email").onfocus = function () {
        this.placeholder = "";
        this.addEventListener("keyup", function () {
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 'registration_email_entered': `${this.value}` })
            };

            fetch('/check_registration_email_entered', options)
                .then((res) => res.text())
                .then((data) => {
                    let fetch_obj = JSON.parse(data);
                    if (fetch_obj[0].msg == 'Valid value') {
                        if (!document.getElementById("registration-email-check").classList.contains("fa-check-circle"))
                            document.getElementById("registration-email-check").classList.add("fa-check-circle");
                        if (document.getElementById("registration-email-check").classList.contains("fa-times-circle"))
                            document.getElementById("registration-email-check").classList.remove("fa-times-circle");
                        document.getElementById("email-strength-check").innerHTML = "";
                        enableDisableRSB();
                    } else if (fetch_obj[0].msg == 'Email Already Exists') {
                        if (document.getElementById("registration-email-check").classList.contains("fa-check-circle"))
                            document.getElementById("registration-email-check").classList.remove("fa-check-circle");
                        if (!document.getElementById("registration-email-check").classList.contains("fa-times-circle"))
                            document.getElementById("registration-email-check").classList.add("fa-times-circle");
                        document.getElementById("email-strength-check").innerHTML = "Email Already Exists";
                        enableDisableRSB();
                    } else if (fetch_obj[0].msg == 'Invalid value') {
                        if (document.getElementById("registration-email-check").classList.contains("fa-check-circle"))
                            document.getElementById("registration-email-check").classList.remove("fa-check-circle");
                        if (!document.getElementById("registration-email-check").classList.contains("fa-times-circle"))
                            document.getElementById("registration-email-check").classList.add("fa-times-circle");
                        document.getElementById("email-strength-check").innerHTML = "";
                        enableDisableRSB();
                    } else {
                        console.log(fetch_obj[0].msg);
                    }
                })
                .catch((error) => { console.error(error); });

        });
    };

    //__________|__________| Registration Password Validation |__________|__________\\
    document.getElementById("registration-password").onfocus = function () {
        this.placeholder = "";
        this.addEventListener("keyup", function () {
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 'registration_password_entered': `${this.value}` })
            };

            fetch('/check_registration_password_entered', options)
                .then((res) => res.text())
                .then((data) => {
                    let fetch_obj = JSON.parse(data);
                    if (fetch_obj[0].msg == 'Valid value') {
                        if (!document.getElementById("password-strength-check").classList.contains("password-strength-good")) {
                            document.getElementById("password-strength-check").classList.add("password-strength-good");
                            document.getElementById("password-strength-check").innerHTML = "Strong Password";
                        }
                        if (document.getElementById("password-strength-check").classList.contains("password-strength-poor"))
                            document.getElementById("password-strength-check").classList.remove("password-strength-poor");
                        enableDisableRSB();
                    }
                    else if (fetch_obj[0].msg == 'Invalid value') {
                        if (document.getElementById("password-strength-check").classList.contains("password-strength-good"))
                            document.getElementById("password-strength-check").classList.remove("password-strength-good");
                        if (!document.getElementById("password-strength-check").classList.contains("password-strength-poor")) {
                            document.getElementById("password-strength-check").classList.add("password-strength-poor");
                            document.getElementById("password-strength-check").innerHTML = "Poor Password";
                        }
                        enableDisableRSB();
                    } else {
                        console.log(fetch_obj[0].msg);
                    }
                })
                .catch((error) => { console.error(error); });

        });
    };

    //__________|__________| Registration Submit Button Enable/Disable |__________|__________\\
    function enableDisableRSB() {
        if (document.getElementById("registration-email-check").classList.contains("fa-check-circle") &&
            document.getElementById("password-strength-check").classList.contains("password-strength-good")) {
            document.getElementById("registration-submit-btn").classList.remove("disabled");
            document.getElementById("registration-submit-btn").disabled = false;

        } else {
            document.getElementById("registration-submit-btn").classList.add("disabled");
            document.getElementById("registration-submit-btn").disabled = true;
        }
    };

    //__________|__________| Registration Submit |__________|__________\\
    document.getElementById("registration-submit-btn").onclick = function () {
        const registration_email = document.getElementById("registration-email").value;
        const registration_password = document.getElementById("registration-password").value;
        const register_options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'registration_email': `${registration_email}`,
                'registration_password': `${registration_password}`
            })
        };

        fetch('/register', register_options)
            .then((res) => res.text())
            .then((data) => {
                let fetch_obj = JSON.parse(data);
                if (fetch_obj[0].msg == "Registration Successful") {
                    document.getElementById("registration-form").classList.remove("popup");
                    document.getElementById("login-form").classList.add("popup");
                    document.getElementById("login-form-check-statement").innerHTML = "Registration was Successful.\nPlease LogIN to continue";
                    document.getElementById("login-form-check-statement").style.color = "#1577c7";
                    //__________| Setting Registration Form |__________\\
                    document.getElementById("registration-email").value = "";
                    document.getElementById("registration-email").placeholder = "email id";
                    document.getElementById("email-strength-check").innerHTML = "";
                    if (document.getElementById("registration-email-check").classList.contains("fa-check-circle"))
                        document.getElementById("registration-email-check").classList.remove("fa-check-circle");
                    if (document.getElementById("registration-email-check").classList.contains("fa-times-circle"))
                        document.getElementById("registration-email-check").classList.remove("fa-times-circle");
                    document.getElementById("registration-password").value = "";
                    document.getElementById("registration-password").placeholder = "password";
                    if (document.getElementById("registration-eye").classList.contains("fa-eye"))
                        document.getElementById("registration-eye").classList.remove("fa-eye");
                    if (!document.getElementById("registration-eye").classList.contains("fa-eye-slash"))
                        document.getElementById("registration-eye").classList.add("fa-eye-slash");
                    document.getElementById("password-strength-check").innerHTML = "Password should contain atleast 6 characters with atleat 1 of each uppercase, lowercase, numbers & special characters";
                    if (document.getElementById("password-strength-check").classList.contains("password-strength-good")) {
                        document.getElementById("password-strength-check").classList.remove("password-strength-good");
                    }
                    if (document.getElementById("password-strength-check").classList.contains("password-strength-poor"))
                        document.getElementById("password-strength-check").classList.remove("password-strength-poor");
                    enableDisableRSB();
                    //__________|__________|__________||__________|__________|__________\\
                } else if (fetch_obj[0].msg == 'Email Already Exists') {
                    if (document.getElementById("registration-email-check").classList.contains("fa-check-circle"))
                        document.getElementById("registration-email-check").classList.remove("fa-check-circle");
                    if (!document.getElementById("registration-email-check").classList.contains("fa-times-circle"))
                        document.getElementById("registration-email-check").classList.add("fa-times-circle");
                    document.getElementById("email-strength-check").innerHTML = "Email Already Exists";
                    enableDisableRSB();
                } else {
                    console.log(fetch_obj[0].msg);
                }
            })
            .catch((error) => { console.error(error); });
    };

});