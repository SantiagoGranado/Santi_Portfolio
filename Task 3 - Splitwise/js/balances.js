// Load data from localStorage
let payments = JSON.parse(localStorage.getItem("paymentsSummary")) || [];
let users = JSON.parse(localStorage.getItem("users")) || [];

const userListElement = document.querySelector("main");
const clearPaymentsButton = document.querySelector("button");

function showBalancesDOM() {
    if (users.length === 0) {
        console.log("No users registered");
        return;
    }

    let HTML = '';
    let totalPayments = 0;

    payments.forEach(payment => {
        totalPayments += payment.amount;
    });

    // Calculate the fair share per user (total divided by ALL users)
    const fairSharePerUser = totalPayments / users.length;

    users.forEach((user) => {
        let userPayments = payments.filter(payment => payment.username === user.username);
        
        let pronoun;
        if (user.gender === 'male') {
            pronoun = 'he';
        } else if (user.gender === 'female') {
            pronoun = 'she';
        }

        let userTotalPayments = userPayments.reduce((total, payment) => total + payment.amount, 0);
        
        // Calculate balance:
        // - If positive, the user is owed money (paid more than their fair share)
        // - If negative, the user owes money (paid less than their fair share)
        let balance = userTotalPayments - fairSharePerUser;

        HTML += `
            <div>
                <img src="../img/${user.iconNumber}.jpg" alt="Icon of ${user.username}">
                <p>User: ${user.username}</p>
                <p>${pronoun} paid: ${userTotalPayments.toFixed(2)}€</p>
                ${balance > 0 
                    ? `<p class="positive">${pronoun} is owed: ${balance.toFixed(2)}€</p>`
                    : `<p class="negative">${pronoun} owes: ${Math.abs(balance).toFixed(2)}€</p>`
                }
            </div>`;
    });

    userListElement.innerHTML = HTML;
}

// Initial call to show balances
showBalancesDOM();

// Event for the "Settle up" button (clear payments)
clearPaymentsButton.addEventListener("click", function() {
    localStorage.removeItem("paymentsSummary");
    payments = [];
    
    showBalancesDOM();
});
