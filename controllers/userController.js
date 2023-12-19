const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require("validator");
const db = require('../db');


const getUserList = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Gunakan parameterized query untuk mencegah SQL injection
    const [result] = await db.query('SELECT id, username, email FROM Users WHERE id = ?', [userId]);

    if (result.length > 0) {
      const user = result[0];
      res.json({ message: 'Pengguna berhasil diambil', user });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Gagal mengambil pengguna:', error);
    res.status(500).json({ error: 'Gagal mengambil pengguna' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    // Gunakan parameterized query untuk mencegah SQL injection
    const [result] = await db.query('SELECT * FROM Users');

    res.json({ message: 'Data semua pengguna berhasil diambil', users: result });
  } catch (error) {
    console.error('Gagal mengambil data semua pengguna:', error);
    res.status(500).json({ error: 'Gagal mengambil data semua pengguna' });
  }
};

const updateUser = async (req, res) => {
  const { userId, newData } = req.body;

  try {
    // Gunakan parameterized query untuk mencegah SQL injection
    const [result] = await db.query('UPDATE Users SET ? WHERE id = ?', [newData, userId]);

    if (result.affectedRows === 1) {
      res.json({ message: 'Data pengguna berhasil diperbarui', updatedUser: newData });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Gagal memperbarui data pengguna:', error);
    res.status(500).json({ error: 'Gagal memperbarui data pengguna' });
  }
};

const updateUserImage = async (req, res) => {
  const { userId, newImage } = req.body;

  try {
    // Gunakan parameterized query untuk mencegah SQL injection
    const [result] = await db.query('UPDATE Users SET image = ? WHERE id = ?', [newImage, userId]);

    if (result.affectedRows === 1) {
      res.json({ message: 'Gambar pengguna berhasil diperbarui', updatedImage: newImage });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Gagal memperbarui gambar pengguna:', error);
    res.status(500).json({ error: 'Gagal memperbarui gambar pengguna' });
  }
};


const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validasi data masukan
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Harap isi semua field' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Format email tidak valid' });
    }

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({ error: 'Email sudah terdaftar' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Gunakan parameterized query untuk mencegah SQL injection
    const [result] = await db.query('INSERT INTO Users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);

    const newUser = { id: result.insertId, username, email };

    res.json({ message: 'Pendaftaran pengguna berhasil', user: newUser });
  } catch (error) {
    console.error('Gagal mendaftar:', error);

    if (error.name === 'SequelizeValidationError') {
      const validationErrors = error.errors.map((error) => ({
        field: error.path,
        message: error.message,
      }));
      res.status(400).json({ error: 'Gagal mendaftar', validationErrors });
    } else {
      res.status(500).json({ error: 'Gagal mendaftar' });
    }
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Format email tidak valid' });
    }

    const user = await getUserByEmail(email);

    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        const token = generateToken(user.id);
        res.json({ message: 'Login berhasil', token });
      } else {
        res.status(401).json({ error: 'Email atau password salah' });
      }
    } else {
      res.status(401).json({ error: 'Email atau password salah' });
    }
  } catch (error) {
    console.error('Gagal login:', error);
    res.status(500).json({ error: 'Gagal login' });
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
        error: "Password Baru Minimal 8 Karakter"
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Gunakan parameterized query untuk mencegah SQL injection
    const [result] = await db.query('UPDATE Users SET password = ? WHERE ?', [hashedPassword, userId ? { id: userId } : { email: email }]);

    if (result.affectedRows === 1) {
      return res.json({ message: "Password Berhasil Diperbarui" });
    } else {
      return res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Gagal Memperbarui Password:", error);
    res.status(500).json({ error: "Gagal Memperbarui Password" });
  }
};

// Fungsi helper untuk mendapatkan pengguna berdasarkan email
const getUserByEmail = async (email) => {
  // Gunakan parameterized query untuk mencegah SQL injection
  const [result] = await db.query('SELECT * FROM Users WHERE email = ?', [email]);
  return result.length > 0 ? result[0] : null;
};

// Fungsi helper untuk validasi email
const isValidEmail = (email) => {
  return validator.isEmail(email);
};

// Fungsi helper untuk menghasilkan token JWT
const generateToken = (userId) => {
  return jwt.sign({ userId: userId }, 'ch2-ps221', {
    expiresIn: '1h',
  });
};
  
  module.exports = {
    getUserList,
    getAllUsers,
    updateUser,
    updateUserImage,
    registerUser,
    loginUser,
    changePassword,
  };
  
