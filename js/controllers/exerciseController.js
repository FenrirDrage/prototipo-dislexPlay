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
  title.innerText = "🅰️ Texto Embaralhado";
  name.innerText = "Ler texto embaralhado";
  desc.innerText = "Simula a dificuldade de leitura com palavras trocadas.";

  drawScrambledTextCanvas(canvas);
}

if (type === "b") {
  title.innerText = "🅱️ Texto Desfocado";
  name.innerText = "Texto com blur";
  desc.innerText = "Simula dificuldade de foco visual.";

  drawBlurCanvas(canvas);
}

if (type === "c") {
  title.innerText = "🅲 Tarefas Desordenadas";
  name.innerText = "Sequência de tarefas";
  desc.innerText = "Treina organização e memória.";

  drawTasksCanvas(canvas);
}

// GAMIFICAÇÃO
function completeExercise() {
  let user = JSON.parse(localStorage.getItem("user"));

  user.progress += 10;
  if (user.progress > 100) user.progress = 100;

  localStorage.setItem("user", JSON.stringify(user));

  alert("+10 progresso 🎉");

  window.location.href = "dashboard.html";
}