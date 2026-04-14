// ==============================
// 🔴 AMIGO APP + FIREBASE SETUP
// ==============================

// DOM
const wordInput = document.getElementById("word");
const meaningInput = document.getElementById("meaning");
const timeInput = document.getElementById("time");
const addBtn = document.getElementById("addBtn");
const cards = document.getElementById("cards");
const testBtn = document.getElementById("testBtn");

// STORAGE
let words = JSON.parse(localStorage.getItem("words")) || [];
let timers = {};

// ==============================
// 🔥 FIREBASE CONFIG (CDN VERSION)
// ==============================

// Firebase scripts MUST be in HTML (I’ll show after)

const firebaseConfig = {
  apiKey: "AIzaSyDYpP_Uk52egku25vZ4l4iRfkswlc6U4T0",
  authDomain: "amigo-ai-bc5ac.firebaseapp.com",
  projectId: "amigo-ai-bc5ac",
  storageBucket: "amigo-ai-bc5ac.appspot.com",
  messagingSenderId: "280877895436",
  appId: "1:280877895436:web:bef1e5f9f067d1cab34329"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// ==============================
// 🔔 REQUEST PERMISSION + TOKEN
// ==============================

async function requestPermissionAndToken() {
  const permission = await Notification.requestPermission();

  if (permission === "granted") {
    console.log("Permission granted ✅");

    try {
      const token = await messaging.getToken({
        vapidKey: "BHaUYFnHFOGdr7oTy3L0Ie6Z4gw24mHbprxGsF4I49X1kd4nJkOFNYSaG5K7HsHCSJ2Nbf2-Dp1PvrBpUbvUOsw"
      });

      console.log("🔥 TOKEN:", token);

    } catch (err) {
      console.error("Token error:", err);
    }

  } else {
    alert("Notification permission denied ❌");
  }
}

// ==============================
// 🔘 TEST BUTTON
// ==============================

testBtn.addEventListener("click", () => {
  requestPermissionAndToken();
});

// ==============================
// 🔔 FOREGROUND MESSAGES
// ==============================

messaging.onMessage((payload) => {
  console.log("Message received:", payload);

  new Notification(payload.notification.title, {
    body: payload.notification.body,
    icon: "icon.png"
  });
});

// ==============================
// 📦 RENDER WORDS
// ==============================

function render() {
  cards.innerHTML = "";

  words.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <span class="delete" onclick="deleteWord(${index})">✖</span>
      <h3>${item.word}</h3>
      <p>${item.meaning}</p>
      <span class="badge">Every ${item.time} min</span>
    `;

    cards.appendChild(div);
  });
}

// ==============================
// ➕ ADD WORD
// ==============================

addBtn.addEventListener("click", () => {
  const word = wordInput.value.trim();
  const meaning = meaningInput.value.trim();
  const time = parseInt(timeInput.value);

  if (!word || !meaning || !time) return;

  const newWord = { word, meaning, time };
  words.push(newWord);

  localStorage.setItem("words", JSON.stringify(words));

  startTimer(newWord);

  wordInput.value = "";
  meaningInput.value = "";
  timeInput.value = "";

  render();
});

// ==============================
// ⏱ LOCAL TIMER (TEMP)
// ==============================

function sendNotification(word, meaning) {
  if (Notification.permission === "granted") {
    new Notification("AMIGO 🔴", {
      body: `${word} → ${meaning}`,
      icon: "icon.png"
    });
  }
}

function startTimer(item) {
  const id = item.word + Date.now();

  timers[id] = setInterval(() => {
    sendNotification(item.word, item.meaning);
  }, item.time * 60000);
}

function initTimers() {
  words.forEach(item => startTimer(item));
}

// ==============================
// 🗑 DELETE
// ==============================

function deleteWord(index) {
  words.splice(index, 1);
  localStorage.setItem("words", JSON.stringify(words));
  location.reload();
}

// ==============================
// 🚀 INIT
// ==============================

render();
initTimers();

// ==============================
// ⚙️ SERVICE WORKER
// ==============================

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("firebase-messaging-sw.js")
    .then(() => console.log("Firebase SW registered"));
}