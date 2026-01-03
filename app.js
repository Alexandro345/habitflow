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
    reminderHour: 9 // 9 AM por defecto
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
      li.style.textDecoration = "line-through";
      li.style.opacity = "0.6";
    }

    li.addEventListener("click", () => toggleHabit(index));
    habitList.appendChild(li);
  });
}

function toggleHabit(index) {
  const habit = habits[index];
  const today = new Date().toDateString();

  // Si ya fue completado hoy, no hacer nada
  if (habit.completed && habit.lastCompleted === today) return;

  habit.completed = true;

  // Lógica de racha
  if (habit.lastCompleted) {
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    if (habit.lastCompleted === yesterday) {
      habit.streak += 1;
    } else {
      habit.streak = 1;
    }
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

function checkReminders() {
  const now = new Date();
  const currentHour = now.getHours();

  habits.forEach(habit => {
    if (!habit.completed && habit.reminderHour === currentHour) {
      alert(`⏰ Recuerda tu hábito: ${habit.name}`);
    }
  });
}

renderHabits();
checkReminders();
