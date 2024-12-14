const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

// Configurações do MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Seu usuário do MySQL
    password: 'jesusefiel123', // Sua senha do MySQL
    database: 'fgn_restaurante' // Nome do banco de dados
});

// Conectando ao banco de dados
db.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados MySQL');
});

// Inicializando o servidor Express
const app = express();
const port = 3000;

// Usando o body-parser para processar JSON
app.use(bodyParser.json());

// Rota para verificar disponibilidade da mesa
app.post('/check-availability', (req, res) => {
    const { date, time, people } = req.body;

    // Verificar disponibilidade (aqui você pode ajustar a lógica conforme sua necessidade)
    const query = 'SELECT * FROM reservas WHERE date = ? AND time = ?';

    db.query(query, [date, time], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao verificar disponibilidade.' });
        }

        if (results.length > 0) {
            return res.json({ isAvailable: false });
        }

        res.json({ isAvailable: true });
    });
});

// Rota para fazer a reserva
app.post('/reserve', (req, res) => {
    const { name, email, date, time, people } = req.body;

    // Inserir a reserva no banco de dados
    const query = 'INSERT INTO reservas (name, email, date, time, people) VALUES (?, ?, ?, ?, ?)';

    db.query(query, [name, email, date, time, people], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao fazer a reserva.' });
        }

        res.json({ message: 'Reserva feita com sucesso!' });
    });
});

// Iniciando o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
