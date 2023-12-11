const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const validator = require("validator");
const { User } = require("../models");

const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Validation
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    // More validation as needed

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    res.json({ message: "Registration successful", user: newUser });
  } catch (error) {
    console.error("Registration failed:", error);

    // Check for duplicate email error
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ error: "Email is already in use" });
    }

    res.status(500).json({ error: "Registration failed" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    // Find user by email
    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (user) {
      // Compare hashed passwords
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        const token = jwt.sign({ userId: user.id }, "ch2-ps221", {
          expiresIn: "1h",
        });
        return res.json({ token });
      }
    }

    res.status(401).json({ error: "Email or password is incorrect" });
  } catch (error) {
    console.error("Login failed:", error);
    res.status(500).json({ error: "Login failed" });
  }
};

const changePassword = async (req, res) => {
    try {
      const { userId, email, newPassword } = req.body;
  
      // Validasi userId, email, dan newPassword
      if (!userId && !email) {
        return res.status(400).json({ error: "Masukkan Email Anda" });
      }
  
      if (!newPassword || newPassword.length < 8) {
        return res.status(400).json({
          error: "Password Baru Minimal 8 Kalimat"
        });
      }
  
      // Tambahkan kriteria lain sesuai kebutuhan, misalnya:
      if (!/[A-Z]/.test(newPassword)) {
        return res.status(400).json({
          error: "Password Baru Minimal 1 Huruf Kapital"
        });
      }
  
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
        return res.status(400).json({
          error: "Password Baru Minimal 1 Spesial Karakter"
        });
      }

      // Hash password baru
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      // Perbarui password pengguna berdasarkan userId atau email
      const updatedUser = await User.update(
        { password: hashedPassword },
        {
          where: {
            [userId ? "id" : "email"]: userId || email
          }
        }
      );
  
      if (updatedUser[0] === 1) {
        return res.json({ message: "Password Berhasil Diperbaharui" });
      } else {
        return res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      console.error("Gagal Memperbarui Password:", error);
      res.status(500).json({ error: "Gagal Memperbarui Password" });
    }
  };

module.exports = { registerUser, loginUser, changePassword };
