const params = new URLSearchParams(window.location.search);
const type = params.get("type");

const title = document.getElementById("exerciseTitle");
const name = document.getElementById("exerciseName");
const desc = document.getElementById("exerciseDesc");
const canvas = document.getElementById("canvas");

if (!type) {
  window.location.href = "dashboard.html";
}

// CONFIGURAR EXERCÍCIO
if (type === "a") {
  title.innerText = "Completa a Palavra";
  name.innerText = "Palavra com Letras Trocadas";
  desc.innerText = "Treina reconhecimento de palavras e flexibilidade cognitiva.";

  drawScrambledTextCanvas(canvas);
}

if (type === "b") {
  title.innerText = "Qual é a Imagem?";
  name.innerText = "Associação Visual";
  desc.innerText = "Treina memória visual e associação de conceitos.";

  drawBlurCanvas(canvas);
}

if (type === "c") {
  title.innerText = "Quizz";
  name.innerText = "Qual a Resposta Correta?";
  desc.innerText = "Treina conhecimento geral e tomada de decisão rápida.";

  drawTasksCanvas(canvas);
}

if (type === "d") {
  title.innerText = "Sopa de Letras";
  name.innerText = "Encontra as Palavras";
  desc.innerText = "Treina atenção, reconhecimento de padrões e vocabulário.";

  drawTasksCanvas(canvas);
}

// GAMIFICAÇÃO
const API = "http://localhost:3000/users";

/*
async function completeExercise() {

  let user = JSON.parse(localStorage.getItem("user"));
  const params = new URLSearchParams(window.location.search);
  const type = params.get("type");

  // atualizar progresso por tipo
  user.progress[type] += 10;

  if (user.progress[type] >= 100) {
    user.progress[type] = 0;

    // subir nível nesse tipo
    if (!user.skillLevel) user.skillLevel = { a: 1, b: 1, c: 1 };

    user.skillLevel[type] += 1;

    alert("Subiste de nível no exercício " + type.toUpperCase());
  }

  // pontos
  user.points += 10;

  // nível
  user.level = Math.floor(user.points / 50) + 1;

  // histórico
  user.history.push({
    type: type,
    date: new Date().toISOString(),
    result: "success"
  });

  // atualizar no JSON Server
  await fetch(`${API}/${user.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(user)
  });

  // atualizar local
  localStorage.setItem("user", JSON.stringify(user));

  alert("+10 pontos! Boa!");

  window.location.href = "dashboard.html";
  
}*/

let currentWord;

async function loadCompleteExercise() {

  let user = JSON.parse(localStorage.getItem("user"));

  const res = await fetch(API_WORDS);
  const words = await res.json();

  // 🎯 escolher dificuldade com base no nível
  let difficulty = "easy";

  if (user.skillLevel.a >= 3) difficulty = "medium";
  if (user.skillLevel.a >= 5) difficulty = "hard";

  const filtered = words.filter(w => w.difficulty === difficulty);

  currentWord = filtered[Math.floor(Math.random() * filtered.length)];

  generateMaskedWord(currentWord.word);
}

function generateMaskedWord(word) {

  let masked = word.split("").map(letter => {
    return Math.random() < 0.5 ? "_" : letter;
  });

  document.getElementById("question").innerText = masked.join(" ");
}

function checkAnswer() {

  const answer = document.getElementById("answerInput").value.toUpperCase();

  const correct = answer === currentWord.word;

  completeExercise(correct);
}