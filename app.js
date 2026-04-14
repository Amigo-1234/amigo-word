const wordInput = document.getElementById("word");
const meaningInput = document.getElementById("meaning");
const timeInput = document.getElementById("time");
const addBtn = document.getElementById("addBtn");
const cards = document.getElementById("cards");

let words = JSON.parse(localStorage.getItem("words")) || [];
let timers = {};

// Ask permission

// Render UI
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

// Add word
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

function sendNotification(word, meaning) {
  if (Notification.permission === "granted") {
    new Notification("AMIGO 🔴", {
      body: `${word} → ${meaning}`,
      icon: "icon.png"
    });
  } else {
    console.log("No permission");
  }
}

function startTimer(item) {
  const id = item.word + Date.now();

  timers[id] = setInterval(() => {
    sendNotification(item.word, item.meaning);
  }, item.time * 60000);
}

// Restart all timers on load
function initTimers() {
  words.forEach(item => startTimer(item));
}

// Delete word
function deleteWord(index) {
  words.splice(index, 1);
  localStorage.setItem("words", JSON.stringify(words));
  location.reload(); // simple reset
}

const testBtn = document.getElementById("testBtn");

testBtn.addEventListener("click", async () => {
  const permission = await Notification.requestPermission();

  if (permission === "granted") {
    new Notification("AMIGO 🔴", {
      body: "Test notification working 🚀",
      icon: "icon.png"
    });
  } else {
    alert("Notification permission denied ❌");
  }
});

// Init
render();
initTimers();

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js")
    .then(() => console.log("SW registered"));
}