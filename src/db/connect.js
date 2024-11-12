const mysql = require('mysql2');

const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'db', // Nome do serviço do docker-compose
  user: 'root',
  password: 'root', // teste
  database: 'eztudy',
  charset: 'utf8mb4' 

});
 
module.exports = pool;
