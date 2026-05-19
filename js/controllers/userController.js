document.addEventListener("DOMContentLoaded", () => {

  const user = JSON.parse(localStorage.getItem("user"));

  // proteção
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  // info do user
  document.getElementById("welcome").innerText = "Olá " + user.name;

  // pontos & nivel
  document.getElementById("points").innerText = user.points + " pontos";
  //document.getElementById("level").innerText = "Nível " + user.level;

  // progresso por tipo
  const progA = document.getElementById("progA");
  if (progA) {
    progA.style.width = user.progress.a + "%";
    progA.innerText = user.progress.a + "%";
  }

  const progB = document.getElementById("progB");
  if (progB) {
    progB.style.width = user.progress.b + "%";
    progB.innerText = user.progress.b + "%";
  }

  const progC = document.getElementById("progC");
  if (progC) {
    progC.style.width = user.progress.c + "%";
    progC.innerText = user.progress.c + "%";
  }

  //recomendação
  let minType = "a";
  let minValue = user.progress.a;

  if (user.progress.b < minValue) {
    minType = "b";
    minValue = user.progress.b;
  }

  if (user.progress.c < minValue) {
    minType = "c";
    minValue = user.progress.c;
  }

  const names = { a: "Tipo A", b: "Tipo B", c: "Tipo C" };
  document.getElementById("recommendation").innerText =
    "Devias treinar: " + names[minType];

});

function goExercise(type) {
  window.location.href = `exercise.html?type=${type}`;
}

function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}