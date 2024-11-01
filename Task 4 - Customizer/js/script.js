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

// Variable global para almacenar el color de texto actual
let currentTextColor = "white"; // Color por defecto

/*
---------T-Shirt-------------
*/

// Inicialmente ocultar la imagen blanca y mostrar la negra
whiteImage.style.display = "none";
blackImage.style.display = "block";

// Event listener para los botones de radio
radioButtons.forEach(radio => {
    radio.addEventListener("change", (event) => {
        if (event.target.nextSibling.nodeValue.trim() === "Black") {
            whiteImage.style.display = "none";
            blackImage.style.display = "block";
            titleTSElement.style.color = "white";
            currentTextColor = "white"; // Actualizar el color de texto global
        } else {
            whiteImage.style.display = "block";
            blackImage.style.display = "none";
            titleTSElement.style.color = "black";
            currentTextColor = "black"; // Actualizar el color de texto global
        }

        // Aplicar el color actual al span si existe
        const spanColorElement = document.getElementById("spanColor");
        if (spanColorElement) {
            spanColorElement.style.color = currentTextColor; // Cambiar el color del span actual
        }
    });
});

/*
---------Title-------------
*/

// Actualizar el título basado en la entrada
titleElement.addEventListener('input', function() {
    titleTSElement.classList.add("creepster-regular");
    titleTSElement.textContent = titleElement.value;
});

// Mover el título basado en el slider de x
xElement.addEventListener("input", (event) => {
    const xValue = event.target.value; // Valor del slider X
    titleTSElement.style.left = `${xValue}px`; // Mover en X
});

// Mover el título basado en el slider de y
yElement.addEventListener("input", (event) => {
    const yValue = event.target.value; // Valor del slider Y
    titleTSElement.style.top = `${yValue}px`; // Mover en Y
});

/*
---------MEDIA QUERY-------------
*/

// Crear una media query para un ancho máximo de 480px
const mediaQuery = window.matchMedia("(max-width: 480px)");

function handleScreenChange(e) {
    const textImages = document.getElementById("images");

    if (e.matches) { // Si el ancho de la pantalla es de 480px o menos
        const imagesPElement = document.getElementById("imagesP");

        if (imagesPElement) { 
            imagesPElement.remove();
        }
        
        const txt = document.createElement("p"); 
        txt.id = "imagesP"; 
        txt.textContent = "Images (Click to select)";
        textImages.insertBefore(txt, textImages.firstChild);

        // Click para seleccionar imagen
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
                nameParagraph.style.color = currentTextColor; // Aplicar el color de texto global
                articleElement.appendChild(nameParagraph); 
            }
        }
        
        function getImageName(imgElement) {
            const src = imgElement.src; 
            const fileName = src.substring(src.lastIndexOf('/') + 1);
            return fileName.substring(0, fileName.lastIndexOf('.'));
        }

        console.log("The screen width is 480px or less.");

    } else { // Si el ancho de la pantalla es mayor a 480px
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
                // Clonar el elemento para evitar problemas de arrastre
                const clonedImage = currentImage.cloneNode(true);
                clonedImage.removeAttribute("draggable"); // Remover el atributo draggable del clon
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
                    
                    const imageName = getImageName(currentImage); // Obtener el nombre sin la extensión
                    const nameParagraph = document.createElement("span"); 
                    nameParagraph.id = "spanColor"; 
                    nameParagraph.classList.add("creepster-regular");
                    nameParagraph.textContent = imageName; 
                    nameParagraph.style.color = currentTextColor; // Aplicar el color de texto global
                    articleElement.appendChild(nameParagraph); 
                }
            }
        }

        function getImageName(imgElement) {
            const src = imgElement.src; 
            const fileName = src.substring(src.lastIndexOf('/') + 1); // Extraer el nombre del archivo
            return fileName.substring(0, fileName.lastIndexOf('.')); // Remover la extensión
        }

        function dragoverElement(event) {
            event.preventDefault(); 
            console.log("Drag over:", event.target);
        }
    }
}

// Ejecutar la función al cargar la página
handleScreenChange(mediaQuery);

// Escuchar cambios en el ancho de la pantalla
mediaQuery.addEventListener("change", handleScreenChange);
