const songs = [
    { title: "MANA", artist: "Dj", duration:"0.13",src: "ReelAudio-26599.mp3" },
    { title: "Spanish", artist: "gata", duration:"0.20",src: "ReelAudio-46609.mp3" },
    { title: "Nature lover", artist: "japanese song", duration:"0.18",src: "ReelAudio-71901.mp3" },
    { title: "blackpink", artist: "jennie rose part", duration:"0.15",src: "ReelAudio-75269.mp3" },
];

let currentSongIndex = 0;
const audio = document.getElementById("audio");
const playlistDiv = document.getElementById("playlist");
const playPauseBtn = document.getElementById("playPauseBtn");
const progress = document.getElementById("progress");
const volumeSlider = document.getElementById("volume");

// Load Playlist
function loadPlaylist() {
    songs.forEach((song, index) => {
        const div = document.createElement("div");
        div.className = "song";
        div.innerHTML = `${song.title} - ${song.artist} (${song.duration})`;
        div.onclick = () => loadSong(index);
        playlistDiv.appendChild(div);
    });
}

function loadSong(index) {
    currentSongIndex = index;
    audio.src = songs[index].src;
    audio.play();
    playPauseBtn.innerText = "Pause";
    document.querySelector(".player").classList.add("playing");
}

playPauseBtn.onclick = () => {
    if (audio.paused) {
        audio.play();
        playPauseBtn.innerText = "Pause";
        document.querySelector(".player").classList.add("playing");
    } else {
        audio.pause();
        playPauseBtn.innerText = "Play";
        document.querySelector(".player").classList.remove("playing");
    }
};

// Next Button
document.getElementById("nextBtn").onclick = () => {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(currentSongIndex);
};

// Previous Button
document.getElementById("prevBtn").onclick = () => {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(currentSongIndex);
};

// Progress Bar Update
audio.addEventListener("timeupdate", () => {
    progress.value = (audio.currentTime / audio.duration) * 100;
});

// Seek
progress.oninput = () => {
    audio.currentTime = (progress.value / 100) * audio.duration;
};

// Volume Control
volumeSlider.oninput = () => {
    audio.volume = volumeSlider.value;
};

loadPlaylist();
