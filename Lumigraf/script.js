// TMDB API Configuration
const TMDB_API_KEY = 'YOUR_TMDB_API_KEY'; // Replace with your actual TMDB API key
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMG_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// DOM Elements
const modal = document.getElementById('videoModal');
const videoPlayer = document.getElementById('moviePlayer');
const closeModal = document.querySelector('.close-modal');
const playPauseBtn = document.getElementById('playPauseBtn');
const muteBtn = document.getElementById('muteBtn');
const progressBar = document.querySelector('.progress');
const currentTimeDisplay = document.getElementById('currentTime');
const durationDisplay = document.getElementById('duration');

// Video Player State
let isPlaying = false;
let isMuted = false;

// Format time in MM:SS
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Update progress bar
function updateProgress() {
    const progress = (videoPlayer.currentTime / videoPlayer.duration) * 100;
    progressBar.style.width = `${progress}%`;
    currentTimeDisplay.textContent = formatTime(videoPlayer.currentTime);
}

// Toggle play/pause
function togglePlayPause() {
    if (isPlaying) {
        videoPlayer.pause();
        playPauseBtn.textContent = '▶';
    } else {
        videoPlayer.play();
        playPauseBtn.textContent = '⏸';
    }
    isPlaying = !isPlaying;
}

// Toggle mute
function toggleMute() {
    videoPlayer.muted = !isMuted;
    muteBtn.textContent = isMuted ? '🔇' : '🔊';
    isMuted = !isMuted;
}

// Seek video
function seekVideo(e) {
    const progressBar = e.currentTarget;
    const clickPosition = e.offsetX;
    const progressBarWidth = progressBar.offsetWidth;
    const seekTime = (clickPosition / progressBarWidth) * videoPlayer.duration;
    videoPlayer.currentTime = seekTime;
}

// Play movie
async function playMovie(movieId) {
    try {
        // Fetch movie details from TMDB
        const response = await fetch(`${TMDB_BASE_URL}/movie/${movieId}/videos?api_key=${TMDB_API_KEY}`);
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
            // Get the first video (usually the trailer)
            const videoKey = data.results[0].key;
            const videoUrl = `https://www.youtube.com/embed/${videoKey}?autoplay=1`;
            
            // Update video source
            videoPlayer.src = videoUrl;
            
            // Show modal and play video
            modal.style.display = 'block';
            videoPlayer.play();
            isPlaying = true;
            playPauseBtn.textContent = '⏸';
        } else {
            alert('No video available for this movie.');
        }
    } catch (error) {
        console.error('Error fetching video:', error);
        alert('Error loading video. Please try again later.');
    }
}

// Event Listeners
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
    videoPlayer.pause();
    videoPlayer.currentTime = 0;
    isPlaying = false;
    playPauseBtn.textContent = '▶';
});

playPauseBtn.addEventListener('click', togglePlayPause);
muteBtn.addEventListener('click', toggleMute);

videoPlayer.addEventListener('timeupdate', updateProgress);
videoPlayer.addEventListener('loadedmetadata', () => {
    durationDisplay.textContent = formatTime(videoPlayer.duration);
});

document.querySelector('.progress-bar').addEventListener('click', seekVideo);

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        videoPlayer.pause();
        videoPlayer.currentTime = 0;
        isPlaying = false;
        playPauseBtn.textContent = '▶';
    }
});

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (modal.style.display === 'block') {
        switch (e.code) {
            case 'Space':
                e.preventDefault();
                togglePlayPause();
                break;
            case 'KeyM':
                toggleMute();
                break;
            case 'Escape':
                modal.style.display = 'none';
                videoPlayer.pause();
                videoPlayer.currentTime = 0;
                isPlaying = false;
                playPauseBtn.textContent = '▶';
                break;
        }
    }
}); 