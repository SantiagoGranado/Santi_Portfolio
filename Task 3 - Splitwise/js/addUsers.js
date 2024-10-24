import { user } from "./user.js";

let usernameElement = document.getElementById("username");
let genderElements = document.getElementsByName("gender"); 
let imgElement = document.querySelectorAll("img");

export let users = JSON.parse(localStorage.getItem("users")) || []; 
let selectedImage = null; 


imgElement.forEach(imagen => {
    imagen.addEventListener('click', function() {
        console.log('You clicked: ' + this.alt);

        // Remove 'selected' class from all images
        imgElement.forEach(img => img.classList.remove('selected'));
        // Add 'selected' class to the clicked image
        this.classList.add('selected');
        
        selectedImage = this.alt; 
    });
});


document.getElementById('myForm').addEventListener('submit', function(event) {
    
    let usr = usernameElement.value.trim(); 
    let gender = ''; 

    // Get the selected gender
    genderElements.forEach((elem) => {
        if (elem.checked) {
            gender = elem.value; // Capture the value of the selected gender
        }
    });

    console.log("Form submitted");
    console.log("Name:", usr);
    console.log("Gender:", gender);
    console.log("Selected image:", selectedImage);

    // Validation: check if the username already exists
    const userExists = users.some(u => u.username === usr);
    if (userExists) {
        alert("Username is already in use. Please choose another one.");
        return; 
    }

    // Validation: check if an icon image is selected
    if (!selectedImage) {
        alert("Please select an icon.");
    } else {
        // Add new user to the array
        users.push(new user(usr, gender, selectedImage));
        localStorage.setItem("users", JSON.stringify(users)); // Save users to localStorage
    }

    mostrarUsuarios(); // Show the list of users in the console
});

// Function to display the list of users in the console
function mostrarUsuarios() {
    console.log("List of users:");
    users.forEach((u, index) => {
        console.log(`User ${index + 1}:`);
        console.log(`  Name: ${u.username}`);
        console.log(`  Gender: ${u.gender}`);
        console.log(`  Icon: ${u.iconNumber}`);
    });
}

