
"use strict";

// ===================================
// NASKAH CERITA AL
// ===================================

const story = [
  {
    scene: "ADEGAN 1 · ASAL-USUL AL",
    text: "Namaku AL. Aku berasal dari Desa Cipeuteuy, tempat sederhana yang menyimpan banyak kenangan dalam hidupku."
  },
  {
    scene: "ADEGAN 2 · MIMPI DAN HARAPAN",
    text: "Sejak dahulu, aku memiliki sebuah mimpi besar. Aku ingin melanjutkan pendidikan, menambah ilmu, dan membuat keluargaku bangga."
  },
  {
    scene: "ADEGAN 3 · MEMULAI PERJALANAN",
    text: "Untuk meraih mimpi itu, aku harus berani meninggalkan zona nyaman. Ada rasa takut dan keraguan, tetapi aku memilih untuk tetap melangkah."
  },
  {
    scene: "ADEGAN 4 · KEHIDUPAN MAHASISWA",
    text: "Dunia perkuliahan memberiku banyak pengalaman baru. Aku belajar di kelas, mengerjakan tugas, bertemu teman, dan memahami arti tanggung jawab."
  },
  {
    scene: "ADEGAN 5 · MENGHADAPI TANTANGAN",
    text: "Perjalanan ini tidak selalu mudah. Ada tugas yang menumpuk, rasa lelah, dan saat-saat ketika aku hampir menyerah. Namun, aku terus mencoba."
  },
  {
    scene: "ADEGAN 6 · MASA DEPAN",
    text: "Aku percaya bahwa setiap usaha memiliki arti. Perjalanan menuju cita-cita membutuhkan waktu, kesabaran, dan keberanian. Aku AL, dan aku akan terus melangkah."
  }
];

// ===================================
// MENGAMBIL ELEMEN HTML
// ===================================

const characterWrap = document.getElementById("characterWrap");
const subtitle = document.getElementById("subtitle");
const sceneName = document.getElementById("sceneName");
const counter = document.getElementById("counter");
const status = document.getElementById("status");

const playBtn = document.getElementById("playBtn");
const pauseBtn = document.getElementById("pauseBtn");
const stopBtn = document.getElementById("stopBtn");
const voiceSelect = document.getElementById("voiceSelect");

const speedInput = document.getElementById("speed");
const volumeInput = document.getElementById("volume");
const speedValue = document.getElementById("speedValue");
const volumeValue = document.getElementById("volumeValue");
const storyList = document.getElementById("storyList");

// ===================================
// STATUS PEMUTARAN
// ===================================

let voices = [];
let currentIndex = 0;
let playbackId = 0;
let paused = false;
let nextTimer = null;

// ===================================
// MENAMPILKAN NASKAH
// ===================================

story.forEach((part) => {
  const li = document.createElement("li");
  li.textContent = part.text;
  storyList.appendChild(li);
});

// ===================================
// MEMUAT PILIHAN SUARA
// ===================================

function loadVoices() {
  if (!("speechSynthesis" in window)) return;

  const previousVoice = voiceSelect.value;
  voices = window.speechSynthesis.getVoices();
  voiceSelect.replaceChildren();

  if (voices.length === 0) {
    voiceSelect.add(new Option("Suara belum tersedia", ""));
    return;
  }

  const indonesianVoices = voices.filter((voice) =>
    voice.lang.toLowerCase().startsWith("id")
  );

  const availableVoices =
    indonesianVoices.length > 0
      ? indonesianVoices
      : voices;

  availableVoices.forEach((voice) => {
    voiceSelect.add(
      new Option(
        `${voice.name} (${voice.lang})`,
        voice.name
      )
    );
  });

  const selected =
    availableVoices.find(
      (voice) => voice.name === previousVoice
    ) || availableVoices[0];

  voiceSelect.value = selected.name;
}

if ("speechSynthesis" in window) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;
} else {
  playBtn.disabled = true;
  status.textContent =
    "TTS tidak tersedia. Gunakan Chrome atau Edge terbaru.";
}

// ===================================
// FUNGSI TAMPILAN
// ===================================

function setTalking(value) {
  characterWrap.classList.toggle("talking", value);
}

function updateControls(playing) {
  playBtn.disabled = playing;
  pauseBtn.disabled = !playing;
  stopBtn.disabled = !playing;
  pauseBtn.textContent = paused ? "▶ Lanjut" : "Ⅱ Jeda";
}

