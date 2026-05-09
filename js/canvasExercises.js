const commonFillColor = "#6c63ff";

// A
function drawScrambledTextCanvas(canvas) {
  const ctx = canvas.getContext("2d");

  const text = "Reading can feel confusing sometimes";

  function scramble(word) {
    return word.split("").sort(() => Math.random() - 0.5).join("");
  }

  setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = commonFillColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "18px Arial";

    let line = text.split(" ")
      .map(w => Math.random() < 0.3 ? scramble(w) : w)
      .join(" ");

    ctx.fillText(line, 10, 80);

  }, 300);
}

// B
function drawBlurCanvas(canvas) {
  const ctx = canvas.getContext("2d");

  let blur = 10;
  let dir = 1;

  setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = commonFillColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.filter = `blur(${blur}px)`;
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";

    ctx.fillText("Focus becomes difficult", 10, 80);

    ctx.filter = "none";

    blur += dir * 0.5;
    if (blur > 15 || blur < 0) dir *= -1;

  }, 100);
}

// C
function drawTasksCanvas(canvas) {
  const ctx = canvas.getContext("2d");

  let tasks = ["Read", "Write", "Focus", "Practice"];

  setInterval(() => {
    tasks.sort(() => Math.random() - 0.5);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = commonFillColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "18px Arial";

    tasks.forEach((t, i) => {
      ctx.fillText(t, 10, 40 + i * 30);
    });

  }, 1500);
}