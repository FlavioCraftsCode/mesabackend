const express = require('express');
const cors = require('cors');
const app = express();

// Permite requisições de qualquer origem (modifique conforme necessário)
app.use(cors());
app.use(express.json()); // Para poder manipular o corpo das requisições JSON

// Resto das rotas do servidor
