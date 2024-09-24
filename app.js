const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const app = express();

// Configurações
app.use(express.json()); // Para lidar com JSON no corpo das requisições

// Conectar ao MongoDB
mongoose.connect('mongodb://localhost:27017/myapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Modelo de Usuário
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// Rota para criação de um usuário
app.post('/users', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Usuário e senha são obrigatórios' });
  }

  // Verificar se o usuário já existe
  const userExists = await User.findOne({ username });
  if (userExists) {
    return res.status(400).json({ error: 'Usuário já existe' });
  }

  // Criptografar a senha
  const hashedPassword = await bcrypt.hash(password, 10);

  // Criar o novo usuário
  const newUser = new User({ username, password: hashedPassword });
  await newUser.save();

  res.status(201).json({ message: 'Usuário criado com sucesso!' });
});

// Iniciar o servidor
const PORT = process.env.PORT || 3001; // Usando apenas a porta 3001
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
