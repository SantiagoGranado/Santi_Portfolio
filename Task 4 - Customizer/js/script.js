const radioButtons = document.querySelectorAll("input[name='color']");
const whiteImage = document.getElementById("white");
const blackImage = document.getElementById("black");
const titleElement = document.getElementById("title");
const articleElement = document.querySelector("article");
const titleTSElement = document.getElementById("titleTS");
const spanElement = document.getElementById("spanColor");
const xElement = document.querySelector(".x");
const yElement = document.querySelector(".y");
const imagesPElement = document.getElementById("imagesP");

// Global variable to store the current text color
let currentTextColor = "white"; // Default color

/*
---------T-Shirt-------------
*/

// Initially hide the white image and show the black one
whiteImage.style.display = "none";
blackImage.style.display = "block";

// Event listener for the radio buttons
radioButtons.forEach(radio => {
    radio.addEventListener("change", (event) => {
        if (event.target.nextSibling.nodeValue.trim() === "Black") {
            whiteImage.style.display = "none";
            blackImage.style.display = "block";
            titleTSElement.style.color = "white";
            currentTextColor = "white"; // Update the global text color
        } else {
            whiteImage.style.display = "block";
            blackImage.style.display = "none";
            titleTSElement.style.color = "black";
            currentTextColor = "black"; // Update the global text color
        }

        // Apply the current color to the span if it exists
        const spanColorElement = document.getElementById("spanColor");
        if (spanColorElement) {
            spanColorElement.style.color = currentTextColor; // Change the current span color
        }
    });
});

/*
---------Title-------------
*/

// Update the title based on the input
titleElement.addEventListener('input', function() {
    titleTSElement.classList.add("creepster-regular");
    titleTSElement.textContent = titleElement.value;
});

// Move the title based on the x slider
xElement.addEventListener("input", (event) => {
    const xValue = event.target.value; // Value of the X slider
    titleTSElement.style.left = `${xValue}px`; // Move in X
});

// Move the title based on the y slider
yElement.addEventListener("input", (event) => {
    const yValue = event.target.value; // Value of the Y slider
    titleTSElement.style.top = `${yValue}px`; // Move in Y
});

/*
---------MEDIA QUERY-------------
*/

// Create a media query for a maximum width of 480px
const mediaQuery = window.matchMedia("(max-width: 480px)");

function handleScreenChange(e) {
    const textImages = document.getElementById("images");

    if (e.matches) { // If the screen width is 480px or less
        const imagesPElement = document.getElementById("imagesP");

        if (imagesPElement) { 
            imagesPElement.remove();
        }
        
        const txt = document.createElement("p"); 
        txt.id = "imagesP"; 
        txt.textContent = "Images (Click to select)";
        textImages.insertBefore(txt, textImages.firstChild);

        // Click to select image
        const images = document.querySelectorAll("#images img");
        images.forEach(image => {
            image.addEventListener("click", selectImage);
        });
        
        function selectImage(event) {
            const currentImage = event.target;

            if (articleElement) {
                articleElement.querySelector(".logo")?.remove();
                articleElement.querySelector(".miniLogo")?.remove();
                articleElement.querySelector("#spanColor")?.remove(); 

                const clonedImage = currentImage.cloneNode(true);
                clonedImage.classList.add("logo"); 

                const miniLogoImage = currentImage.cloneNode(true);
                miniLogoImage.classList.add("miniLogo"); 
                
                articleElement.appendChild(clonedImage);
                articleElement.appendChild(miniLogoImage);
                
                const imageName = getImageName(currentImage);
                const nameParagraph = document.createElement("span"); 
                nameParagraph.id = "spanColor"; 
                nameParagraph.classList.add("creepster-regular");
                nameParagraph.textContent = imageName; 
                nameParagraph.style.color = currentTextColor; // Apply the global text color
                articleElement.appendChild(nameParagraph); 
            }
        }
        
        function getImageName(imgElement) {
            const src = imgElement.src; 
            const fileName = src.substring(src.lastIndexOf('/') + 1);
            return fileName.substring(0, fileName.lastIndexOf('.'));
        }

        console.log("The screen width is 480px or less.");

    } else { // If the screen width is greater than 480px
        const imagesPElement = document.getElementById("imagesP");
        
        if (imagesPElement) { 
            imagesPElement.remove();
        }
        
        const txt = document.createElement("p"); 
        txt.id = "imagesP"; 
        txt.textContent = "Images (drag to t-shirt):";
        textImages.insertBefore(txt, textImages.firstChild);

        console.log("The screen width is more than 480px.");

        /*
        ---------DRAG AND DROP-------------
        */

        const images = document.querySelectorAll("#images img");
        const dropperContainers = [document.querySelector("#white"), document.querySelector("#black")];

        let currentImage;

        images.forEach(image => {
            image.addEventListener("dragstart", dragElement);
        });

        dropperContainers.forEach(dropper => {
            dropper.addEventListener("drop", dropElement);
            dropper.addEventListener("dragover", dragoverElement);
        });

        function dragElement(event) {
            currentImage = event.target;
            console.log("Drag started:", currentImage);
        }

        function dropElement(event) {
            event.preventDefault(); 
            console.log("Dropped:", currentImage);

            if (currentImage) {
                // Clone the element to avoid drag issues
                const clonedImage = currentImage.cloneNode(true);
                clonedImage.removeAttribute("draggable"); // Remove the draggable attribute from the clone
                clonedImage.classList.add("logo"); 

                const miniLogoImage = currentImage.cloneNode(true);
                miniLogoImage.removeAttribute("draggable");
                miniLogoImage.classList.add("miniLogo"); 
                
                if (articleElement) {
                    articleElement.querySelector(".logo")?.remove();
                    articleElement.querySelector(".miniLogo")?.remove();
                    articleElement.querySelector("span")?.remove(); 

                    articleElement.appendChild(clonedImage);
                    articleElement.appendChild(miniLogoImage);
                    
                    const imageName = getImageName(currentImage); // Get the name without the extension
                    const nameParagraph = document.createElement("span"); 
                    nameParagraph.id = "spanColor"; 
                    nameParagraph.classList.add("creepster-regular");
                    nameParagraph.textContent = imageName; 
                    nameParagraph.style.color = currentTextColor; // Apply the global text color
                    articleElement.appendChild(nameParagraph); 
                }
            }
        }

        function getImageName(imgElement) {
            const src = imgElement.src; 
            const fileName = src.substring(src.lastIndexOf('/') + 1); // Extract the file name
            return fileName.substring(0, fileName.lastIndexOf('.')); // Remove the extension
        }

        function dragoverElement(event) {
            event.preventDefault(); 
            console.log("Drag over:", event.target);
        }
    }
}

// Execute the function on page load
handleScreenChange(mediaQuery);

// Listen for changes in screen width
mediaQuery.addEventListener("change", handleScreenChange);
