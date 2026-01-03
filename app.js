/* ===== HÁBITOS ===== */
const habitInput = document.getElementById("habitInput");
const habitList = document.getElementById("habitList");
const addBtn = document.getElementById("addBtn");

let habits = JSON.parse(localStorage.getItem("habits")) || [];

addBtn.addEventListener("click", addHabit);

function addHabit() {
  const text = habitInput.value.trim();
  if (!text) return;

  habits.push({
    name: text,
    completed: false,
    streak: 0,
    lastCompleted: null,
    reminderHour: 9
  });

  habitInput.value = "";
  saveHabits();
  renderHabits();
}

function renderHabits() {
  habitList.innerHTML = "";
  const today = new Date().toDateString();

  habits.forEach((habit, index) => {
    if (habit.lastCompleted !== today) habit.completed = false;

    const li = document.createElement("li");
    li.textContent = `${habit.name} 🔥 ${habit.streak}`;

    if (habit.completed) li.classList.add("completed");

    li.addEventListener("click", () => toggleHabit(index));
    habitList.appendChild(li);
  });
}

function toggleHabit(index) {
  const habit = habits[index];
  const today = new Date().toDateString();

  if (habit.lastCompleted === today) return;

  habit.completed = true;

  if (habit.lastCompleted) {
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    habit.streak = habit.lastCompleted === yesterday ? habit.streak + 1 : 1;
  } else {
    habit.streak = 1;
  }

  habit.lastCompleted = today;
  saveHabits();
  renderHabits();
}

function saveHabits() {
  localStorage.setItem("habits", JSON.stringify(habits));
}

renderHabits();

/* ===== SERVICE WORKER ===== */
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js")
    .then(() => console.log("✅ Service Worker registrado"))
    .catch(err => console.error("❌ SW error", err));
}

/* ===== CAMBIO DE PESTAÑAS ===== */
const navButtons = document.querySelectorAll(".bottom-nav button");
const tabs = document.querySelectorAll(".tab");

navButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.tab;

    tabs.forEach(tab => tab.classList.remove("active"));
    document.getElementById(target).classList.add("active");

    navButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  });
});

// Por defecto, marcar Hábitos
document.querySelector('.bottom-nav button[data-tab="habits"]').classList.add("active");

/* ===== TOGGLES CONFIGURACIÓN ===== */
const darkModeToggle = document.getElementById("darkModeToggle");
const notifyToggle = document.getElementById("notifyToggle");

// Modo oscuro
if (localStorage.getItem("darkMode") === "enabled") {
  document.body.classList.add("dark-mode");
  darkModeToggle.checked = true;
}

darkModeToggle.addEventListener("change", () => {
  if (darkModeToggle.checked) {
    document.body.classList.add("dark-mode");
    localStorage.setItem("darkMode", "enabled");
  } else {
    document.body.classList.remove("dark-mode");
    localStorage.setItem("darkMode", "disabled");
  }
});

// Notificaciones
if (localStorage.getItem("notifications") === "enabled") {
  notifyToggle.checked = true;
}

// Solicitar permiso al activar el toggle
notifyToggle.addEventListener("change", async () => {
  if (notifyToggle.checked) {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      localStorage.setItem("notifications", "enabled");
      alert("🔔 Recordatorios activados");
    } else {
      notifyToggle.checked = false;
      localStorage.setItem("notifications", "disabled");
      alert("❌ Permiso denegado");
    }
  } else {
    localStorage.setItem("notifications", "disabled");
  }
});

/* ===== RECORDATORIOS AUTOMÁTICOS ===== */
setInterval(() => {
  if (notifyToggle.checked && "Notification" in window) {
    const now = new Date();
    const hour = now.getHours();
    const today = new Date().toDateString();

    habits.forEach(habit => {
      if (!habit.lastCompleted || habit.lastCompleted !== today) {
        if (habit.reminderHour === hour) {
          new Notification("⏰ HabitFlow", {
            body: `Recuerda: ${habit.name}`
          });
        }
      }
    });
  }
}, 60000);
