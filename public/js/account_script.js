document.addEventListener('DOMContentLoaded', (event) => {

    //__________|__________|__________| On Focus Lost |__________|__________|__________\\
    document.onclick = function (event) {

        //_____| Open Login_Account Options |_____\\
        if (event.target.id === "login") {
            if (!document.getElementById("login-drop-down-menu").classList.contains("popup"))
                document.getElementById("login-drop-down-menu").classList.add("popup");
        }

    };

    //__________|__________|__________| Scroll |__________|__________|__________\\
    document.addEventListener('scroll', (event) => {

        //_____| LogIn Drop Down Menu Toggle |_____\\
        if (document.getElementById("login-drop-down-menu").classList.contains("popup"))
            document.getElementById("login-drop-down-menu").classList.remove("popup");

    });

});
