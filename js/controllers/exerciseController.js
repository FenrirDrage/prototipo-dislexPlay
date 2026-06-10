import { getWords } from "../models/wordModel.js";

const params = new URLSearchParams(window.location.search);
const type = params.get("type");

const title = document.getElementById("exerciseTitle");
const name = document.getElementById("exerciseName");
const desc = document.getElementById("exerciseDesc");
const canvas = document.getElementById("canvas");

let currentWord = null;

// garantir que estamos na página certa
if (!canvas) {
  console.log("Não está na página de exercício");
} else {
  window.addEventListener("DOMContentLoaded", () => {
    init();
  });
}

// INIT
async function init() {

  fixCanvasSize();

  const words = await getWords();

  const random = words[Math.floor(Math.random() * words.length)];
  currentWord = random;

  switch (type) {
    case "a":
      setupWordUI();
      startCompleteWord(random);
      break;

    case "b":
      setupImageUI();
      startImageMatchGame(random, words);
      break;

    case "c":
      setupQuizUI();
      drawPlaceholder("Quiz em construção");
      break;

    case "d":
      drawPlaceholder("Sopa de letras em construção");
      break;
  }
}

//
// COMPLETAR PALAVRA
//

// configurar UI para completar palavra
function setupWordUI() {
  if (title) title.innerText = "Completa a Palavra";
  if (name) name.innerText = "Descobre a palavra";
  if (desc) desc.innerText = "Completa a palavra escondida.";
}

// iniciar jogo de completar palavra
function startCompleteWord(wordObj) {
  const masked = maskWord(wordObj.word);
  drawWord(masked);

  setupInputValidation(wordObj.word);
}

// mascara a palavra com "_" aleatoriamente
function maskWord(word) {
  return word
    .split("")
    .map(l => Math.random() < 0.4 ? "_" : l)
    .join(" ");
}

//
// ASSOCIAR IMAGEM (CLIQUE NO CANVAS)
//

// configurar UI para associação imagem-palavra
function setupImageUI() {
  if (title) title.innerText = "Qual é a Imagem?";
  if (name) name.innerText = "Associação Visual";
  if (desc) desc.innerText = "Clica na palavra correta.";
}

// iniciar jogo de associação imagem-palavra
function startImageMatchGame(correct, words) {

  // baralhar palavras
  const shuffled = words
    .map(w => w.word)
    .sort(() => Math.random() - 0.5);

  let options = shuffled.slice(0, 4);

  // garantir que a correta está incluída
  if (!options.includes(correct.word)) {
    options[Math.floor(Math.random() * options.length)] = correct.word;
  }

  drawMatchGame(correct.image, options);
  setupCanvasClick(options, correct.word);
}

//
// CANVAS
//

// ajustar tamanho do canvas para evitar distorção
function fixCanvasSize() {
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
}

// desenhar palavra mascarada
function drawWord(text) {
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#6c63ff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.font = "30px Arial";

  ctx.fillText(text, 20, 100);
}

// desenhar jogo de associação imagem-palavra
function drawMatchGame(imageName, options) {
  const ctx = canvas.getContext("2d");

  const img = new Image();
  img.src = "images/" + imageName;

  img.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // fundo
    ctx.fillStyle = "#6c63ff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // imagem
    ctx.drawImage(img, 100, 20, 150, 100);

    // opções
    options.forEach((opt, i) => {
      const x = 40 + i * 110;
      const y = 150;

      ctx.fillStyle = "white";
      ctx.fillRect(x, y, 100, 30);

      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      ctx.fillText(opt, x + 50, y + 20);
    });
  };
}

// desenhar placeholder para exercícios em construção
function drawPlaceholder(text) {
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#6c63ff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.font = "20px Arial";

  ctx.fillText(text, 20, 100);
}

//
// EVENTOS
//

// validar resposta do input
function setupInputValidation(correctWord) {
  document.getElementById("checkBtn")
    .addEventListener("click", () => {

      const input = document.getElementById("answerInput").value;

      if (input.toLowerCase() === correctWord.toLowerCase()) {
        alert("Acertaste!");
      } else {
        alert("Errado");
      }
    });
}

// validar clique nas opções do jogo de associação
function setupCanvasClick(options, correctWord) {

  canvas.onclick = null; // limpa eventos antigos

  canvas.addEventListener("click", (e) => {

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    options.forEach((opt, i) => {
      const boxX = 40 + i * 110;
      const boxY = 150;

      if (
        x >= boxX &&
        x <= boxX + 100 &&
        y >= boxY &&
        y <= boxY + 30
      ) {
        if (opt === correctWord) {
          alert("Acertaste!");
        } else {
          alert("Errado");
        }
      }
    });

  });
}

// lidar com resultado do exercício (correto ou errado)
async function handleResult(isCorrect) {

  let user = JSON.parse(localStorage.getItem("user"));

  if (!user) return;

  // garantir estruturas
  if (!user.progress) user.progress = { a: 0, b: 0, c: 0, d: 0 };
  if (!user.skillLevel) user.skillLevel = { a: 1, b: 1, c: 1, d: 1 };
  if (!user.history) user.history = [];

  if (isCorrect) {
    user.points += 10;

    user.progress[type] += 20;

    // subir nível
    if (user.progress[type] >= 100) {
      user.progress[type] = 0;
      user.skillLevel[type] += 1;

      alert("Subiste de nível! 🚀");
    }

    user.history.push({
      type: type,
      result: "success",
      date: new Date().toISOString()
    });

  } else {

    user.history.push({
      type: type,
      result: "fail",
      date: new Date().toISOString()
    });

  }

  // nível global
  user.level = Math.floor(user.points / 50) + 1;

  // guardar local
  localStorage.setItem("user", JSON.stringify(user));

  // atualizar JSON Server
  await fetch(`http://localhost:3000/users/${user.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user)
  });
}