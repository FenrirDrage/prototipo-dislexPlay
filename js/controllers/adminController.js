const API_USERS = "http://localhost:3000/users";
const API_EX = "http://localhost:3000/exercises";

// proteção
const user = JSON.parse(localStorage.getItem("user"));

if (!user || !user.isAdmin) {
  window.location.href = "index.html";
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
        <div class="col-md-3">
          <button class="btn btn-primary w-100" onclick="showExerciseForm('complete')">
            Completar
          </button>
        </div>

        <div class="col-md-3">
          <button class="btn btn-warning w-100" onclick="showExerciseForm('quiz')">
            Quiz
          </button>
        </div>

        <div class="col-md-3">
          <button class="btn btn-info w-100" onclick="showExerciseForm('image')">
            Imagem
          </button>
        </div>

        <div class="col-md-3">
          <button class="btn btn-success w-100" onclick="showExerciseForm('sopa')">
            Sopa Letras
          </button>
        </div>
      </div>

      <div id="exerciseForm" class="mt-4"></div>

      <!-- LISTA -->
      <div id="exerciseList" class="mt-4"></div>
    </div>
  `;

  loadExercises();
  }

  if (section === "words") {
  container.innerHTML = `
    <div class="card p-3">
      <h5>Palavras</h5>

      <div class="row">
        <div class="col-md-4">
          <input id="newWord" class="form-control mb-2" placeholder="Palavra">
        </div>

        <div class="col-md-4">
          <input type="file" id="newImage" class="form-control mb-2" accept="image/*">
        </div>

        <div class="col-md-3">
          <select id="newDifficulty" class="form-control mb-2">
            <option value="easy">Fácil</option>
            <option value="medium">Médio</option>
            <option value="hard">Difícil</option>
          </select>
        </div>

        <div class="col-md-1">
          <button type="button" class="btn btn-success w-100" onclick="addWord(event)">+</button>
        </div>
      </div>

      <div id="wordsList" class="mt-4"></div>
    </div>
  `;

  loadWordsList();
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
    <h6>Exercício: ${type.toUpperCase()}</h6>

    <input id="title" class="form-control mb-2" placeholder="Título">

    <select id="difficulty" class="form-control mb-2">
      <option value="easy">Fácil</option>
      <option value="medium">Médio</option>
      <option value="hard">Difícil</option>
    </select>

    ${type === "sopa" ? `
      <input id="size" type="number" class="form-control mb-2" placeholder="Tamanho da grelha">
    ` : ""}

    <select id="wordsSelect" multiple class="form-control mb-2"></select>

    <button class="btn btn-success" onclick="createExercise('${type}')">
      Guardar
    </button>
  `;

  loadWords();
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


//
//EXERCICIOS
//

//criar exercício
async function createExercise(type) {
  const title = document.getElementById("title").value;
  const difficulty = document.getElementById("difficulty").value;
  const size = document.getElementById("size")?.value;

  const wordIds = getSelectedWords();

  const ex = {
    title,
    type,
    difficulty,
    size: size ? parseInt(size) : undefined,
    wordIds
  };

  if (window.currentEditId) {
    // UPDATE
    await fetch(`http://localhost:3000/exercises/${window.currentEditId}`, {
      method: "PUT",
      body: JSON.stringify(ex),
      headers: { "Content-Type": "application/json" }
    });

    alert("Exercício atualizado!");
    window.currentEditId = null;

  } else {
    // CREATE
    await fetch("http://localhost:3000/exercises", {
      method: "POST",
      body: JSON.stringify(ex),
      headers: { "Content-Type": "application/json" }
    });

    alert("Exercício criado!");
  }

  loadExercises();
}

//load exercícios
async function loadExercises() {
  const res = await fetch("http://localhost:3000/exercises");
  const exercises = await res.json();

  const container = document.getElementById("exerciseList");
  container.innerHTML = "";

  exercises.forEach(ex => {
    const card = document.createElement("div");
    card.className = "card p-2 mb-2";

    card.innerHTML = `
      <b>${ex.title}</b> (${ex.type}) - ${ex.difficulty}
      <div class="mt-2">
        <button class="btn btn-sm btn-warning" onclick="editExercise('${ex.id}')">Editar</button>
        <button class="btn btn-sm btn-danger" onclick="deleteExercise('${ex.id}')">Apagar</button>
      </div>
    `;

    container.appendChild(card);
  });
}

//editar exercício
async function editExercise(id) {
  const resEx = await fetch(`http://localhost:3000/exercises/${id}`);
  const ex = await resEx.json();

  const resWords = await fetch("http://localhost:3000/words");
  const words = await resWords.json();

  showExerciseForm(ex.type);

  // preencher campos básicos
  document.getElementById("title").value = ex.title;
  document.getElementById("difficulty").value = ex.difficulty;

  if (ex.size) {
    document.getElementById("size").value = ex.size;
  }

  // carregar select de palavras
  loadWordsSelect(words, ex.wordIds);

  // guardar ID para update
  window.currentEditId = id;
}

//guardar exercício
function getSelectedWords() {
  const select = document.getElementById("wordsSelect");

  if (!select) return []; // segurança

  return Array.from(select.selectedOptions).map(opt => opt.value);
}

//render palavra
function renderWord(w) {
  const container = document.getElementById("wordsList");

  const div = document.createElement("div");
  div.className = "card p-2 mb-2 d-flex justify-content-between align-items-center";

  div.innerHTML = `
    <div class="d-flex align-items-center gap-3">
      <img src="${w.image}" width="40" height="40" style="object-fit:cover;">
      <span>${w.word} (${w.difficulty})</span>
    </div>

    <button type="button" class="btn btn-danger btn-sm" onclick="deleteWord(event, this, '${w.id}')">
      X
    </button>
  `;

  container.appendChild(div);
}

//preselecionar select
function loadWordsSelect(words, selectedIds = []) {
  const select = document.getElementById("wordsSelect");
  select.innerHTML = "";

  words.forEach(w => {
    const option = document.createElement("option");
    option.value = w.id;
    option.textContent = `${w.word} (${w.difficulty})`;

    if (selectedIds.includes(w.id)) {
      option.selected = true;
    }

    select.appendChild(option);
  });
}

//apagar exercício
async function deleteExercise(id) {
  await fetch(`http://localhost:3000/exercises/${id}`, {
    method: "DELETE"
  });

  loadExercises();
}

//
//PALAVRAS
//

//adicionar palavra
async function addWord(event) {
  
  // prevenir comportamento default do form e propagação do clique
  event.preventDefault();
  event.stopPropagation();

  const word = document.getElementById("newWord").value.toUpperCase();
  const image = document.getElementById("newImage").value;
  const difficulty = document.getElementById("newDifficulty").value;

  if (!word) {
    alert("Escreve uma palavra!");
    return;
  }

  const newWord = {
    word,
    image,
    difficulty
  };

  const res = await fetch("http://localhost:3000/words", {
    method: "POST",
    body: JSON.stringify(newWord),
    headers: { "Content-Type": "application/json" }
  });

  const savedWord = await res.json();

  // limpar campos (bónus UX)
  document.getElementById("newWord").value = "";
  document.getElementById("newImage").value = "";

  //loadWordsList();
  
  renderWord(savedWord)
}

//apagar palavra
async function deleteWord(event, btn, id) {
  
  event.preventDefault();
  event.stopPropagation();
  
  // encontra o card
  const card = btn.closest(".card");

  //  efeito fade
  card.style.transition = "0.2s";
  card.style.opacity = "0";

  // espera o fade terminar
  setTimeout(async () => {

    //apaga da BD
    await fetch(`http://localhost:3000/words/${id}`, {
      method: "DELETE"
    });

    // 🧹 remove do DOM
    card.remove();
  }, 200);
}

//load palavras
async function loadWords() {
  const res = await fetch("http://localhost:3000/words");
  const words = await res.json();

  loadWordsSelect(words);
}

//load palavras para listagem
async function loadWordsList() {
  
  const res = await fetch("http://localhost:3000/words");
  const words = await res.json();

  const container = document.getElementById("wordsList");
  container.innerHTML = "";

  words.forEach(w => {
    const div = document.createElement("div");
    div.className = "card p-2 mb-2 d-flex justify-content-between align-items-center";

    div.innerHTML = `
      <div class="d-flex align-items-center gap-3">
        <img src="${w.image}" width="40" height="40" style="object-fit:cover;">
        <span>${w.word} (${w.difficulty})</span>
      </div>

      <button class="btn btn-danger btn-sm" onclick="deleteWord(event, this, '${w.id}')">
        X
      </button>
    `;

    container.appendChild(div);
  });
}

// estatísticas
async function loadStats() {
   const resUsers = await fetch("http://localhost:3000/users");
  const users = await resUsers.json();

  const resEx = await fetch("http://localhost:3000/exercises");
  const exercises = await resEx.json();

  const totalUsers = users.length-1; // subtrair admin

  const totalPoints = users.reduce((sum, u) => sum + (u.points || 0), 0);
  const avgPoints = Math.floor(totalPoints / totalUsers);

  const topUser = users.reduce((max, u) =>
    u.points > (max?.points || 0) ? u : max, {}
  );

  const totalExercises = exercises.length;

  document.getElementById("statsText").innerHTML = `
    Utilizadores: <b>${totalUsers}</b><br>
    Exercícios: <b>${totalExercises}</b><br>
    Média pontos: <b>${avgPoints}</b><br>
    Top jogador: <b>${topUser.name || "N/A"}</b>
  `;
}

// upload imagem
function handleImageUpload() {
const fileInput = document.getElementById("imageFile");
const file = fileInput.files[0];

if (!file) {
  //alert("Seleciona uma imagem");
  return;
}

// validar tipo
if (!["image/png", "image/jpeg"].includes(file.type)) {
  alert("Só JPG ou PNG");
  return;
}

// validar tamanho (250x250)
const img = new Image();
img.onload = async () => {

  if (img.width > 250 || img.height > 250) {
    alert("Max 250x250!");
    return;
  }

  // 🔥 enviar para backend
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch("http://localhost:3000/upload", {
    method: "POST",
    body: formData
  });

  const data = await res.json();

  const imagePath = data.path;

  // 👉 agora guardas na BD
  saveWord(imagePath);

};

img.src = URL.createObjectURL(file);
}
async function saveWord(imagePath) {

  const word = document.getElementById("newWord").value;
  const difficulty = document.getElementById("newDifficulty").value;

  await fetch("http://localhost:3000/words", {
    method: "POST",
    body: JSON.stringify({
      word,
      difficulty,
      image: imagePath
    }),
    headers: { "Content-Type": "application/json" }
  });

  alert("Palavra criada!");
}

function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}