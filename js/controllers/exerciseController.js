import { getWords } from "../models/wordModel.js";

const params = new URLSearchParams(window.location.search);
const type = params.get("type");

const title = document.getElementById("exerciseTitle");
const name = document.getElementById("exerciseName");
const desc = document.getElementById("exerciseDesc");
const canvas = document.getElementById("canvas");

// palavra atual para validação
let currentWord = null;

// contador de tentativas para limitar erros
let attempts = 0;

 // calcular
  function calculatePoints(attempts) {
  if (attempts === 1) return 10;
  if (attempts === 2) return 5;
  return 1;
  }

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
  toggleInputUI(type);

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
      setupImageUI();

      const user = JSON.parse(localStorage.getItem("user"));

      const selectedWords = getWordsForGame(words, user.skillLevel.d);

      const grid = createGrid(10);

      placeWords(grid, selectedWords);
      fillGrid(grid);
      drawGrid(grid);
      setupGridClick(grid);
      break;
  }
}

// mostrar ou esconder input e botão dependendo do tipo de exercício
function toggleInputUI(type) {
  const input = document.getElementById("answerInput");
  const btn = document.getElementById("checkBtn");

  if (!input || !btn) return;

  if (type === "a") {
    // mostrar
    input.style.display = "block";
    btn.style.display = "block";
  } else {
    // esconder
    input.style.display = "none";
    btn.style.display = "none";
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

function setupInputValidation(correctWord) {

  const btn = document.getElementById("checkBtn"); 

  btn.onclick = () => {

    const input = document.getElementById("answerInput").value;

    attempts++; 

    if (input.toLowerCase() === correctWord.toLowerCase()) {

      let points = calculatePoints(attempts);

      alert("Acertaste! +" + points + " XP");

      handleResult(true, points);

      btn.disabled = true; 

    } else {

      alert("Errado tenta outra vez");
    }
  };
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
          handleResult(true);
        } else {
          alert("Errado");
          handleResult(false);
        }
      }
    });

  });
}

// lidar com resultado do exercício (correto ou errado)
async function handleResult(isCorrect, earnedPoints = 0) {

  let user = JSON.parse(localStorage.getItem("user"));
  if (!user) return;

  // garantir estruturas
  if (!user.progress) user.progress = { a: 0, b: 0, c: 0, d: 0 };
  if (!user.skillLevel) user.skillLevel = { a: 1, b: 1, c: 1, d: 1 };
  if (!user.history) user.history = [];

  if (!user.progress[type]) user.progress[type] = 0;

  if (isCorrect) {

    user.points += earnedPoints; 

    user.progress[type] += earnedPoints;

    if (user.progress[type] >= 100) {
      user.progress[type] = 0;
      user.skillLevel[type] += 1;

      alert("Subiste de nível!");
    }

    user.history.push({
      type: type,
      result: "success",
      points: earnedPoints,
      date: new Date().toISOString()
    });

  } else {

    user.history.push({
      type: type,
      result: "fail",
      points: 0,
      date: new Date().toISOString()
    });

  }

  user.level = Math.floor(user.points / 50) + 1;

  localStorage.setItem("user", JSON.stringify(user));

  await fetch(`http://localhost:3000/users/${user.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user)
  });
}

//
//Sopa de letras
//

function getWordsForGame(words, userLevel) {

  let difficulty = "easy";

  if (userLevel >= 3) difficulty = "medium";
  if (userLevel >= 5) difficulty = "hard";

  const filtered = words.filter(w => w.difficulty === difficulty);

  const count = (difficulty === "easy") ? 3 : 4;

  return filtered
    .sort(() => Math.random() - 0.5)
    .slice(0, count);
}

function createGrid(size = 10) {
  return Array.from({ length: size }, () =>
    Array(size).fill("")
  );
}

function placeWords(grid, words) {

  words.forEach(wordObj => {
    const word = wordObj.word;

    let placed = false;

    while (!placed) {

      const row = Math.floor(Math.random() * grid.length);
      const col = Math.floor(Math.random() * (grid.length - word.length));

      let fits = true;

      for (let i = 0; i < word.length; i++) {
        if (grid[row][col + i] !== "") {
          fits = false;
          break;
        }
      }

      if (fits) {
        for (let i = 0; i < word.length; i++) {
          grid[row][col + i] = word[i];
        }
        placed = true;
      }
    }
  });
}

function fillGrid(grid) {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid.length; j++) {
      if (grid[i][j] === "") {
        grid[i][j] = letters[Math.floor(Math.random() * letters.length)];
      }
    }
  }
}

function drawGrid(grid) {

  const ctx = canvas.getContext("2d");

  const cellSize = 40;

  canvas.width = grid.length * cellSize;
  canvas.height = grid.length * cellSize;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.font = "20px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid.length; j++) {

      const x = j * cellSize;
      const y = i * cellSize;

      ctx.strokeRect(x, y, cellSize, cellSize);
      ctx.fillText(grid[i][j], x + cellSize/2, y + cellSize/2);
    }
  }
}

let selectedLetters = [];

function setupGridClick(grid) {

  canvas.onclick = (e) => {

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const cellSize = 40;

    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);

    const letter = grid[row][col];

    selectedLetters.push(letter);

    console.log("Selecionado:", selectedLetters.join(""));
  };
}

function checkWord(selected, words) {

  const formed = selected.join("");

  const valid = words.some(w => w.word === formed);

  return valid;
}