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
    // Reset visual diario
    if (habit.lastCompleted !== today) {
      habit.completed = false;
    }

    const li = document.createElement("li");
    li.textContent = `${habit.name} 🔥 ${habit.streak}`;

    if (habit.completed) {
      li.classList.add("completed");
    }

    li.addEventListener("click", () => toggleHabit(index));
    habitList.appendChild(li);
  });
}

function toggleHabit(index) {
  const habit = habits[index];
  const today = new Date().toDateString();

  // Evitar doble check el mismo día
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

if ("Notification" in window) {
  Notification.requestPermission();
}

setInterval(() => {
  const now = new Date();
  const hour = now.getHours();

  habits.forEach(habit => {
    const today = new Date().toDateString();
    if (!habit.history[today] && habit.reminderHour === hour) {
      new Notification("⏰ HabitFlow", {
        body: `Recuerda: ${habit.name}`
      });
    }
  });
}, 60000);

const notifyBtn = document.getElementById("notifyBtn");

if (notifyBtn) {
  notifyBtn.addEventListener("click", async () => {
    console.log("Botón presionado");

    const permission = await Notification.requestPermission();
    console.log("Permiso:", permission);

    if (permission === "granted") {
      alert("🔔 Recordatorios activados");
    } else if (permission === "denied") {
      alert("❌ Permiso denegado");
    }
  });
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js")
    .then(() => console.log("✅ Service Worker registrado"))
    .catch(err => console.error("❌ SW error", err));
}

// Cambiar entre pestañas
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
