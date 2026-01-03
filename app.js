const habitList = document.getElementById("habitList");
const addHabitBtn = document.getElementById("addHabitBtn");

let habits = JSON.parse(localStorage.getItem("habits")) || [];

function saveHabits() {
  localStorage.setItem("habits", JSON.stringify(habits));
}

function renderHabits() {
  habitList.innerHTML = "";

  habits.forEach((habit, index) => {
    const li = document.createElement("li");
    li.className = "habit";

    li.innerHTML = `
      <span>${habit.name}</span>
      <input type="checkbox" ${habit.done ? "checked" : ""}>
    `;

    li.querySelector("input").addEventListener("change", () => {
      habit.done = !habit.done;
      saveHabits();
    });

    habitList.appendChild(li);
  });
}

addHabitBtn.addEventListener("click", () => {
  const name = prompt("Nombre del hábito:");
  if (!name) return;

  habits.push({ name, done: false });
  saveHabits();
  renderHabits();
});

renderHabits();

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}