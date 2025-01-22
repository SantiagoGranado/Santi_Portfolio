// Variables globales
let currentCard = null; // Almacena el elemento arrastrado actualmente
let numImg = 0; // Contador de Pokémon en el equipo

// Elementos del DOM
const dropperContainer = document.getElementById("pokemon-team");
const imagesContainer = document.getElementById("pokemon-list");
const guardarNombre = document.getElementById("guardar");
const titleElement = document.getElementById("nombre");
const nombreElement = document.getElementById("title");
const textoMensaje = document.getElementById("texto");
const miDiv = document.getElementById("miDiv");

// Configuración inicial al cargar la página
window.addEventListener("load", () => {
    cargarNombreEquipo();
});

// Evento de clic para mostrar un mensaje divertido
miDiv.addEventListener("click", function () {
    alert("¡Esto es un proyecto algo tonto que estoy usando para practicar!");
});

// Evento para generar Pokémon al hacer clic en el botón
document.getElementById("boton").addEventListener("click", generarPokemon);

// Evento para actualizar y guardar el nombre del equipo en tiempo real
titleElement.addEventListener("input", function () {
    actualizarNombreEquipo();
});

// Evento para guardar manualmente el nombre del equipo
guardarNombre.addEventListener("click", () => {
    guardarNombreEquipo();
});

// Drag and Drop: Configura los eventos en los contenedores
[dropperContainer, imagesContainer].forEach(container => {
    container.addEventListener("dragover", dragoverElement);
    container.addEventListener("drop", dropElement);
});


// =============================================
// FUNCIONES PRINCIPALES
// =============================================

/**
 * Genera Pokémon aleatorios y los muestra en la lista.
 */
function generarPokemon() {
    const pokemonAPI = "https://pokeapi.co/api/v2/pokemon/";
    const promises = [];
    const randomNumbers = generarNumerosUnicos(20, 100);

    // Solicita los datos de los Pokémon a la API
    randomNumbers.forEach(number => {
        const fullUrl = `${pokemonAPI}${number}`;
        promises.push(
            fetch(fullUrl)
                .then(response => response.json())
                .then(data => ({
                    name: data.name,
                    image: data.sprites.front_default
                }))
        );
    });

    // Muestra los Pokémon en la lista
    Promise.all(promises)
        .then(results => {
            imagesContainer.innerHTML = ""; // Limpia la lista existente
            results.forEach(pokemon => {
                const card = crearPokemonCard(pokemon);
                imagesContainer.appendChild(card);
            });
        })
        .catch(err => {
            console.error("ERROR:", err.message);
        });
}

/**
 * Crea un elemento de tarjeta para un Pokémon.
 * @param {Object} pokemon - Datos del Pokémon.
 * @returns {HTMLElement} - Elemento de tarjeta.
 */
function crearPokemonCard(pokemon) {
    const card = document.createElement("div");
    card.className = "pokemon-card";
    card.draggable = true;
    card.ondragstart = dragElement; // Configura el evento dragstart
    card.innerHTML = `
        <img src="${pokemon.image}" alt="${pokemon.name}">
        <span>${pokemon.name}</span>
    `;
    return card;
}

/**
 * Permite el drop en los contenedores.
 * @param {Event} event - Evento dragover.
 */
function dragoverElement(event) {
    event.preventDefault(); // Permite el drop
}

/**
 * Maneja el evento drop para mover Pokémon entre contenedores.
 * @param {Event} event - Evento drop.
 */
function dropElement(event) {
    event.preventDefault();

    if (currentCard) {
        const targetContainer = event.target.closest("#pokemon-team, #pokemon-list");

        // Verifica si el drop es válido y mueve la tarjeta
        if (targetContainer && targetContainer !== currentCard.parentElement) {
            if (targetContainer === dropperContainer && numImg < 5) {
                targetContainer.appendChild(currentCard);
                numImg++;
                actualizarMensajeEquipo();
            } else if (targetContainer === imagesContainer) {
                targetContainer.appendChild(currentCard);
                numImg--;
                actualizarMensajeEquipo();
            }
        }

        currentCard = null; // Resetea el Pokémon seleccionado
    }
}

/**
 * Almacena el elemento arrastrado actualmente.
 * @param {Event} event - Evento dragstart.
 */
function dragElement(event) {
    currentCard = event.target.closest(".pokemon-card");
}

// =============================================
// FUNCIONES DE SOPORTE
// =============================================

/**
 * Genera un conjunto de números únicos.
 * @param {number} cantidad - Cantidad de números a generar.
 * @param {number} max - Número máximo.
 * @returns {number[]} - Array de números únicos.
 */
function generarNumerosUnicos(cantidad, max) {
    const numeros = new Set();
    while (numeros.size < cantidad) {
        numeros.add(Math.floor(Math.random() * max) + 1);
    }
    return Array.from(numeros);
}

/**
 * Actualiza el mensaje cuando el equipo está completo o incompleto.
 */
function actualizarMensajeEquipo() {
    if (numImg === 5) {
        textoMensaje.innerHTML = `<h2 class="error">¡Tu equipo está listo para la batalla!</h2>`;
    } else {
        textoMensaje.innerHTML = ""; // Limpia el mensaje
    }
}

/**
 * Carga el nombre del equipo desde localStorage.
 */
function cargarNombreEquipo() {
    const equipoNombre = localStorage.getItem("equipoNombre");
    if (equipoNombre) {
        titleElement.value = equipoNombre;
        nombreElement.textContent = equipoNombre;
    }
}

/**
 * Guarda el nombre del equipo en localStorage.
 */
function guardarNombreEquipo() {
    const equipoNombre = titleElement.value;
    localStorage.setItem("equipoNombre", equipoNombre);
    console.log("Nombre del equipo guardado:", equipoNombre);
}

/**
 * Actualiza el nombre del equipo en el título en tiempo real.
 */
function actualizarNombreEquipo() {
    nombreElement.textContent = titleElement.value;
    localStorage.setItem("equipoNombre", titleElement.value);
}
