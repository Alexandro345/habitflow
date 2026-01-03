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
