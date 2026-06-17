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

//verificar se o exercício já foi terminado
let finished = false;

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

  stotalPoints = 0;
  foundWords = [];
  selectedCells = [];
  const words = await getWords();
  const random = words[Math.floor(Math.random() * words.length)];
  currentWord = random;

  toggleInputUI(type);

  clearCanvasEvents(); 

  const container = document.getElementById("wordsFound");
  if (container) container.style.display = "none";

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
      //setupQuizUI();
      drawPlaceholder("Quiz em construção");
      break;

    case "d":
      setupImageUI();
      
      const container = document.getElementById("wordsFound");
      if (container) container.style.display = "block";

      const user = JSON.parse(localStorage.getItem("user"));

      const selectedWords = getWordsForGame(words, user.skillLevel.d);

      const grid = createGrid(10);

      placeWords(grid, selectedWords);
      fillGrid(grid);
      drawGrid(grid);
      setupGridClick(grid, selectedWords);
      break;
  }
}

// limpar eventos antigos do canvas
function clearCanvasEvents() {
  canvas.onclick = null;
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

  drawMatchGame(correct.image, options, correct.word);
  //setupCanvasClick(options, correct.word);
}

//
// CANVAS
//

// ajustar tamanho do canvas para evitar distorção
function fixCanvasSize() {
  const rect = canvas.getBoundingClientRect();

  const size = Math.min(rect.width, rect.height); // força quadrado

  canvas.width = size;
  canvas.height = size;
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
function drawMatchGame(imageName, options, correctWord) {
  const ctx = canvas.getContext("2d");

  const img = new Image();
  img.src = imageName;

  img.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#6c63ff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(img, 100, 20, 150, 100);

    options.forEach((opt, i) => {
      const cellWidth = canvas.width / options.length;
      const boxWidth = cellWidth * 0.8;
      const boxHeight = 40;

      const x = i * cellWidth + (cellWidth - boxWidth) / 2;
      const y = canvas.height * 0.7;

      ctx.fillStyle = "white";
      ctx.fillRect(x, y, 100, 30);

      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      ctx.fillText(opt, x + 50, y + 20);
    });
    

    setupCanvasClick(options, correctWord);
  };
}

// desenhar placeholder para exercícios em construção
function drawPlaceholder(text) {
  const ctx = canvas.getContext("2d");

  fixCanvasSize();

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#6c63ff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.font = "24px Arial";
  ctx.textAlign = "center";

  ctx.fillText(text, canvas.width / 2, canvas.height / 2);
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

  canvas.onclick = (e) => {

    const rect = canvas.getBoundingClientRect();
    
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    options.forEach((opt, i) => {
      const cellWidth = canvas.width / options.length;
      const boxWidth = cellWidth * 0.8;
      const boxHeight = 40;

      const boxX = i * cellWidth + (cellWidth - boxWidth) / 2;
      const boxY = canvas.height * 0.7;

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

  };
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

let foundWords = [];
let stotalPoints = 0;

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

  fixCanvasSize();

  const ctx = canvas.getContext("2d");

  const size = grid.length;
  const cellSize = canvas.width / size;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.font = "20px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {

      const x = j * cellSize;
      const y = i * cellSize;

      ctx.strokeRect(x, y, cellSize, cellSize);
      ctx.fillText(grid[i][j], x + cellSize/2, y + cellSize/2);
    }
  }
}

let selectedCells = [];

function setupGridClick(grid, selectedWords) {

  canvas.onclick = (e) => {
  
    const rect = canvas.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const cellSize = canvas.width / grid.length;

    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);

    console.log("Célula clicada:", row, col);

    // evitar repetir a mesma célula
    const alreadySelected = selectedCells.some(
      c => c.row === row && c.col === col
    );

    if (!alreadySelected) {
      selectedCells.push({ row, col });

      // validar direção logo aqui
      if (!isStraightLine(selectedCells)) {
        console.log("Direção inválida, reset!");

        selectedCells.length = 0; // limpa seleção
        return;
      }
    }

    const word = selectedCells
      .map(c => grid[c.row][c.col])
      .join("");

    console.log("Selecionado:", word);

    checkWord(selectedCells, grid, selectedWords);
  };
}

function checkWord(selectedCells, grid, selectedWords) {

  const isValid = isStraightLine(selectedCells);
  if (!isValid) return;

  const formed = selectedCells
    .map(c => grid[c.row][c.col])
    .join("");

  console.log("Selecionado:", formed);

  const found = selectedWords.find(w => formed === w.word);

  if (found && !foundWords.includes(found.word)) {

    foundWords.push(found.word);

    let points = formed.length * 2;
    stotalPoints += points;

    addWordToList(found.word);

    console.log("Encontrada:", found.word);

    selectedCells.length = 0;

    if (foundWords.length === selectedWords.length) {
      finishGame();
    }
  }
}

function isStraightLine(cells) {

  if (cells.length < 2) return true;

  const dx = cells[1].col - cells[0].col;
  const dy = cells[1].row - cells[0].row;

  for (let i = 1; i < cells.length; i++) {

    const prev = cells[i - 1];
    const curr = cells[i];

    const currDx = curr.col - prev.col;
    const currDy = curr.row - prev.row;

    // tem de manter a mesma direção
    if (currDx !== dx || currDy !== dy) {
      return false;
    }

    // tem de ser célula ao lado (não pode saltar)
    if (Math.abs(currDx) > 1 || Math.abs(currDy) > 1) {
      return false;
    }
  }

  return true;
}

function addWordToList(word) {

  const list = document.getElementById("foundList");

  const li = document.createElement("li");
  li.textContent = word;

  list.appendChild(li);
}

async function finishGame() {

  finished = true;

  let user = JSON.parse(localStorage.getItem("user"));
  if (!user) return;

  const type = "d";

  if (!user.progress) user.progress = { a: 0, b: 0, c: 0, d: 0 };
  if (!user.skillLevel) user.skillLevel = { a: 1, b: 1, c: 1, d: 1 };
  if (!user.history) user.history = [];

  user.points += stotalPoints;

  user.progress[type] += stotalPoints;
  console.log("Progresso atual:", user.progress[type]);
  console.log("Pontos ganhos:", stotalPoints);

  while (user.progress[type] >= 100) {
    user.progress[type] -= 100;
    user.skillLevel[type] += 1;
    alert("Subiste de nível!");
  }

  user.history.push({
    type: type,
    result: "success",
    points: stotalPoints,
    date: new Date().toISOString()
  });

  user.level = Math.floor(user.points / 50) + 1;

  localStorage.setItem("user", JSON.stringify(user));

  await fetch(`http://localhost:3000/users/${user.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user)
  });

  alert("Terminaste!\nPontos: " + stotalPoints);

  // opcional: redirecionar
  window.location.href = "dashboard.html";
}

window.addEventListener("beforeunload", () => {

  if (finished) return;

  let user = JSON.parse(localStorage.getItem("user"));
  if (!user) return;

  const type = new URLSearchParams(window.location.search).get("type");

  // penalizar XP total
  user.points = Math.max(0, user.points - 10);

  //penalizar progresso do exercício
  if (user.progress && user.progress[type] !== undefined) {
    user.progress[type] = Math.max(0, user.progress[type] - 10);
  }

  console.log("Penalização aplicada no tipo:", type);

  localStorage.setItem("user", JSON.stringify(user));
});

window.addEventListener("beforeunload", () => {
  console.log("SAIU DA PÁGINA");
});