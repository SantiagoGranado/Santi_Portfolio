let contenedor = document.getElementById("titulo");
let fechaObjetivo = new Date("03/23/2025"); // My birthday

// Create a textarea to ask the user for a date
var textarea = document.createElement("textarea");
textarea.id = "myTextarea"; // Assign an ID
textarea.rows = 1;
textarea.cols = 30;
textarea.placeholder = "Format (MM/DD/YYYY)";
contenedor.appendChild(textarea);

// Create a button to get the text and update the date
var botonTexto = document.createElement("button");
botonTexto.textContent = "Set Date";
botonTexto.onclick = obtenerTexto; // Update the date with the button
contenedor.appendChild(botonTexto);

// Function to get the text from the textarea and update the date
function obtenerTexto() {
  var texto = document.getElementById("myTextarea").value;
  const nuevaFecha = new Date(texto);
  
  // Check if the date is valid
  if (nuevaFecha.toString() !== "Invalid Date") { // The "Invalid Date" checks if the date is correct
    fechaObjetivo = nuevaFecha;
  } else {
    alert("Invalid date format");
  }
}

// Function to update the countdown
function actualizarCuentaAtras() {
  const ahora = new Date();
  let diferencia = fechaObjetivo - ahora; // Difference in milliseconds

  if (diferencia > 0) {
    // Calculations
    const segundos = Math.floor(diferencia / 1000);
    const minutos = Math.floor(segundos / 60);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);
    const meses = Math.floor(dias / 30);

    // Calculate remaining days, hours, and minutes
    const diasRestantes = dias % 30;
    const horasRestantes = horas % 24;
    const minutosRestantes = minutos % 60;
    const segundosRestantes = segundos % 60;

    // Create the content for each div
    const contenido = `
      <div><p>${meses} months</p></div>
      <div><p>${diasRestantes} days</p></div>
      <div><p>${horasRestantes} hours</p></div>
      <div><p>${minutosRestantes} minutes</p></div>
      <div><p>${segundosRestantes} seconds</p></div>
    `;
    
    // Display the result in the main div
    document.getElementById("time").innerHTML = contenido;

    if (dias < 7) {
      document.getElementById("time").className = "colorRojo";
    } else if (dias < 14) {
      document.getElementById("time").className = "colorNaranja";
    } else {
      document.getElementById("time").className = "colorVerde";
    }

  } else {
    document.getElementById("time").innerHTML = "<div>The countdown has ended!</div>";
  }
}

// Update the countdown every second (1000ms)
setInterval(actualizarCuentaAtras, 1000);

const imagenFondo = "https://i.pinimg.com/550x/9b/d4/19/9bd4195f48e52a1d52eb499c7fd6e99a.jpg"; // Replace with your image URL

// Set the image as background in the body
document.body.style.backgroundImage = `url(${imagenFondo})`;







