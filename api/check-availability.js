const mysql = require('mysql2');

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { date, time } = req.body;
        if (!date || !time) {
            return res.status(400).json({ message: 'Data e horário são obrigatórios!' });
        }

        // Consulta ao banco para verificar reservas
        const query = 'SELECT * FROM reservas WHERE date = ? AND time = ?';
        db.query(query, [date, time], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Erro ao verificar disponibilidade.' });
            }

            const isAvailable = results.length === 0;
            res.json({ isAvailable });
        });
    } else {
        res.status(405).json({ message: 'Método não permitido' });
    }
}
