const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Conexão com o banco de dados
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
    } else {
        console.log('Conectado ao banco de dados MySQL.');
    }
});

// Rotas

// Listar mesas disponíveis
app.get('/tables', (req, res) => {
    const sql = 'SELECT * FROM tables';
    db.query(sql, (err, results) => {
        if (err) {
            res.status(500).send('Erro ao buscar mesas.');
        } else {
            res.json(results);
        }
    });
});

// Criar uma reserva
app.post('/reservations', (req, res) => {
    const { customer_name, customer_phone, table_id, reservation_date, reservation_time } = req.body;

    // Verificar se a mesa está disponível
    const checkTable = 'SELECT * FROM tables WHERE id = ? AND status = "available"';
    db.query(checkTable, [table_id], (err, results) => {
        if (err) {
            res.status(500).send('Erro ao verificar disponibilidade da mesa.');
        } else if (results.length === 0) {
            res.status(400).send('Mesa não está disponível.');
        } else {
            // Inserir a reserva
            const insertReservation = `
                INSERT INTO reservations (customer_name, customer_phone, table_id, reservation_date, reservation_time)
                VALUES (?, ?, ?, ?, ?)`;
            db.query(insertReservation, [customer_name, customer_phone, table_id, reservation_date, reservation_time], (err) => {
                if (err) {
                    res.status(500).send('Erro ao criar reserva.');
                } else {
                    // Atualizar status da mesa
                    const updateTable = 'UPDATE tables SET status = "reserved" WHERE id = ?';
                    db.query(updateTable, [table_id], (err) => {
                        if (err) {
                            res.status(500).send('Erro ao atualizar status da mesa.');
                        } else {
                            res.status(201).send('Reserva criada com sucesso!');
                        }
                    });
                }
            });
        }
    });
});

// Servidor rodando
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
