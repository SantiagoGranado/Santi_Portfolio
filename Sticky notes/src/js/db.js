// index.js
import { DatabaseManager } from './db.js';

const dbManager = DatabaseManager.getInstance();
let zIndexValue = 1;

// Referencias DOM
const colorPicker = document.getElementById('noteColor');
const addButton = document.getElementById('addButton');
const mainElement = document.querySelector('main');

// Inicialización
async function init() {
    try {
        await dbManager.open();
        await loadSavedNotes();
        setupEventListeners();
    } catch (error) {
        console.error('Error initializing app:', error);
    }
}

// Cargar notas guardadas
async function loadSavedNotes() {
    try {
        const notes = await dbManager.getAllNotes();
        notes.forEach(createNoteFromData);
    } catch (error) {
        console.error('Error loading notes:', error);
    }
}

// Crear nota desde datos
function createNoteFromData(noteData) {
    const newNote = createNoteElement(noteData.color);
    newNote.id = `note-${noteData.id}`;
    newNote.style.left = `${noteData.x}px`;
    newNote.style.top = `${noteData.y}px`;
    newNote.style.zIndex = noteData.zIndex;
    newNote.querySelector('textarea').value = noteData.text;
    mainElement.appendChild(newNote);
}

// Crear elemento de nota
function createNoteElement(color = null) {
    const newNote = document.createElement("div");
    newNote.classList.add("note");

    const noteHeader = document.createElement("div");
    noteHeader.classList.add("noteHeader");
    noteHeader.innerHTML = `<button class="delete">X</button>`;
    noteHeader.style.backgroundColor = color || colorPicker.value;

    const noteContent = document.createElement("div");
    noteContent.classList.add("noteContent");
    noteContent.innerHTML = `<textarea name="noteText" id="noteText"></textarea>`;

    newNote.appendChild(noteHeader);
    newNote.appendChild(noteContent);

    setupNoteDrag(newNote);
    return newNote;
}

// Configurar arrastre de notas
function setupNoteDrag(noteElement) {
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;

    const header = noteElement.querySelector('.noteHeader');

    header.addEventListener('mousedown', startDragging);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDragging);

    function startDragging(e) {
        isDragging = true;
        noteElement.style.zIndex = zIndexValue++;

        initialX = e.clientX - noteElement.offsetLeft;
        initialY = e.clientY - noteElement.offsetTop;
        
        e.target.style.cursor = 'grabbing';
    }

    function drag(e) {
        if (!isDragging) return;

        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;

        noteElement.style.left = `${currentX}px`;
        noteElement.style.top = `${currentY}px`;
    }

    function stopDragging(e) {
        if (!isDragging) return;
        
        isDragging = false;
        e.target.style.cursor = 'grab';
        
        saveNotePosition(noteElement);
    }
}

// Obtener datos de la nota
function getNoteData(noteElement) {
    return {
        id: parseInt(noteElement.id.split('-')[1]),
        text: noteElement.querySelector('textarea').value,
        color: noteElement.querySelector('.noteHeader').style.backgroundColor,
        x: parseInt(noteElement.style.left) || 0,
        y: parseInt(noteElement.style.top) || 0,
        zIndex: noteElement.style.zIndex
    };
}

// Guardar posición de la nota
async function saveNotePosition(noteElement) {
    try {
        const noteData = getNoteData(noteElement);
        await dbManager.updateNote(noteData);
    } catch (error) {
        console.error('Error saving note position:', error);
    }
}

// Configurar event listeners
function setupEventListeners() {
    // Crear nueva nota
    addButton.addEventListener('click', async () => {
        const newNote = createNoteElement();
        mainElement.appendChild(newNote);
        
        try {
            const noteData = getNoteData(newNote);
            const id = await dbManager.saveNote(noteData);
            newNote.id = `note-${id}`;
        } catch (error) {
            console.error('Error creating note:', error);
            newNote.remove();
        }
    });

    // Eliminar nota
    document.addEventListener('click', async (event) => {
        if (event.target.classList.contains('delete')) {
            const noteElement = event.target.closest('.note');
            const noteId = parseInt(noteElement.id.split('-')[1]);
            
            try {
                await dbManager.deleteNote(noteId);
                noteElement.remove();
            } catch (error) {
                console.error('Error deleting note:', error);
            }
        }
    });

    // Guardar cambios en el texto
    document.addEventListener('input', async (event) => {
        if (event.target.tagName === 'TEXTAREA') {
            const noteElement = event.target.closest('.note');
            try {
                const noteData = getNoteData(noteElement);
                await dbManager.updateNote(noteData);
            } catch (error) {
                console.error('Error saving note text:', error);
            }
        }
    });

    // Cambio de color
    colorPicker.addEventListener('input', function(e) {
        const selectedColor = e.target.value;
        document.querySelector('.noteHeader').style.backgroundColor = selectedColor;
    });
}

// Iniciar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', init);