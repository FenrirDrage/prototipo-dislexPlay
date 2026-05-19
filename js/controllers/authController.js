const API = "http://localhost:3000/users";

// REGISTO
async function register() {

  const name = document.getElementById("regName").value;
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;

  const user = createUser(name, email, password);

  await fetch("http://localhost:3000/users", {
    method: "POST",
    body: JSON.stringify(user),
    headers: { "Content-Type": "application/json" }
  });

  alert("Conta criada!");

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

    const user = data[0]; // 🔥 importante

    // guardar user
    localStorage.setItem("user", JSON.stringify(user));

    // 👑 verificar admin
    if (user.isAdmin) {
      window.location.href = "admin.html";
    } else {
      window.location.href = "dashboard.html";
    }

  } else {
    alert("Utilizador não encontrado ❌");
  }
}