function updateScene(part) {
  sceneName.textContent = part.scene;
  subtitle.textContent = part.text;
  counter.textContent =
    `${currentIndex + 1} / ${story.length}`;
}

// ===================================
// MEMUTAR NARASI
// ===================================

function speakCurrent(id) {
  if (id !== playbackId || paused) return;

  if (currentIndex >= story.length) {
    finishStory(id);
    return;
  }

  const part = story[currentIndex];

  updateScene(part);
  setTalking(false);

  const utterance = new SpeechSynthesisUtterance(
    part.text
  );

  const voice = voices.find(
    (item) => item.name === voiceSelect.value
  );

  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang;
  } else {
    utterance.lang = "id-ID";
  }

  utterance.rate = Number(speedInput.value);
  utterance.volume = Number(volumeInput.value);
  utterance.pitch = 0.95;

  utterance.onstart = () => {
    if (id !== playbackId) return;

    setTalking(true);
    status.textContent =
      `AL sedang berbicara · Adegan ${currentIndex + 1}`;
  };

  utterance.onend = () => {
    if (id !== playbackId) return;

    setTalking(false);
    currentIndex++;

    nextTimer = setTimeout(() => {
      nextTimer = null;
      speakCurrent(id);
    }, 450);
  };

  utterance.onerror = (event) => {
    if (id !== playbackId) return;

    setTalking(false);

    if (
      event.error === "canceled" ||
      event.error === "interrupted"
    ) return;

    status.textContent =
      "Suara gagal diputar. Coba pilih suara lain.";
    playBtn.disabled = false;
    pauseBtn.disabled = true;
    stopBtn.disabled = false;
  };

  window.speechSynthesis.speak(utterance);
}

// ===================================
// MULAI CERITA
// ===================================

function startStory() {
  if (!("speechSynthesis" in window)) {
    status.textContent = "TTS tidak tersedia.";
    return;
  }

  playbackId++;
  const id = playbackId;

  clearTimeout(nextTimer);
  nextTimer = null;

  window.speechSynthesis.cancel();

  currentIndex = 0;
  paused = false;

  setTalking(false);
  updateControls(true);

  status.textContent = "Memulai cerita...";
  speakCurrent(id);
}

// ===================================
// JEDA DAN LANJUTKAN
// ===================================

function togglePause() {
  if (!("speechSynthesis" in window)) return;

  if (!paused) {
    paused = true;

    clearTimeout(nextTimer);
    nextTimer = null;

    window.speechSynthesis.pause();
    setTalking(false);
    status.textContent = "Cerita dijeda.";
  } else {
    paused = false;
    window.speechSynthesis.resume();

    status.textContent = "Melanjutkan cerita...";

    if (!window.speechSynthesis.speaking) {
      speakCurrent(playbackId);
    }
  }

  updateControls(true);
}

// ===================================
// BERHENTI
// ===================================

function stopStory() {
  playbackId++;

  clearTimeout(nextTimer);
  nextTimer = null;

  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }

  paused = false;
  setTalking(false);
  updateControls(false);

  status.textContent = "Cerita dihentikan.";
}

// ===================================
// CERITA SELESAI
// ===================================

function finishStory(id) {
  if (id !== playbackId) return;

  paused = false;
  setTalking(false);

  subtitle.textContent =
    "Terima kasih telah mengikuti perjalananku. " +
    "Jangan pernah berhenti mengejar cita-cita.";

  sceneName.textContent = "PENUTUP";
  counter.textContent =
    `${story.length} / ${story.length}`;

  updateControls(false);
  status.textContent =
    "Cerita selesai. Tekan Mulai untuk mengulang.";
}

// ===================================
// EVENT TOMBOL
// ===================================

playBtn.addEventListener("click", startStory);
pauseBtn.addEventListener("click", togglePause);
stopBtn.addEventListener("click", stopStory);

speedInput.addEventListener("input", () => {
  speedValue.value =
    `${Number(speedInput.value).toFixed(1).replace(".", ",")}×`;
});

volumeInput.addEventListener("input", () => {
  volumeValue.value =
    `${Math.round(Number(volumeInput.value) * 100)}%`;
});

// Nilai awal pengaturan
speedValue.value = "0,9×";
volumeValue.value = "100%";
