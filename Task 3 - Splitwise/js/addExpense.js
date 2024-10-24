let users = JSON.parse(localStorage.getItem("users")) || [];

// --------- Add users to the <option> ---------
const optionElement = document.getElementById("user");
function showUserDOM() {
    let userHTML = '';

    users.forEach((user) => {
        userHTML += `<option id="${user.username}" value="${user.username}">${user.username}</option>`;
    });

    optionElement.innerHTML = userHTML;
}

showUserDOM();

let usernameElement = document.getElementById("user");
let amountElement = document.getElementById("amount");
let titleElement = document.getElementById("title");

document.querySelector('form').addEventListener('submit', function(event) {
    
    let username = usernameElement.value;
    let amount = parseFloat(amountElement.value);
    let title = titleElement.value;
    let paymentDate = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });

    let payment = {
        username: username,
        amount: amount,
        title: title,
        date: paymentDate
    };

    // --------- Detailed history of individual payments ---------
    let paymentsHistory = JSON.parse(localStorage.getItem("paymentsHistory")) || [];
    paymentsHistory.push(payment);  // Save individual payment to history
    localStorage.setItem("paymentsHistory", JSON.stringify(paymentsHistory));

    // --------- Summing up total payments by user ---------
    let paymentsSummary = JSON.parse(localStorage.getItem("paymentsSummary")) || [];
    
    // Search if there is already a record of cumulative payments for this user
    let existingPayment = paymentsSummary.find(p => p.username === username);

    if (existingPayment) {
        existingPayment.amount += amount;
    } else {
        paymentsSummary.push({
            username: username,
            amount: amount,
            date: paymentDate 
        });
    }

    // Save the payment summary to localStorage
    localStorage.setItem("paymentsSummary", JSON.stringify(paymentsSummary));

    console.log("Payment history:", paymentsHistory);
    console.log("Cumulative payment summary:", paymentsSummary);
});




