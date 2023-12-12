const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const mysql = require("mysql");
const { User } = require("./models");
const { registerUser, loginUser } = require("./controllers/userController");
const routes = require('./routes'); 

const app = express();
const port = 3001;

app.use(bodyParser.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_DATABASE || "db_upcycle",
  port: process.env.DB_PORT || 3306, 
});


db.connect((err) => {
  if (err) {
    console.error("Koneksi database gagal: " + err.stack);
    return;
  }
  console.log("Terhubung ke database dengan ID " + db.threadId);
});

//Endpoint untuk mendapatkan http get
app.get("/", (req, res) => {
  res.send("Welcome to UPCYCLE API!");
});


// Endpoint untuk registrasi
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Validasi data masukan (bisa disesuaikan sesuai kebutuhan)
    if (!isValidPassword(password)) {
      return res.status(400).json({ error: "Password tidak memenuhi syarat" });
    }

    // Implementasi fungsi hash password (misalnya menggunakan bcrypt)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user using Sequelize
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.json({ message: "Pendaftaran berhasil", user: newUser });
  } catch (error) {
    console.error("Gagal mendaftar:", error);

    // Handle Sequelize validation errors
    if (error.name === "SequelizeValidationError") {
      const validationErrors = error.errors.map((error) => ({
        field: error.path,
        message: error.message,
      }));
      res.status(400).json({ error: "Gagal mendaftar", validationErrors });
    } else {
      res.status(500).json({ error: "Gagal mendaftar" });
    }
  }
});

// Fungsi untuk validasi password
function isValidPassword(password) {
  // Contoh: Minimal 8 karakter, setidaknya satu huruf besar, dan satu karakter spesial
  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]).{8,}$/;
  return passwordRegex.test(password);
}
// Endpoint untuk login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({
      where: {
        email,
      },
    });

    console.log('User:', user);

    if (user) {
      // Compare the input password with the hashed password in the database
      const isPasswordValid = await bcrypt.compare(password, user.password);

      console.log('isPasswordValid:', isPasswordValid);

      if (isPasswordValid) {
        // Password is valid, generate and send a token
        const token = jwt.sign({ userId: user.id }, "ch2-ps221", {
          expiresIn: "1h",
        });
        res.json({ token });
      } else {
        // Password is invalid
        res.status(401).json({ error: "Email atau password salah" });
      }
    } else {
      // User not found
      res.status(401).json({ error: "Email atau password salah" });
    }
  } catch (error) {
    console.error("Gagal login:", error);
    res.status(500).json({ error: "Gagal login" });
  }
});
// Menggunakan rute dari /routes
app.use('/api', routes);

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
