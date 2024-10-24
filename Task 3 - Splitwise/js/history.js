let users = JSON.parse(localStorage.getItem("users")) || [];
let payments = JSON.parse(localStorage.getItem("paymentsHistory")) || [];

const userListElement = document.querySelector("main");

function showBalancesDOM() {
    if (users.length === 0) {
        console.log("No hay usuarios registrados");
        return;
    }


    let HTML = '';

    users.forEach((users) => {
        payments.forEach((payments) => {
            if(payments.username==users.username){
                HTML += `
                <div>
                    <p>${payments.date}</p>   
                    <img src="./img/${users.iconNumber}.jpg" alt="Icono de ${users.username}">
                    <p>${payments.title}</p>
                    <p>${payments.username} paid ${payments.amount}</p>
                </div>`
                userListElement.innerHTML = HTML;
            }
    });
});


    
} 

showBalancesDOM();