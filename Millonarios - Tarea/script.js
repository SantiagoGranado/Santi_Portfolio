
// 1. Get references of elements
let main = document.getElementById("main");
let addUserElement = document.getElementById("add-user");
let doubleElement = document.getElementById("double");
let sortElement = document.getElementById("sort");
let millonaryElement = document.getElementById("show-millionaires");
let wealthElement = document.getElementById("calculate-wealth");


// 2. Create new user array
let userList = [];

// 3. Add event listeners
addUserElement.addEventListener("click", getRandomUser); // Botón añadir usuario
doubleElement.addEventListener("click", doubleMoney); // Botón doble dinero 
millonaryElement.addEventListener("click", showMillionaires);
sortElement.addEventListener("click", sortByRichest); // Botón ordenar
wealthElement.addEventListener("click", calculateWealth); // Botón ordenar



async function getRandomUser() {
  let res = await fetch('https://randomuser.me/api');
  let data = await res.json();
  let user = data.results[0];
  let newUser = {
    name: `${user.name.first} ${user.name.last}`,
    money: Math.random() * 100000
  }
  addData(newUser);
}

function formatMoney(number) {
  return number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + '€';
}


// 4. Implement function to add the new user to the list and refresh UI
function addData(newUser) {
  userList.push(newUser)
  updateDOM();
 
}



// 5. Implement rest of functions

function doubleMoney() {
  
  userList = userList.map(user => {
    // Reasigna el valor de money multiplicándolo por 2
    return { ...user, money: user.money * 2 };
  });

  updateDOM();
}

function sortByRichest() {
  
    userList.sort((a, b) => b.money - a.money);
    updateDOM();
}

function showMillionaires() {

  userList = userList.filter(user => user.money > 1000000);
  
  updateDOM();

}

function calculateWealth() {

  let wealth = userList.reduce((acc, user) => (acc += user.money), 0);

  let existingWealthElement = document.querySelector(".suma");

  // Si existe, lo elimina
  if (existingWealthElement) {
    existingWealthElement.remove(); // Elimina el elemento existente
  }
  let wealthElement = document.createElement("div");
  wealthElement.classList.add("suma");

  wealthElement.innerHTML = `<h3>Total Wealth: <strong>${formatMoney(wealth)}</strong></h3>`;
  main.appendChild(wealthElement);

}

function updateDOM() {

  main.innerHTML="<h2><strong>Persona</strong> Dinero</h2>";

  userList.forEach(user => {
    let divElement = document.createElement("div");
    divElement.classList.add("person");

    //le añadimos el nombre
    let strongElement = document.createElement("strong");
    strongElement.innerText=user.name;
    divElement.appendChild(strongElement);
    main.appendChild(divElement);

    //le añadimos dinero
    let spanElement = document.createElement("span");
    spanElement.innerText=formatMoney(user.money);
    divElement.appendChild(spanElement);
    main.appendChild(divElement);

  

  })
}

