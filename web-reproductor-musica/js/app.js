const songs = [
    { title: "Gabito Ballesteros - A Puro Dolor", src: "assets/media/APuroDolor.mp3" },
    { title: "Gabito Ballesteros - Chiquitita", src: "assets/media/Chiquitita.mp3" },
    { title: "Fuerza Regida - Disculpe Usted", src: "assets/media/DisculpeUsted.mp3" },
    { title: "Fuerza Regida - Los Sufrimientos", src: "assets/media/LosSufrimientos.mp3" },
    { title: "Natanael Cano - Mi Bello Angel", src: "assets/media/MiBelloAngel.mp3" },
    { title: "Fuerza Regida - Navidad Sin Ti", src: "assets/media/NavidadSinTi.mp3" },
    { title: "Fuerza Regida - No Me Dejes Nunca", src: "assets/media/NoMeDejesNunca.mp3" },
    { title: "Fuerza Regida - No Volvere", src: "assets/media/NoVolvere.mp3" },
    { title: "Natanael Cano - O Me Voy O Te Vas", src: "assets/media/OMeVoyOTeVas.mp3" },
    { title: "Gabito Ballesteros - Que Lloro", src: "assets/media/QueLloro.mp3" },
    { title: "Fuerza Regida - Que Tal Se Siente", src: "assets/media/QueTalSeSiente.mp3" },
    { title: "Fuerza Regida - Quien Es Usted", src: "assets/media/QuienEsUsted.mp3" },
    { title: "Gabito Ballesteros - Te He Prometido", src: "assets/media/TeHePrometido.mp3" },
    { title: "Fuerza Regida - Te Hubieras Ido Antes", src: "assets/media/TeHubierasIdoAntes.mp3" },
    { title: "Fuerza Regida - Te Voy A Olvidar", src: "assets/media/TeVoyAOlvidar.mp3" },
    { title: "Fuerza Regida - Tu Ventana", src: "assets/media/TuVentana.mp3" },
    { title: "Fuerza Regida - Un Idiota", src: "assets/media/UnIdiota.mp3" },
    { title: "Fuerza Regida - Vete Ya", src: "assets/media/VeteYa.mp3" },
];

const audioPlayer = new Audio();
let currentSong = 0;

const loadSong = () => {
    audioPlayer.src = songs[currentSong].src;
    const info = songs[currentSong].title.split("-");
    document.getElementById("artist-name").textContent = info[0] ? info[0].trim() : "";
    document.getElementById("song-title").textContent = info[1] ? info[1].trim() : info[0].trim();
};

const playerContainer = document.getElementById("player-container");
const playlistContainer = document.getElementById("song-list");
const player = document.getElementById("player");
const backIcon = document.querySelector(".back");
const playlistIcon = document.querySelector(".playlist-icon");
const progress = document.getElementById("progress");
const songImage = document.getElementById("song-image");
const playButton = document.getElementById("play");
const pauseButton = document.getElementById("pausar");
const nextButton = document.getElementById("next");
const previousButton = document.getElementById("previous");

const playSong = () => {
    audioPlayer.play();
    songImage.classList.add("playing");
    playButton.style.display = "none";
    pauseButton.style.display = "block";
};

const pauseSong = () => {
    audioPlayer.pause();
    songImage.classList.remove("playing");
    pauseButton.style.display = "none";
    playButton.style.display = "block";
};

const nextSong = () => {
    currentSong = (currentSong + 1) % songs.length;
    loadSong();
    playSong();
};

const previousSong = () => {
    currentSong = (currentSong - 1 + songs.length) % songs.length;
    loadSong();
    playSong();
};

const selectSong = (index) => {
    currentSong = index;
    loadSong();
    playSong();
    playlistContainer.style.display = "none";
    player.style.display = "block";
    backIcon.style.display = "none";
    playerContainer.style.overflowY = "hidden";
};

backIcon.addEventListener("click", () => {
    player.style.display = "block";
    backIcon.style.display = "none";
    playerContainer.style.overflowY = "hidden";
    playlistContainer.style.display = "none";
});

playlistIcon.addEventListener("click", () => {
    player.style.display = "none";
    backIcon.style.display = "block";
    playerContainer.style.overflowY = "auto";
    playlistContainer.style.display = "block";

    playlistContainer.replaceChildren();
    const ul = document.createElement("ul");
    ul.className = "playlist-style";

    songs.forEach((song, index) => {
        const li = document.createElement("li");
        li.textContent = song.title;
        li.addEventListener("click", () => selectSong(index));
        ul.appendChild(li);
    });

    playlistContainer.appendChild(ul);
});

playButton.addEventListener("click", playSong);
pauseButton.addEventListener("click", pauseSong);
nextButton.addEventListener("click", nextSong);
previousButton.addEventListener("click", previousSong);

progress.addEventListener("input", function () {
    audioPlayer.currentTime = (this.value * audioPlayer.duration) / 100;
});

audioPlayer.addEventListener("timeupdate", () => {
    const percentage = (audioPlayer.currentTime / audioPlayer.duration) * 100;

    progress.style.background = `linear-gradient(to right, #fe8d94 ${percentage}%, #ffffff ${percentage}%, #ffffff ${percentage}%)`;
    progress.value = percentage;

    if (audioPlayer.currentTime === audioPlayer.duration) {
        nextSong();
    }
});

loadSong();
