const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require("validator");
const { User } = require('../models');


const getUserList = async (req, res) => {
  try {
    const { userId } = req.params; 

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const user = await User.findByPk(userId, {
      attributes: ['id', 'username', 'email'],
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'Pengguna berhasil diambil', user });
  } catch (error) {
    console.error('Gagal mengambil pengguna:', error);
    res.status(500).json({ error: 'Gagal mengambil pengguna' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();

    res.json({ message: 'Data semua pengguna berhasil diambil', users });
  } catch (error) {
    console.error('Gagal mengambil data semua pengguna:', error);
    res.status(500).json({ error: 'Gagal mengambil data semua pengguna' });
  }
};

const updateUser = async (req, res) => {
  const { userId, newData } = req.body;

  try {
    const updatedUser = await User.update(newData, {
      where: { id: userId },
    });

    if (updatedUser[0] === 1) {
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

  console.log('Received userId:', userId);
  console.log('Received newImage:', newImage);

  try {
    const [rowCount] = await User.update({ image: newImage }, {
      where: { id: userId },
    });

    console.log('Rows affected:', rowCount);

    if (rowCount === 1) {
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

  
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email sudah terdaftar' });
    }


    const hashedPassword = await bcrypt.hash(password, 10);

  
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

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

    // Find user by email
    const user = await User.findOne({ where: { email } });

    if (user) {
      
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
       
        const token = jwt.sign({ userId: user.id }, 'ch2-ps221', {
          expiresIn: '1h',
        });
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
        error: "Password Baru Minimal 8 Kalimat"
      });
    }

  
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
  };

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
  
