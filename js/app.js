// Configuração do multer para upload de imagens
const multer = require("multer");

const storage = multer.diskStorage({
  destination: "images/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

app.post("/upload", upload.single("image"), (req, res) => {
  res.json({ path: "/images/" + req.file.filename });
});

app.use("/images", express.static("images"));