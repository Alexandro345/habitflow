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
    completed: false
  });

  habitInput.value = "";
  saveHabits();
  renderHabits();
}

function renderHabits() {
  habitList.innerHTML = "";

  habits.forEach((habit, index) => {
    const li = document.createElement("li");
    li.textContent = habit.name;

    if (habit.completed) {
      li.style.textDecoration = "line-through";
      li.style.opacity = "0.6";
    }

    li.addEventListener("click", () => toggleHabit(index));
    habitList.appendChild(li);
  });
}

function toggleHabit(index) {
  habits[index].completed = !habits[index].completed;
  saveHabits();
  renderHabits();
}

function saveHabits() {
  localStorage.setItem("habits", JSON.stringify(habits));
}

renderHabits();