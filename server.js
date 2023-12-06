const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const jwt = require("jsonwebtoken");

const app = express();
const port = 3001;

app.use(bodyParser.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "db_upcycle",
});

db.connect((err) => {
  if (err) {
    console.error("Koneksi database gagal: " + err.stack);
    return;
  }
  console.log("Terhubung ke database dengan ID " + db.threadId);
});

// Endpoint untuk registrasi
app.post("/register", (req, res) => {
  const { username, email, password } = req.body;

  // Validasi data masukan (bisa disesuaikan sesuai kebutuhan)

  // Implementasi fungsi hash password (misalnya menggunakan bcrypt)
  const hashedPassword = password;

  const query =
    "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
  db.query(query, [username, email, hashedPassword], (err, result) => {
    if (err) {
      console.error("Gagal mendaftar: " + err.message);
      res.status(500).json({ error: "Gagal mendaftar" });
      return;
    }

    res.json({ message: "Pendaftaran berhasil" });
  });
});

// Endpoint untuk login
app.post("/login", (req, res) => {
  const { username, email, password } = req.body;

  // Validasi data masukan (bisa disesuaikan sesuai kebutuhan)

  const query = "SELECT * FROM users WHERE email = ? AND password = ?";
  db.query(query, [email, password], (err, result) => {
    if (err) {
      console.error("Gagal login: " + err.message);
      res.status(500).json({ error: "Gagal login" });
      return;
    }

    if (result.length > 0) {
      const user = result[0];
      const token = jwt.sign({ userId: user.id }, "ch2-ps221", {
        expiresIn: "1h",
      });
      res.json({ token });
    } else {
      res.status(401).json({ error: "Email atau password salah" });
    }
  });
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
