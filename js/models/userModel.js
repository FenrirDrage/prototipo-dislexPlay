let user = JSON.parse(localStorage.getItem("user"));

if (!user) {
  window.location.href = "login.html";
}

document.getElementById("welcome").innerText = "Olá, " + user.name + " 👋";

let level = Math.floor(user.progress / 20) + 1;
let points = user.progress * 10;

document.getElementById("level").innerText = "Nível " + level;
document.getElementById("progressBar").style.width = user.progress + "%";
document.getElementById("points").innerText = user.progress + "% completo";

document.getElementById("score").innerText = points + " pts";

function logout() {
  localStorage.removeItem("user");
  window.location.href = "index.html";
}