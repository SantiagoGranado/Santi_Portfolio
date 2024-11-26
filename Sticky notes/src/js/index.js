// IndexedDB setup
let db;
const DB_NAME = 'notesDB';
const STORE_NAME = 'notes';

// Initialize database
const initDB = () => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onerror = (event) => {
        console.error('Database error:', event.target.error);
    };

    request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
        }
    };

    request.onsuccess = (event) => {
        db = event.target.result;
        loadNotes(); // Load saved notes when DB is ready
    };
};

const colorPicker = document.getElementById('noteColor');
const noteHeader = document.querySelector('.noteHeader');
const noteCreateElement = document.getElementById("addButton");
const mainElement = document.querySelector("main");

let counterID = 0;
let zIndexValue = 1;

// Load saved notes from IndexedDB
const loadNotes = () => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
        const notes = request.result;
        notes.forEach(noteData => {
            createNoteFromData(noteData);
        });
        // Update counterID based on existing notes
        if (notes.length > 0) {
            counterID = Math.max(...notes.map(note => note.id)) + 1;
        }
    };
};

// Create note from saved data
const createNoteFromData = (noteData) => {
    const newNote = createNoteElement(noteData.color);
    newNote.id = `note-${noteData.id}`;
    newNote.style.left = noteData.x + 'px';
    newNote.style.top = noteData.y + 'px';
    newNote.style.zIndex = noteData.zIndex;
    newNote.querySelector('textarea').value = noteData.text;
    mainElement.appendChild(newNote);
};

// Create new note element
const createNoteElement = (color) => {
    const newNote = document.createElement("div");
    newNote.classList = "note";

    const noteHeader = document.createElement("div");
    noteHeader.classList = "noteHeader";
    noteHeader.innerHTML = `<button class="delete">X</button>`;
    noteHeader.style.backgroundColor = color || colorPicker.value;

    const noteContent = document.createElement("div");
    noteContent.classList = "noteContent";
    noteContent.innerHTML = `<textarea name="noteText" id="noteText"></textarea>`;

    newNote.appendChild(noteHeader);
    newNote.appendChild(noteContent);

    return newNote;
};

// Save note to IndexedDB
const saveNote = (noteElement) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    const noteData = {
        id: parseInt(noteElement.id.split('-')[1]),
        text: noteElement.querySelector('textarea').value,
        color: noteElement.querySelector('.noteHeader').style.backgroundColor,
        x: parseInt(noteElement.style.left) || 0,
        y: parseInt(noteElement.style.top) || 0,
        zIndex: noteElement.style.zIndex
    };

    store.put(noteData);
};

// Delete note from IndexedDB
const deleteNote = (noteId) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.delete(parseInt(noteId));
};

// Event Listeners
colorPicker.addEventListener('input', function(e) {
    const selectedColor = e.target.value;
    noteHeader.style.backgroundColor = selectedColor;
});

noteCreateElement.addEventListener("click", function(e) {
    const newNote = createNoteElement();
    newNote.id = `note-${counterID}`;
    mainElement.appendChild(newNote);
    
    // Save new note
    saveNote(newNote);
    
    counterID++;
});

// Event delegation for delete button and text changes
document.addEventListener("click", (event) => {
    if (event.target.classList.contains('delete')) {
        const note = event.target.closest('.note');
        const noteId = note.id.split('-')[1];
        deleteNote(noteId);
        note.remove();
    }
});

// Save note content when text changes
document.addEventListener('input', (event) => {
    if (event.target.tagName === 'TEXTAREA') {
        const note = event.target.closest('.note');
        saveNote(note);
    }
});

let cursor = {
    x: null,
    y: null
};

let note = {
    dom: null,
    x: null,
    y: null
};

document.addEventListener("mousedown", (event) => {
    if (event.target.classList.contains('noteHeader')) {
        cursor = {
            x: event.clientX,
            y: event.clientY
        };

        let current = event.target.closest('.note');
        note = {
            dom: current,
            x: current.getBoundingClientRect().left,
            y: current.getBoundingClientRect().top
        };

        current.style.zIndex = zIndexValue;
        zIndexValue++;
    }
});

document.addEventListener("mousemove", (event) => {
    if (note.dom == null) return;

    let currentCursor = {
        x: event.clientX,
        y: event.clientY
    };

    let distance = {
        x: currentCursor.x - cursor.x,
        y: currentCursor.y - cursor.y
    };

    note.dom.style.left = (note.x + distance.x) + "px";
    note.dom.style.top = (note.y + distance.y) + "px";
    event.target.style.cursor = "grab";
});

document.addEventListener("mouseup", (event) => {
    if (note.dom) {
        saveNote(note.dom);
    }
    note.dom = null;
    event.target.style.cursor = "context-menu";
});

// Initialize IndexedDB when the page loads
initDB();