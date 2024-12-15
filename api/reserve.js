require('dotenv').config();
const mysql = require('mysql2');

// Configuração do Banco de Dados usando variáveis de ambiente
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Função para realizar uma reserva
module.exports = async (req, res) => {
    if (req.method === 'POST') {
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
    } else {
        res.status(405).json({ message: 'Método não permitido' });
    }
};
