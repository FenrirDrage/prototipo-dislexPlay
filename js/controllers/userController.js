const user = JSON.parse(localStorage.getItem("user"));

document.getElementById("welcome").innerText = "Olá " + user.name;

document.getElementById("progressBar").style.width = user.progress + "%";

function goExercise(type) {
  window.location.href = `exercise.html?type=${type}`;
}

function logout() {
  // limpar tudo
  localStorage.clear();

  // redirecionar
  window.location.href = "index.html";
}