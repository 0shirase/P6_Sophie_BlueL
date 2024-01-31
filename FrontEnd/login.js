document.getElementById("form-login").addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const data = {
        email: email,
        password: password
    };

    /* récupération de l'api de connection */

    fetch('http://localhost:5678/api/users/login', {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Identifiant ou mot de passe incorrect");
            }
        })
        .then(login => {
            if (login.token) {
                sessionStorage.setItem("token", login.token);

                window.location.href = "./index.html";
            } else {
                document.getElementById("erreur-message").innerText = "Erreur lors de la récupération du token";
            }
        })
        .catch(error => {
            console.log(error);
            document.getElementById("erreur-message").innerText = "Identifiant ou mot de passe incorrect";
            document.getElementById("erreur-message").classList.add("error-message");
        })
})
