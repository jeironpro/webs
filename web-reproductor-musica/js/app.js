const songs = [
    {
        artist: "Gabito Ballesteros",
        title: "A Puro Dolor",
        src: "./assets/media/APuroDolor.mp3",
    },
    { artist: "Gabito Ballesteros", title: "Chiquitita", src: "./assets/media/Chiquitita.mp3" },
    {
        artist: "Fuerza Regida",
        title: "Disculpe Usted",
        src: "./assets/media/DisculpeUsted.mp3",
    },
    {
        artist: "Fuerza Regida",
        title: "Los Sufrimientos",
        src: "./assets/media/LosSufrimientos.mp3",
    },
    {
        artist: "Natanael Cano",
        title: "Mi Bello Angel",
        src: "./assets/media/MiBelloAngel.mp3",
    },
    {
        artist: "Fuerza Regida",
        title: "Navidad Sin Ti",
        src: "./assets/media/NavidadSinTi.mp3",
    },
    {
        artist: "Fuerza Regida",
        title: "No Me Dejes Nunca",
        src: "./assets/media/NoMeDejesNunca.mp3",
    },
    { artist: "Fuerza Regida", title: "No Volvere", src: "./assets/media/NoVolvere.mp3" },
    {
        artist: "Natanael Cano",
        title: "O Me Voy O Te Vas",
        src: "./assets/media/OMeVoyOTeVas.mp3",
    },
    {
        artist: "Gabito Ballesteros",
        title: "Que Lloro (En Vivo)",
        src: "./assets/media/QueLloro.mp3",
    },
    {
        artist: "Fuerza Regida",
        title: "Que Tal Se Siente",
        src: "./assets/media/QueTalSeSiente.mp3",
    },
    {
        artist: "Fuerza Regida",
        title: "Quien Es Usted",
        src: "./assets/media/QuienEsUsted.mp3",
    },
    {
        artist: "Gabito Ballesteros",
        title: "Te He Prometido",
        src: "./assets/media/TeHePrometido.mp3",
    },
    {
        artist: "Fuerza Regida",
        title: "Te Hubieras Ido Antes",
        src: "./assets/media/TeHubierasIdoAntes.mp3",
    },
    {
        artist: "Fuerza Regida",
        title: "Te Voy A Olvidar",
        src: "./assets/media/TeVoyAOlvidar.mp3",
    },
    { artist: "Fuerza Regida", title: "Tu Ventana", src: "./assets/media/TuVentana.mp3" },
    { artist: "Fuerza Regida", title: "Un Idiota", src: "./assets/media/UnIdiota.mp3" },
    { artist: "Fuerza Regida", title: "Vete Ya", src: "./assets/media/VeteYa.mp3" },
];

const audioPlayer = new Audio();
audioPlayer.preload = "metadata";

const playerContainer = document.querySelector("#player-container");
const playlistToggle = document.querySelector("#playlist-toggle");
const playlistBack = document.querySelector("#playlist-back");
const playlistList = document.querySelector("#playlist-list");
const artistName = document.querySelector("#artist-name");
const songTitle = document.querySelector("#song-title");
const songImage = document.querySelector("#song-image");
const progress = document.querySelector("#progress");
const progressFill = document.querySelector("#progress-fill");
const playToggle = document.querySelector("#play-toggle");
const playIcon = document.querySelector("#play-icon");
const pauseIcon = document.querySelector("#pause-icon");
const nextButton = document.querySelector("#next");
const previousButton = document.querySelector("#previous");

let currentSong = 0;

const updatePlaylistSelection = () => {
    playlistList.querySelectorAll(".playlist__item").forEach((button) => {
        const active = Number(button.dataset.index) === currentSong;
        button.classList.toggle("is-active", active);
        if (active) {
            button.setAttribute("aria-current", "true");
        } else {
            button.removeAttribute("aria-current");
        }
    });
};

const loadSong = () => {
    const song = songs[currentSong];
    audioPlayer.src = song.src;
    audioPlayer.load();
    artistName.textContent = song.artist;
    songTitle.textContent = song.title;
    progress.value = "0";
    progressFill.value = 0;
    progress.setAttribute("aria-valuetext", "0%");
    updatePlaylistSelection();
};

const setPlaying = (playing) => {
    songImage.classList.toggle("is-playing", playing);
    playIcon.classList.toggle("is-hidden", playing);
    pauseIcon.classList.toggle("is-hidden", !playing);
    playToggle.setAttribute("aria-label", playing ? "Pausar" : "Reproducir");
    playToggle.setAttribute("aria-pressed", String(playing));
};

const playCurrent = () => {
    audioPlayer.play().catch(() => {
        setPlaying(false);
    });
};

const nextSong = () => {
    currentSong = (currentSong + 1) % songs.length;
    loadSong();
    playCurrent();
};

const previousSong = () => {
    currentSong = (currentSong - 1 + songs.length) % songs.length;
    loadSong();
    playCurrent();
};

const closePlaylist = (restoreFocus = true) => {
    playerContainer.classList.remove("is-playlist-open");
    playlistToggle.setAttribute("aria-expanded", "false");
    if (restoreFocus) {
        playlistToggle.focus();
    }
};

const selectSong = (index) => {
    currentSong = index;
    loadSong();
    playCurrent();
    closePlaylist(false);
    playToggle.focus();
};

const buildPlaylist = () => {
    const fragment = document.createDocumentFragment();

    songs.forEach((song, index) => {
        const item = document.createElement("li");
        const button = document.createElement("button");
        button.type = "button";
        button.className = "playlist__item";
        button.dataset.index = String(index);
        button.textContent = `${song.artist} - ${song.title}`;
        button.addEventListener("click", () => selectSong(index));
        item.append(button);
        fragment.append(item);
    });

    playlistList.replaceChildren(fragment);
};

playlistToggle.addEventListener("click", () => {
    playerContainer.classList.add("is-playlist-open");
    playlistToggle.setAttribute("aria-expanded", "true");
    playlistBack.focus();
});

playlistBack.addEventListener("click", () => closePlaylist());

playToggle.addEventListener("click", () => {
    if (audioPlayer.paused) {
        playCurrent();
    } else {
        audioPlayer.pause();
    }
});

nextButton.addEventListener("click", nextSong);
previousButton.addEventListener("click", previousSong);

progress.addEventListener("input", () => {
    if (!Number.isFinite(audioPlayer.duration) || audioPlayer.duration <= 0) {
        return;
    }
    audioPlayer.currentTime = (Number(progress.value) / 100) * audioPlayer.duration;
});

audioPlayer.addEventListener("play", () => setPlaying(true));
audioPlayer.addEventListener("pause", () => setPlaying(false));
audioPlayer.addEventListener("ended", nextSong);
audioPlayer.addEventListener("timeupdate", () => {
    if (!Number.isFinite(audioPlayer.duration) || audioPlayer.duration <= 0) {
        return;
    }
    const percentage = Math.min(100, (audioPlayer.currentTime / audioPlayer.duration) * 100);
    progress.value = String(percentage);
    progressFill.value = percentage;
    progress.setAttribute("aria-valuetext", `${Math.round(percentage)}%`);
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && playerContainer.classList.contains("is-playlist-open")) {
        closePlaylist();
    }
});

buildPlaylist();
loadSong();
