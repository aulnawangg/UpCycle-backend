const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const mysql = require("mysql");
const { User } = require("./models");
const routes = require('./routes'); 
const recyclingHistoryRoutes = require('./routes/recyclingHistoryRoutes');
const db = require('./db');
const { changePassword } = require("./controllers/userController");

const app = express();
const port = 3001;

app.use(bodyParser.json());

//Endpoint untuk mendapatkan http get
app.get("/", (req, res) => {
  res.send("Welcome to UPCYCLE API!");
});


// Endpoint untuk registrasi
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {

    if (!isValidPassword(password)) {
      return res.status(400).json({ error: "Password tidak memenuhi syarat" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.json({ message: "Pendaftaran berhasil", user: newUser });
  } catch (error) {
    console.error("Gagal mendaftar:", error);

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


function isValidPassword(password) {
  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]).{8,}$/;
  return passwordRegex.test(password);
}
// Endpoint untuk login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
  
    const user = await User.findOne({
      where: {
        email,
      },
    });

    console.log('User:', user);

    if (user) {
    
      const isPasswordValid = await bcrypt.compare(password, user.password);

      console.log('isPasswordValid:', isPasswordValid);

      if (isPasswordValid) {
      
        const token = jwt.sign({ userId: user.id }, "ch2-ps221", {
          expiresIn: "1h",
        });
        res.json({ token });
      } else {
     
        res.status(401).json({ error: "Email atau password salah" });
      }
    } else {
     
      res.status(401).json({ error: "Email atau password salah" });
    }
  } catch (error) {
    console.error("Gagal login:", error);
    res.status(500).json({ error: "Gagal login" });
  }
});
// Menggunakan rute dari /routes
app.use('/api', routes);
app.use('/api', recyclingHistoryRoutes);



app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
