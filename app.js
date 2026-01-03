/* ===== HÁBITOS ===== */
let habits = JSON.parse(localStorage.getItem("habits")) || [];

function saveHabits() { localStorage.setItem("habits", JSON.stringify(habits)); }

function renderHabits() {
  const habitList = document.getElementById("habitList");
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
  } else habit.streak = 1;
  habit.lastCompleted = today;
  saveHabits();
  renderHabits();
}

renderHabits();

/* ===== SERVICE WORKER ===== */
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js")
    .then(()=>console.log("✅ Service Worker registrado"))
    .catch(err=>console.error("❌ SW error", err));
}

/* ===== PESTAÑAS ===== */
const navButtons = document.querySelectorAll(".bottom-nav button");
const tabs = document.querySelectorAll(".tab");
navButtons.forEach(btn => btn.addEventListener("click", () => {
  const target = btn.dataset.tab;
  tabs.forEach(t => t.classList.remove("active"));
  document.getElementById(target).classList.add("active");
  navButtons.forEach(b=>b.classList.remove("active"));
  btn.classList.add("active");
}));
document.querySelector('.bottom-nav button[data-tab="habits"]').classList.add("active");

/* ===== TOGGLES CONFIGURACIÓN ===== */
const darkModeToggle = document.getElementById("darkModeToggle");
if(localStorage.getItem("darkMode")==="enabled"){ document.body.classList.add("dark-mode"); darkModeToggle.checked=true; }
darkModeToggle.addEventListener("change",()=> {
  if(darkModeToggle.checked){ document.body.classList.add("dark-mode"); localStorage.setItem("darkMode","enabled"); }
  else{ document.body.classList.remove("dark-mode"); localStorage.setItem("darkMode","disabled"); }
});

const notifyToggle = document.getElementById("notifyToggle");
if(localStorage.getItem("notifications")==="enabled") notifyToggle.checked=true;
notifyToggle.addEventListener("change", async ()=>{
  if(notifyToggle.checked){
    const permission = await Notification.requestPermission();
    if(permission==="granted"){ localStorage.setItem("notifications","enabled"); alert("🔔 Recordatorios activados"); }
    else{ notifyToggle.checked=false; localStorage.setItem("notifications","disabled"); alert("❌ Permiso denegado"); }
  } else{ localStorage.setItem("notifications","disabled"); }
});

/* ===== RECORDATORIOS AUTOMÁTICOS ===== */
setInterval(()=>{
  if(notifyToggle.checked && "Notification" in window){
    const now = new Date();
    const hour = now.getHours();
    const today = new Date().toDateString();
    habits.forEach(habit=>{
      if(!habit.lastCompleted || habit.lastCompleted!==today){
        if(habit.reminderHour===hour){ new Notification("⏰ HabitFlow",{ body:`Recuerda: ${habit.name}` }); }
      }
    });
  }
},60000);

// ===== MENU ORDENAR HÁBITOS (abrir/cerrar con un solo botón) =====
const menuBtn = document.getElementById("menuBtn");
const sortTab = document.getElementById("sortHabits");
const sortList = document.getElementById("sortList");

// Abrir o cerrar la pestaña al presionar el mismo botón
menuBtn.addEventListener("click", () => {
  const isActive = sortTab.classList.contains("active");
  sortTab.classList.toggle("active", !isActive);
  menuBtn.classList.toggle("active", !isActive);

  // Si se abre, renderizamos la lista
  if (!isActive) renderSortList();
});

// Función para renderizar lista de hábitos
function renderSortList() {
  sortList.innerHTML = "";
  if (habits.length === 0) {
    const li = document.createElement("li");
    li.textContent = "No hay hábitos aún";
    sortList.appendChild(li);
    return;
  }

  habits.forEach((habit, index) => {
    const li = document.createElement("li");
    li.textContent = habit.name;

    // Botón eliminar
    const delBtn = document.createElement("button");
    delBtn.classList.add("delete-btn");
    delBtn.textContent = "–";

    delBtn.addEventListener("click", () => {
      habits.splice(index, 1);
      saveHabits();
      renderSortList();
      renderHabits();
    });

    li.appendChild(delBtn);
    sortList.appendChild(li);
  });
}

/* ===== PESTAÑA AGREGAR HÁBITO ===== */
const addBtn = document.getElementById("addBtn");

const addTab = document.createElement("section");
addTab.id = "addHabitTab";
addTab.classList.add("tab","sort-tab","add-tab");
addTab.innerHTML=`
  <div class="sort-header">
    <h2>Nuevo Hábito</h2>
    <button id="closeAdd" class="close-btn"><img src="close-icon.png" alt="Cerrar"></button>
  </div>
  <input id="newHabitInput" type="text" placeholder="Escribe tu hábito">
  <button id="saveHabit" class="add-confirm">Agregar</button>
`;
document.body.appendChild(addTab);

const closeAdd = document.getElementById("closeAdd");
const saveHabit = document.getElementById("saveHabit");
const newHabitInput = document.getElementById("newHabitInput");

addBtn.addEventListener("click",()=>{
  addTab.classList.add("active");
  addTab.offsetHeight; // forzar reflow
  addTab.style.bottom = "0";
  newHabitInput.focus();
});

closeAdd.addEventListener("click",()=>{
  addTab.style.bottom = "-100%";
  setTimeout(()=>addTab.classList.remove("active"), 400);
});

saveHabit.addEventListener("click",()=>{
  const text = newHabitInput.value.trim();
  if(!text) return;

  habits.push({ name:text, completed:false, streak:0, lastCompleted:null, reminderHour:9 });
  newHabitInput.value="";
  addTab.style.bottom = "-100%";
  setTimeout(()=>addTab.classList.remove("active"), 400);
  saveHabits();
  renderHabits();
});
