let users = JSON.parse(localStorage.getItem("users")) || [];

const userListElement = document.getElementById("userList");

function showUserDOM() {
    if (users.length === 0) {
        console.log("No hay usuarios registrados");
        return;
    }


    let userHTML = '';

    users.forEach((user) => {
        userHTML += `
            <div>
                <img src="../img/${user.iconNumber}.jpg" alt="Icono de ${user.username}">
                <p>User: ${user.username}</p>
            </div>
        `;
    });

    userListElement.innerHTML = userHTML;
}

showUserDOM();
