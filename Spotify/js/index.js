// Global variables for song management and state
let allSongs = [];            // Stores all available songs
let favoriteSongs = JSON.parse(localStorage.getItem('favoriteSongs')) || [];  // Stores favorite song IDs
let currentSongIndex = 0;     // Index of currently playing song
let isRepeating = false;      // Repeat mode state
let isShuffling = false;      // Shuffle mode state

// Audio player element references
const audioPlayer = document.getElementById('audio-player');
const playPauseButton = document.getElementById('play-pause');
const progressBar = document.getElementById('progress-bar');
const currentTimeSpan = document.getElementById('current-time');
const totalDurationSpan = document.getElementById('total-duration');
const volumeControl = document.getElementById('volume-control');
const volumeIcon = document.getElementById('volume-icon');
const currentSongTitle = document.getElementById('current-song-title');
const currentSongArtist = document.getElementById('current-song-artist');

// Control button references
const nextButton = document.getElementById('next');
const previousButton = document.getElementById('previous');
const repeatButton = document.getElementById('repeat');
const shuffleButton = document.getElementById('shuffle');
const togglePlayPauseButton = document.getElementById('toggle-play-pause');

// Filtering system references
const dropdownLinks = document.querySelectorAll('.dropdown-content a');
const musicTable = document.querySelector('.music-table tbody');

// Function to get current song list based on filter
function getCurrentSongList() {
    const activeFilter = document.querySelector('.dropdown-content a.active');
    const currentFilter = activeFilter ? activeFilter.textContent.toLowerCase() : 'todos';
    
    if (currentFilter === 'favoritos') {
        return allSongs.filter(song => favoriteSongs.includes(song.id));
    }
    return allSongs;
}

// Main function to initially load songs
async function loadSongs() {
    try {
        const response = await fetch('http://informatica.iesalbarregas.com:7007/songs');
        const songs = await response.json();
        allSongs = songs;
        
        musicTable.innerHTML = '';
        
        for (const song of songs) {
            const row = document.createElement('tr');
            row.classList.add('song-row');
            row.setAttribute('data-id', song.id);
            row.setAttribute('data-cover', song.cover);
            
            const heartClass = favoriteSongs.includes(song.id) ? 'bxs-heart' : 'bx-heart';
            const duration = await formatDuration(song.filepath);
            
            row.innerHTML = `
                <td><i class='bx bx-play bx-sm'></i></td>
                <td>${song.title}</td>
                <td class="song-artist">${song.artist}</td>
                <td>${duration}</td>
                <td><i class='bx ${heartClass} bx-sm heart-icon'></i></td>
            `;
            
            row.addEventListener('click', handleSongClick);
            const heartIcon = row.querySelector('.heart-icon');
            heartIcon.addEventListener('click', handleHeartClick);
            
            musicTable.appendChild(row);
        }
        
        filterSongs('todos');
    } catch (error) {
        console.error('Error loading songs:', error);
    }
}

// Function to sync play/pause button states
function updatePlayPauseButtons(isPlaying) {
    if (isPlaying) {
        playPauseButton.classList.replace('bx-play-circle', 'bx-pause-circle');
        togglePlayPauseButton.textContent = 'Pause';
    } else {
        playPauseButton.classList.replace('bx-pause-circle', 'bx-play-circle');
        togglePlayPauseButton.textContent = 'Play';
    }
}

// Song filtering function
function filterSongs(filter = 'todos') {
    const songRows = document.querySelectorAll('.song-row');
    
    songRows.forEach(row => {
        const songId = parseInt(row.getAttribute('data-id'));
        if (filter === 'todos') {
            row.style.display = '';
        } else if (filter === 'favoritos') {
            row.style.display = favoriteSongs.includes(songId) ? '' : 'none';
        }
    });
}

// Song click handler
function handleSongClick(event) {
    const row = event.currentTarget;
    const songId = row.getAttribute('data-id');
    const songCover = row.getAttribute('data-cover');
    
    updateSongImage(songCover);
    playMusic(songId);
}

// Favorites handler
function handleHeartClick(event) {
    event.stopPropagation();
    const heartIcon = event.currentTarget;
    const songRow = heartIcon.closest('.song-row');
    const songId = parseInt(songRow.getAttribute('data-id'));
    
    const activeFilter = document.querySelector('.dropdown-content a.active');
    const currentFilter = activeFilter ? activeFilter.textContent.toLowerCase() : 'todos';

    if (heartIcon.classList.contains('bx-heart')) {
        heartIcon.classList.remove('bx-heart');
        heartIcon.classList.add('bxs-heart');
        if (!favoriteSongs.includes(songId)) {
            favoriteSongs.push(songId);
        }
    } else {
        heartIcon.classList.remove('bxs-heart');
        heartIcon.classList.add('bx-heart');
        favoriteSongs = favoriteSongs.filter(id => id !== songId);
        
        if (currentFilter === 'favoritos') {
            songRow.style.display = 'none';
        }
    }

    localStorage.setItem('favoriteSongs', JSON.stringify(favoriteSongs));
}

// Music playback function
function playMusic(idSong) {
    const song = allSongs.find(s => s.id === parseInt(idSong));
    if (!song) return;

    audioPlayer.pause();
    audioPlayer.currentTime = 0;
    audioPlayer.src = song.filepath;
    
    currentSongTitle.textContent = song.title;
    currentSongArtist.textContent = song.artist;
    updateSongImage(song.cover);

    audioPlayer.play().then(() => {
        updatePlayPauseButtons(true);
    }).catch(error => console.error('Error playing song:', error));

    currentSongIndex = allSongs.findIndex(s => s.id === parseInt(idSong));
}

