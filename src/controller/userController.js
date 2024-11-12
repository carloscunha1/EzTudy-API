const pool = require("../db/connect");
const bcrypt = require("bcryptjs");

module.exports = class userController {
  // Método para criar um novo usuário
  static async createUser(req, res) {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" });
    }

    if (!email.includes("@")) {
      return res.status(400).json({ error: "Email inválido. Deve conter @" });
    }

    // Validação da senha
    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        senha
      )
    ) {
      return res
        .status(400)
        .json({
          error:
            "Senha inválida. Deve conter pelo menos 8 caracteres, incluindo letras maiúsculas, letras minúsculas, números e caracteres especiais.",
        });
    }

    const overlapQuery = `SELECT * FROM usuarios WHERE email = ?`;

    try {
      // Executa a consulta para verificar a duplicidade do email
      const [results] = await pool.promise().query(overlapQuery, [email]);

      if (results.length > 0) {
        return res
          .status(400)
          .json({ error: "Já existe um usuário com esse e-mail!" });
      }

      // Criptografar a senha antes de armazenar
      const hashedPassword = await bcrypt.hash(senha, 10);

      const query =
        "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)";
      const values = [nome, email, hashedPassword];

      await pool.promise().query(query, values);
      return res.status(201).json({ message: "Usuário criado com sucesso" });
    } catch (error) {
      console.error("Erro ao executar a consulta:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  // Método para realizar login de um usuário
  static async postLogin(req, res) {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: "Email e senha são obrigatórios" });
    }

    try {
      // Verifica se as credenciais correspondem às de administrador
      const adminEmail = "admin@gmail.com";
      const adminSenha = "admin12345@";

      if (email === adminEmail && senha === adminSenha) {
        return res.status(200).json({
          message: "Login de administrador realizado com sucesso",
          user: { email: adminEmail, nome: "Administrador" },
        });
      }

      // Consulta para verificar o usuário no banco de dados
      const query = "SELECT * FROM usuarios WHERE email = ?";
      const values = [email];

      const [results] = await pool.promise().query(query, values);

      if (results.length === 0) {
        return res.status(401).json({ error: "Credenciais inválidas" });
      }

      const user = results[0];

      // Verifica se a senha corresponde à hash armazenada
      const isMatch = await bcrypt.compare(senha, user.senha);
      if (!isMatch) {
        return res.status(401).json({ error: "Credenciais inválidas" });
      }

      return res
        .status(200)
        .json({ message: "Login realizado com sucesso", user });
    } catch (error) {
      console.error("Erro ao executar a consulta:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  // Método para obter todos os usuários
  static async getAllUsers(req, res) {
    try {
      const query = "SELECT * FROM usuarios";
      const [results] = await pool.promise().query(query);

      return res
        .status(200)
        .json({ message: "Obtendo todos os usuários", users: results });
    } catch (error) {
      console.error("Erro ao executar a consulta:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  // Método para obter um usuário específico pelo ID
  static async getUserById(req, res) {
    const userId = req.params.id;

    try {
      const query = "SELECT * FROM usuarios WHERE id_usuario = ?";
      const [results] = await pool.promise().query(query, [userId]);

      if (results.length === 0) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      return res.status(200).json({
        message: "Obtendo usuário com ID: " + userId,
        user: results[0],
      });
    } catch (error) {
      console.error("Erro ao executar a consulta:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  // Método para atualizar um usuário
  static async updateUser(req, res) {
    const userId = req.params.id;
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" });
    }

    try {
      // Criptografar a senha antes de atualizar
      const hashedPassword = await bcrypt.hash(senha, 10);

      // Consulta para atualizar o usuário
      const query =
        "UPDATE usuarios SET nome = ?, email = ?, senha = ? WHERE id_usuario = ?";
      const values = [nome, email, hashedPassword, userId];

      const [results] = await pool.promise().query(query, values);

      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      return res
        .status(200)
        .json({ message: "Usuário atualizado com ID: " + userId });
    } catch (error) {
      console.error("Erro ao executar a consulta:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  // Método para excluir um usuário
  static async deleteUser(req, res) {
    const userId = req.params.id;

    const connection = await pool.promise().getConnection();
    try {
      await connection.beginTransaction();

      // Excluir flashcards associados ao usuário
      const deleteFlashcardsQuery =
        "DELETE FROM flashcards WHERE id_usuario = ?";
      await connection.query(deleteFlashcardsQuery, [userId]);

      // Excluir o usuário
      const deleteUserQuery = "DELETE FROM usuarios WHERE id_usuario = ?";
      const [results] = await connection.query(deleteUserQuery, [userId]);

      // Verifica se o usuário foi encontrado e excluído
      if (results.affectedRows === 0) {
        await connection.rollback(); // Desfaz a transação se o usuário não foi encontrado
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      // Confirma a transação
      await connection.commit();
      return res
        .status(200)
        .json({ message: "Usuário excluído com ID: " + userId });
    } catch (error) {
      // Se ocorreu um erro, faz rollback
      await connection.rollback();
      console.error("Erro ao executar a consulta:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    } finally {
      // Libera a conexão de volta para o pool
      connection.release();
    }
  }
};
