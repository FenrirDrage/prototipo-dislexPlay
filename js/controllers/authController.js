const API = "http://localhost:3000/users";

// REGISTO
async function register() {
  const user = {
    name: document.getElementById("regName").value,
    email: document.getElementById("regEmail").value,
    password: document.getElementById("regPassword").value,
    progress: 0
  };

  await fetch(API, {
    method: "POST",
    body: JSON.stringify(user),
    headers: { "Content-Type": "application/json" }
  });

  alert("Conta criada! 🎉");

  // fechar modal
  const modal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
  modal.hide();
}

// LOGIN
async function login() {
  const email = document.getElementById("loginEmail").value;

  const res = await fetch(`${API}?email=${email}`);
  const data = await res.json();

  if (data.length > 0) {
    localStorage.setItem("user", JSON.stringify(data[0]));
    window.location.href = "dashboard.html";
  } else {
    alert("Utilizador não encontrado ❌");
  }
}