// Enhanced next song function
function playNextSong() {
    const currentList = getCurrentSongList();
    if (currentList.length === 0) return;
    
    if (isShuffling) {
        const randomIndex = Math.floor(Math.random() * currentList.length);
        playMusic(currentList[randomIndex].id);
    } else {
        const currentSongId = allSongs[currentSongIndex].id;
        const currentFilteredIndex = currentList.findIndex(song => song.id === currentSongId);
        const nextIndex = (currentFilteredIndex + 1) % currentList.length;
        playMusic(currentList[nextIndex].id);
    }
}

// Enhanced previous song function
function playPreviousSong() {
    const currentList = getCurrentSongList();
    if (currentList.length === 0) return;
    
    if (isShuffling) {
        const randomIndex = Math.floor(Math.random() * currentList.length);
        playMusic(currentList[randomIndex].id);
    } else {
        const currentSongId = allSongs[currentSongIndex].id;
        const currentFilteredIndex = currentList.findIndex(song => song.id === currentSongId);
        const previousIndex = (currentFilteredIndex - 1 + currentList.length) % currentList.length;
        playMusic(currentList[previousIndex].id);
    }
}

// Utility functions
function updateSongImage(songCover) {
    const divImg = document.getElementById('footer-aside');
    const image = document.createElement('img');
    image.src = songCover;
    image.alt = 'Song cover';
    image.style.maxWidth = '100%';
    divImg.innerHTML = '';
    divImg.appendChild(image);
}

async function formatDuration(filepath) {
    return new Promise(resolve => {
        const audio = new Audio(filepath);
        audio.addEventListener('loadedmetadata', () => {
            const duration = audio.duration;
            const minutes = Math.floor(duration / 60);
            const seconds = Math.floor(duration % 60).toString().padStart(2, '0');
            resolve(`${minutes}:${seconds}`);
        });
        audio.addEventListener('error', () => resolve('Unknown'));
    });
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${secs}`;
}

// Volume control function
function updateVolumeIcon(volumeValue) {
    volumeIcon.classList.remove('bxs-volume-full', 'bxs-volume-low', 'bxs-volume-mute');
    
    if (volumeValue == 0) {
        volumeIcon.classList.add('bxs-volume-mute');
    } else if (volumeValue < 50) {
        volumeIcon.classList.add('bxs-volume-low');
    } else {
        volumeIcon.classList.add('bxs-volume-full');
    }
}

// Event Listeners

// Filtering dropdown
dropdownLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        dropdownLinks.forEach(l => l.classList.remove('active'));
        e.target.classList.add('active');
        const filter = e.target.textContent.toLowerCase();
        filterSongs(filter);
    });
});

// Circular play/pause button
playPauseButton.addEventListener('click', () => {
    if (audioPlayer.src) {
        if (audioPlayer.paused || audioPlayer.ended) {
            audioPlayer.play().then(() => {
                updatePlayPauseButtons(true);
            }).catch(error => console.error('Error playing:', error));
        } else {
            audioPlayer.pause();
            updatePlayPauseButtons(false);
        }
    } else if (allSongs.length > 0) {
        playMusic(allSongs[0].id);
    }
});

// Header play/pause button
togglePlayPauseButton.addEventListener('click', () => {
    if (!audioPlayer.src && allSongs.length > 0) {
        playMusic(allSongs[0].id);
        return;
    }

    if (audioPlayer.src) {
        if (audioPlayer.paused || audioPlayer.ended) {
            audioPlayer.play().then(() => {
                updatePlayPauseButtons(true);
            }).catch(error => console.error('Error playing:', error));
        } else {
            audioPlayer.pause();
            updatePlayPauseButtons(false);
        }
    }
});

// Progress and time control
audioPlayer.addEventListener('timeupdate', () => {
    if (!isNaN(audioPlayer.duration)) {
        progressBar.value = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        currentTimeSpan.textContent = formatTime(audioPlayer.currentTime);
        totalDurationSpan.textContent = formatTime(audioPlayer.duration);
    }
});

progressBar.addEventListener('input', () => {
    const duration = audioPlayer.duration || 0;
    audioPlayer.currentTime = (progressBar.value / 100) * duration;
});

// Volume control
volumeControl.addEventListener('input', () => {
    const volumeValue = volumeControl.value;
    audioPlayer.volume = volumeValue / 100;
    updateVolumeIcon(volumeValue);
});

volumeIcon.addEventListener('click', () => {
    if (audioPlayer.volume > 0) {
        // Save current volume before muting
        volumeIcon.dataset.previousVolume = volumeControl.value;
        audioPlayer.volume = 0;
        volumeControl.value = 0;
        updateVolumeIcon(0);
    } else {
        // Restore previous volume
        const previousVolume = volumeIcon.dataset.previousVolume || 100;
        audioPlayer.volume = previousVolume / 100;
        volumeControl.value = previousVolume;
        updateVolumeIcon(previousVolume);
    }
});

// Additional control buttons
nextButton.addEventListener('click', playNextSong);
previousButton.addEventListener('click', playPreviousSong);

repeatButton.addEventListener('click', () => {
    isRepeating = !isRepeating;
    audioPlayer.loop = isRepeating;
    repeatButton.classList.toggle('colorActive', isRepeating);
});

shuffleButton.addEventListener('click', () => {
    isShuffling = !isShuffling;
    shuffleButton.classList.toggle('colorActive', isShuffling);
});

// Song end handling
audioPlayer.addEventListener('ended', () => {
    if (isRepeating) {
        audioPlayer.play();
        updatePlayPauseButtons(true);
    } else {
        playNextSong();
    }
});

// Initialization
document.addEventListener('DOMContentLoaded', loadSongs);