// Carrega variáveis de ambiente
require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

// Configuração do Banco de Dados usando variáveis de ambiente
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Conectando ao banco de dados
db.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
        return;
    }
    console.log('Conectado ao banco de dados MySQL');
});

// Inicializando o servidor Express
const app = express();
const port = process.env.PORT || 3000;

// Usando o body-parser para processar JSON
app.use(bodyParser.json());

// Rota raiz para evitar o erro "Cannot GET /"
app.get('/', (req, res) => {
    res.send('Bem-vindo ao sistema de reservas do FGN Restaurante!');
});

// Rota para verificar disponibilidade da mesa
app.post('/check-availability', (req, res) => {
    const { date, time } = req.body;

    // Validação dos dados
    if (!date || !time) {
        return res.status(400).json({ message: 'Data e horário são obrigatórios!' });
    }

    // Consulta ao banco para verificar reservas
    const query = 'SELECT * FROM reservas WHERE date = ? AND time = ?';
    db.query(query, [date, time], (err, results) => {
        if (err) {
            console.error('Erro ao verificar disponibilidade:', err.message);
            return res.status(500).json({ message: 'Erro ao verificar disponibilidade.' });
        }

        const isAvailable = results.length === 0; // true se não houver reservas
        res.json({ isAvailable });
    });
});

// Rota para fazer uma nova reserva
app.post('/reserve', (req, res) => {
    const { name, email, date, time, people } = req.body;

    // Validação dos dados
    if (!name || !email || !date || !time || !people) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios!' });
    }

    // Inserção da reserva no banco de dados
    const query = 'INSERT INTO reservas (name, email, date, time, people) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [name, email, date, time, people], (err) => {
        if (err) {
            console.error('Erro ao fazer a reserva:', err.message);
            return res.status(500).json({ message: 'Erro ao fazer a reserva.' });
        }

        res.json({ message: 'Reserva feita com sucesso!' });
    });
});

// Middleware de tratamento de erros globais
app.use((err, req, res, next) => {
    console.error('Erro inesperado:', err.message);
    res.status(500).json({ message: 'Ocorreu um erro no servidor.' });
});

// Inicialização do servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
