const API_USERS = "http://localhost:3000/users";
const API_EX = "http://localhost:3000/exercises";

// proteção
const user = JSON.parse(localStorage.getItem("user"));

if (!user || !user.isAdmin) {
  window.location.href = "index.html";
}

// ver users
async function loadUsers() {
  const res = await fetch(API_USERS);
  const data = await res.json();

  const list = document.getElementById("userList");
  list.innerHTML = "";

  data.forEach(u => {
    const li = document.createElement("li");
    li.innerText = u.name + " - " + u.points + " pts";
    list.appendChild(li);
  });
}

// criar exercício
async function createExercise() {
  const ex = {
    title: document.getElementById("title").value,
    type: document.getElementById("type").value
  };

  await fetch(API_EX, {
    method: "POST",
    body: JSON.stringify(ex),
    headers: { "Content-Type": "application/json" }
  });

  alert("Exercício criado!");
}

function showSection(section) {

  const container = document.getElementById("adminContent");

  if (section === "users") {
    container.innerHTML = `
      <div class="card p-3">
        <h5>Utilizadores</h5>
        <ul id="userList" class="list-group"></ul>
      </div>
    `;
    loadUsers();
  }

  if (section === "exercises") {
    container.innerHTML = `
      <div class="card p-3">
        <h5>Tipos de Exercícios</h5>

        <div class="row mt-3">
          <div class="col-md-4">
            <button class="btn btn-primary w-100" onclick="showExerciseForm('a')">
              Texto Embaralhado
            </button>
          </div>

          <div class="col-md-4">
            <button class="btn btn-warning w-100" onclick="showExerciseForm('b')">
              Texto Desfocado
            </button>
          </div>

          <div class="col-md-4">
            <button class="btn btn-info w-100" onclick="showExerciseForm('c')">
              Tarefas
            </button>
          </div>
        </div>

        <div id="exerciseForm" class="mt-4"></div>
      </div>
    `;
  }

  if (section === "stats") {
    container.innerHTML = `
      <div class="card p-3">
        <h5>Estatísticas</h5>
        <p id="statsText"></p>
      </div>
    `;
    loadStats();
  }
}

function showExerciseForm(type) {

  const form = document.getElementById("exerciseForm");

  form.innerHTML = `
    <h6>Criar exercício tipo ${type.toUpperCase()}</h6>

    <input id="title" class="form-control mb-2" placeholder="Título">

    <select id="difficulty" class="form-control mb-2">
      <option value="easy">Fácil</option>
      <option value="medium">Médio</option>
      <option value="hard">Difícil</option>
    </select>

    <button class="btn btn-success" onclick="createExercise('${type}')">
      Criar
    </button>
  `;
}

async function createExercise(type) {

  const title = document.getElementById("title").value;
  const difficulty = document.getElementById("difficulty").value;

  const ex = {
    title,
    type,
    difficulty
  };

  await fetch("http://localhost:3000/exercises", {
    method: "POST",
    body: JSON.stringify(ex),
    headers: { "Content-Type": "application/json" }
  });

  alert("Exercício criado! 🎉");
}

async function loadUsers() {
  const res = await fetch("http://localhost:3000/users");
  const users = await res.json();

  const list = document.getElementById("userList");
  list.innerHTML = "";

  users.forEach(u => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between";

    li.innerHTML = `
    ${u.name} - ${u.points} pts
    ${
      !u.isAdmin
        ? `<button class="btn btn-danger btn-sm" onclick="deleteUser('${u.id}')">Delete</button>`
        : `<span class="badge bg-warning">ADMIN</span>`
    }
    `;

    list.appendChild(li);
  });
}

async function deleteUser(id) {
  await fetch(`http://localhost:3000/users/${id}`, {
    method: "DELETE"
  });

  loadUsers();
}

async function loadStats() {
  const res = await fetch("http://localhost:3000/users");
  const users = await res.json();

  const avg =
    users.reduce((sum, u) => sum + (u.points || 0), 0) / users.length;

  document.getElementById("statsText").innerText =
    "Média de pontos diarios ganhos: " + Math.floor(avg);
}

function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}