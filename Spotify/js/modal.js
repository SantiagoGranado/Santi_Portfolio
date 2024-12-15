// DOM element references for the modal
const modal = document.getElementById('songModal');
const addButton = document.getElementById('add-song-button');
const closeButton = document.querySelector('.close-button');
const form = document.getElementById('songForm');
const fileButtons = document.querySelectorAll('.file-select-button');
const fileInputs = document.querySelectorAll('input[type="file"]');

// Form element references
const songFileInput = document.getElementById('songFile');
const coverImageInput = document.getElementById('coverImage');
const songTitleInput = document.getElementById('songTitle');
const songAuthorInput = document.getElementById('songAuthor');

// Enhanced validation function
function validateForm(songFile, coverImage, title, artist) {
    // Validate music file
    if (!songFile || !songFile.name.endsWith('.mp3')) {
        alert('Please select a song file in MP3 format.');
        return false;
    }

    // Validate title and artist (letters, spaces and special characters)
    const nameRegex = /^[A-Za-zÁ-ÿ\s]{1,20}$/;
    if (!nameRegex.test(title)) {
        alert('Title must be maximum 20 characters and contain only letters and spaces.');
        return false;
    }

    if (!nameRegex.test(artist)) {
        alert('Artist must be maximum 20 characters and contain only letters and spaces.');
        return false;
    }

    // Validate cover image
    if (!coverImage || (coverImage.type !== 'image/png' && coverImage.type !== 'image/jpeg')) {
        alert('Please select a cover image in PNG or JPG format.');
        return false;
    }

    return true;
}

// Binding file buttons with inputs
fileButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
        fileInputs[index].click();
    });

    fileInputs[index].addEventListener('change', function () {
        const fileName = this.files[0]?.name || 'Select file';
        button.textContent = fileName;
    });
});

// Modal events with animation
addButton.addEventListener('click', () => {
    modal.style.display = 'block';
    // Forzar reflow
    modal.offsetHeight;
    modal.classList.add('show');
});

function closeModal() {
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
        form.reset();
        fileButtons.forEach(button => {
            button.textContent = 'Select file';
        });
    }, 300); // 300ms = duración de la transición
}

closeButton.addEventListener('click', closeModal);

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeModal();
    }
});

// Form submission handling
form.addEventListener('submit', async function (event) {
    event.preventDefault();

    const songFile = songFileInput.files[0];
    const coverImage = coverImageInput.files[0];
    const title = songTitleInput.value;
    const artist = songAuthorInput.value;

    // Validate form
    if (!validateForm(songFile, coverImage, title, artist)) {
        return;
    }

    // Create FormData
    const formData = new FormData();
    formData.append('music', songFile);
    formData.append('title', title);
    formData.append('artist', artist);
    formData.append('cover', coverImage);

    try {
        const response = await fetch('http://informatica.iesalbarregas.com:7007/upload', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Server response error');
        }

        const data = await response.json();
        console.log('Success:', data);
        alert('Song uploaded successfully');
        closeModal();

        // Reload songs list
        loadSongs();
    } catch (error) {
        console.error('Error:', error);
    }
});
