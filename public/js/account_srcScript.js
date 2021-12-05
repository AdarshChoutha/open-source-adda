document.addEventListener('DOMContentLoaded', (event) => {

    //__________|__________| LogIn Form Toggle |__________|__________\\
    document.getElementById("login").onclick = function () {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }
        fetch('/login_account', options)
            .then((res) => res.text())
            .then((data) => {
                let fetch_obj = JSON.parse(data);
                if (fetch_obj[0].msg == "Authorized") {
                    if (document.getElementById("login-drop-down-menu").classList.contains("popup"))
                        document.getElementById("login-drop-down-menu").classList.remove("popup");
                    else if (!document.getElementById("login-drop-down-menu").classList.contains("popup"))
                        document.getElementById("login-drop-down-menu").classList.add("popup");
                } else if (fetch_obj[0].msg == "Not Authorized") {
                    if (document.getElementById("login-drop-down-menu").classList.contains("popup"))
                        document.getElementById("login-drop-down-menu").classList.remove("popup")
                    window.location.href = "/";
                } else { console.log(fetch_obj[0].msg) }
            })
            .catch((error) => { console.error(error); });
    };

});