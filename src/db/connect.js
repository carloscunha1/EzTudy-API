const mysql = require('mysql2');

const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'junction.proxy.rlwy.net', // Host fornecido pelo Railway
  user: 'root', // Usuário do banco de dados
  password: 'IGRLwrDIkSxrAdAVLsNfrOzmrVzqEVLu', // Senha fornecida pelo Railway
  database: 'railway', // Nome do banco de dados
  port: 43437, // Porta do banco de dados fornecida pelo Railway (número, não string)
  charset: 'utf8mb4', // Charset recomendado
});

module.exports = pool;
