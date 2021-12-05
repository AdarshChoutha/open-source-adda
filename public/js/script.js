document.addEventListener('DOMContentLoaded', (event) => {

    //__________|__________| Menu Option Toggle |__________|__________\\
    document.getElementById("menu").onclick = function () {
        this.classList.toggle("fa-times");
        document.getElementById("navbar").classList.toggle("nav-toggle");
    };

    //__________|__________| Login Email Validation |__________|__________\\
    document.getElementById("login-email").onfocus = function () {
        this.placeholder = "";
        this.addEventListener("keyup", function () {
            if (this.value == "") {
                document.getElementById("login-form-check-statement").value = "";
            }
            else {
            }
        });
    };
    document.getElementById("login-email").onblur = function () {
        if (this.value == "") {
            this.placeholder = "email id";
            document.getElementById("login-form-check-statement").value = "";
        }
    };

    //__________|__________| LogIn Password Eye Toggle |__________|__________\\
    document.getElementById("login-eye").onclick = function () {
        if (this.classList.contains("fa-eye-slash") && !this.classList.contains("fa-eye")) {
            this.classList.remove("fa-eye-slash");
            this.classList.add("fa-eye");
            document.getElementById("login-password").type = "text";
        } else if (!this.classList.contains("fa-eye-slash") && this.classList.contains("fa-eye")) {
            this.classList.add("fa-eye-slash");
            this.classList.remove("fa-eye");
            document.getElementById("login-password").type = "password";
        }
    };

    //__________|__________| LogIn Form To Registration Form |__________|__________\\
    document.getElementById("open-registration-form").onclick = function () {
        document.getElementById("login-form").classList.remove("popup");
        document.getElementById("registration-form").classList.add("popup");
        if (!document.getElementById("login-eye").classList.contains("fa-eye-slash"))//]
            document.getElementById("login-eye").classList.add("fa-eye-slash");//______|Closing the login-eye of password
        if (document.getElementById("login-eye").classList.contains("fa-eye"))//________|
            document.getElementById("login-eye").classList.remove("fa-eye");//_________]
        document.getElementById("login-password").value = null;//_____Remove Password Text
        document.getElementById("login-password").type = "password";//_____Setting login-form password type
        document.getElementById("login-form-check-statement").innerHTML = "";

    };

    //__________|__________| Close LogIn Form |__________|__________\\
    document.getElementById("close-login-form").onclick = function () {
        document.getElementById("login-form").classList.remove("popup");
        if (!document.getElementById("login-eye").classList.contains("fa-eye-slash"))//]
            document.getElementById("login-eye").classList.add("fa-eye-slash");//______|Closing the login-eye of password
        if (document.getElementById("login-eye").classList.contains("fa-eye"))//_______|
            document.getElementById("login-eye").classList.remove("fa-eye");//_________]
        document.getElementById("login-password").value = null;//_____Remove Login Password Text
        document.getElementById("login-password").type = "password";//_____Setting login-form password type
        if (document.getElementById("login-form-check-statement").innerHTML = "Registration was Successful.\nPlease LogIN to continue")
            document.getElementById("login-form-check-statement").innerHTML = "";
    };

    //__________|__________| Registration Email Validation |__________|__________\\
    document.getElementById("registration-email").onblur = function () {
        if (this.value == "") {
            this.placeholder = "email id";
            document.getElementById("email-strength-check").innerHTML = "";
            if (document.getElementById("registration-email-check").classList.contains("fa-check-circle"))
                document.getElementById("registration-email-check").classList.remove("fa-check-circle");
            if (document.getElementById("registration-email-check").classList.contains("fa-times-circle"))
                document.getElementById("registration-email-check").classList.remove("fa-times-circle");
        }
        enableDisableRSB();
    };

    //__________|__________| Registration Password Validation |__________|__________\\
    document.getElementById("registration-password").onblur = function () {
        if (this.value == "") {
            this.placeholder = "password";
            document.getElementById("password-strength-check").innerHTML = "Password should contain atleast 6 characters with atleat 1 of each uppercase, lowercase, numbers & special characters";
            if (document.getElementById("password-strength-check").classList.contains("password-strength-good")) {
                document.getElementById("password-strength-check").classList.remove("password-strength-good");
            }
            if (document.getElementById("password-strength-check").classList.contains("password-strength-poor"))
                document.getElementById("password-strength-check").classList.remove("password-strength-poor");
        }
        enableDisableRSB();
    };

    //__________|__________| Registration Password Eye Toggle |__________|__________\\
    document.getElementById("registration-eye").onclick = function () {
        if (this.classList.contains("fa-eye-slash") && !this.classList.contains("fa-eye")) {
            this.classList.remove("fa-eye-slash");
            this.classList.add("fa-eye");
            document.getElementById("registration-password").type = "text";
        } else if (!this.classList.contains("fa-eye-slash") && this.classList.contains("fa-eye")) {
            this.classList.add("fa-eye-slash");
            this.classList.remove("fa-eye");
            document.getElementById("registration-password").type = "password";
        }
    };

    //__________|__________| Registration To LogIn Form Form |__________|__________\\
    document.getElementById("open-login-form").onclick = function () {
        document.getElementById("login-form").classList.add("popup");
        document.getElementById("registration-form").classList.remove("popup");
        if (!document.getElementById("registration-eye").classList.contains("fa-eye-slash"))//]
            document.getElementById("registration-eye").classList.add("fa-eye-slash");//______|Closing the registration-eye of password
        if (document.getElementById("registration-eye").classList.contains("fa-eye"))//_______|
            document.getElementById("registration-eye").classList.remove("fa-eye");//_________]
        document.getElementById("registration-password").value = null;//_____Remove Registration Password Text
        document.getElementById("registration-password").type = "password";//_____Setting registration-form password type
        document.getElementById("registration-password").placeholder = "password";
        document.getElementById("password-strength-check").innerHTML = "Password should contain atleast 6 characters with atleat 1 of each uppercase, lowercase, numbers & special characters";
        if (document.getElementById("password-strength-check").classList.contains("password-strength-good")) {
            document.getElementById("password-strength-check").classList.remove("password-strength-good");
        }
        if (document.getElementById("password-strength-check").classList.contains("password-strength-poor"))
            document.getElementById("password-strength-check").classList.remove("password-strength-poor");
        enableDisableRSB();

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
    }

    //__________|__________| Close Registration Form |__________|__________\\
    document.getElementById("close-registration-form").onclick = function () {
        document.getElementById("login-form").classList.remove("popup");
        document.getElementById("registration-form").classList.remove("popup");
        if (!document.getElementById("registration-eye").classList.contains("fa-eye-slash"))//]
            document.getElementById("registration-eye").classList.add("fa-eye-slash");//______|Closing the registration-eye of password
        if (document.getElementById("registration-eye").classList.contains("fa-eye"))//_______|
            document.getElementById("registration-eye").classList.remove("fa-eye");//_________]
        document.getElementById("registration-password").value = null;//_____Remove Registration Password Text
        document.getElementById("registration-password").type = "password";//_____Setting registration-form password type
        document.getElementById("registration-password").placeholder = "password";
        document.getElementById("password-strength-check").innerHTML = "Password should contain atleast 6 characters with atleat 1 of each uppercase, lowercase, numbers & special characters";
        if (document.getElementById("password-strength-check").classList.contains("password-strength-good")) {
            document.getElementById("password-strength-check").classList.remove("password-strength-good");
        }
        if (document.getElementById("password-strength-check").classList.contains("password-strength-poor"))
            document.getElementById("password-strength-check").classList.remove("password-strength-poor");
        enableDisableRSB();
    };

    //__________|__________|__________| On Focus Lost |__________|__________|__________\\
    document.onclick = function (event) {

        //__________|__________| Menu Option Toggle |__________|__________\\
        if (event.target.id !== "menu") {
            if (document.getElementById("menu").classList.contains("fa-times"))
                document.getElementById("menu").classList.remove("fa-times")
            if (document.getElementById("navbar").classList.contains("nav-toggle"))
                document.getElementById("navbar").classList.remove("nav-toggle")
        }

        //_____| Close Login Form |_____\\
        if (event.target.id == "login-form") {
            if (document.getElementById("login-form").classList.contains("popup"))
                document.getElementById("login-form").classList.remove("popup");
            if (!document.getElementById("login-eye").classList.contains("fa-eye-slash"))//]
                document.getElementById("login-eye").classList.add("fa-eye-slash");//______|Closing the login-eye of password
            if (document.getElementById("login-eye").classList.contains("fa-eye"))//_______|
                document.getElementById("login-eye").classList.remove("fa-eye");//_________]
            document.getElementById("login-password").value = null;//_____Remove Login Password Text
            document.getElementById("login-password").type = "password";//_____Setting login-form password type
        }
        //_____| Close Registration Form |_____\\
        if (event.target.id == "registration-form") {
            if (document.getElementById("registration-form").classList.contains("popup"))
                document.getElementById("registration-form").classList.remove("popup");
            if (!document.getElementById("registration-eye").classList.contains("fa-eye-slash"))//]
                document.getElementById("registration-eye").classList.add("fa-eye-slash");//______|Closing the registration-eye of password
            if (document.getElementById("registration-eye").classList.contains("fa-eye"))//_______|
                document.getElementById("registration-eye").classList.remove("fa-eye");//_________]
            document.getElementById("registration-password").value = null;//_____Remove Registration Password Text
            document.getElementById("registration-password").type = "password";//_____Setting registration-form password type
            document.getElementById("registration-password").placeholder = "password";
        }
        //_____| Close Login_Account Options |_____\\
        if (event.target.id !== "open_account_page" || event.target.id !== "logout") {
            if (document.getElementById("login-drop-down-menu").classList.contains("popup"))
                document.getElementById("login-drop-down-menu").classList.remove("popup");
        }

    };

    //__________|__________|__________| Scroll |__________|__________|__________\\
    document.addEventListener('scroll', (event) => {

        //_____| Menu Option Toggle |_____\\
        if (document.getElementById("menu").classList.contains("fa-times"))
            document.getElementById("menu").classList.remove("fa-times");
        //_____| Navigation Bar Toggle |_____\\
        if (document.getElementById("navbar").classList.contains("nav-toggle"))
            document.getElementById("navbar").classList.remove("nav-toggle");
        //_____| LogIn Drop Down Menu Toggle |_____\\
        if (document.getElementById("login-drop-down-menu").classList.contains("popup"))
            document.getElementById("login-drop-down-menu").classList.remove("popup");

        //_____| LogIn Form Toggle |_____\\
        if (document.getElementById("login-form").classList.contains("popup"))
            document.getElementById("login-form").classList.remove("popup");
        //_____| LogIn Eye |_____\\
        if (!document.getElementById("login-eye").classList.contains("fa-eye-slash"))//]
            document.getElementById("login-eye").classList.add("fa-eye-slash");//______|Closing the login-eye of password
        if (document.getElementById("login-eye").classList.contains("fa-eye"))//________|
            document.getElementById("login-eye").classList.remove("fa-eye");//_________]
        //_____| LogIn Password |_____\\
        document.getElementById("login-password").value = null;//_____Remove Password Text
        document.getElementById("login-password").type = "password";//_____Setting login-form password type
        //_____| LogIn Email Check Statement |_____\\
        if (document.getElementById("login-form-check-statement").innerHTML = "Registration was Successful.\nPlease LogIN to continue")
            document.getElementById("login-form-check-statement").innerHTML = "";

        //_____| Registration Form Toggle |_____\\
        if (document.getElementById("registration-form").classList.contains("popup"))
            document.getElementById("registration-form").classList.remove("popup");
        //_____| Registration Eye |_____\\
        if (!document.getElementById("registration-eye").classList.contains("fa-eye-slash"))//]
            document.getElementById("registration-eye").classList.add("fa-eye-slash");//______|Closing the registration-eye of password
        if (document.getElementById("registration-eye").classList.contains("fa-eye"))//_______|
            document.getElementById("registration-eye").classList.remove("fa-eye");//_________]
        //_____| Registration Password |_____\\
        document.getElementById("registration-password").value = null;//_____Remove Registration Password Text
        document.getElementById("registration-password").type = "password";//_____Setting registration-form password type
        document.getElementById("registration-password").placeholder = "password";
        //_____| Registration Password Strength Check |_____\\
        document.getElementById("password-strength-check").innerHTML = "Password should contain atleast 6 characters with atleat 1 of each uppercase, lowercase, numbers & special characters";
        if (document.getElementById("password-strength-check").classList.contains("password-strength-good"))
            document.getElementById("password-strength-check").classList.remove("password-strength-good");
        if (document.getElementById("password-strength-check").classList.contains("password-strength-poor"))
            document.getElementById("password-strength-check").classList.remove("password-strength-poor");
        //_____| Registration Submit Button |_____\\
        enableDisableRSB();

        //_____| Update Section on Scroll |_____\\
        let sections = document.querySelectorAll('section');
        let navbarLists = document.querySelectorAll('header .navbar ul li a');
        let sectionId = home;

        sections.forEach(section => {
            let sectionTop = section.offsetTop;
            let sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop) sectionId = section.getAttribute("id");
        })

        navbarLists.forEach(a => {
            if (a.getAttribute("href") == `#${sectionId}`) a.classList.add("active");
            else a.classList.remove("active");
        })

    });

});