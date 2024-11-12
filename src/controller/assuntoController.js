const connect = require("../db/connect"); 

module.exports = class assuntoController {
  
  // Cria um novo assunto
  static async createAssunto(req, res) {
    const { nome, materia_id } = req.body;

    if (!nome) return res.status(400).json({ error: "O nome do assunto é obrigatório" });
    if (!materia_id) return res.status(400).json({ error: "É obrigatório especificar a matéria" });

    // Verifica se o assunto já existe
    const overlapQuery = `SELECT * FROM assunto WHERE nome = ?`;
    const [results] = await connect.promise().query(overlapQuery, [nome]);

    if (results.length > 0) return res.status(400).json({ error: "Esse assunto já existe!" });

    // Verifica se a matéria existe
    const materiaQuery = `SELECT * FROM materia WHERE id_materia = ?`;
    const [materiaResults] = await connect.promise().query(materiaQuery, [materia_id]);

    if (materiaResults.length === 0) return res.status(400).json({ error: "A matéria especificada não existe" });

    try {
      const query = "INSERT INTO assunto (nome, materia_id) VALUES (?, ?)";
      const values = [nome, materia_id];

      connect.query(query, values, function (err) {
        if (err) return res.status(500).json({ error: "Erro interno do servidor" });
        return res.status(201).json({ message: "Assunto criado com sucesso" });
      });
    } catch (error) {
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  // Obtém todos os assuntos
  static async getAllAssuntos(req, res) {
    try {
      const query = "SELECT * FROM assunto";
      connect.query(query, function (err, results) {
        if (err) return res.status(500).json({ error: "Erro interno do servidor" });
        return res.status(200).json({ message: "Obtendo todos os assuntos", assuntos: results });
      });
    } catch (error) {
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  // Obtém um assunto pelo ID
  static async getAssuntoById(req, res) {
    const assunto_Id = req.params.id;

    try {
      const query = "SELECT * FROM assunto WHERE id_assunto = ?";
      const values = [assunto_Id];

      connect.query(query, values, function (err, results) {
        if (err) return res.status(500).json({ error: "Erro interno do servidor" });
        if (results.length === 0) return res.status(404).json({ error: "Assunto não encontrado" });
        return res.status(200).json({ message: "Obtendo assunto com ID: " + assunto_Id, assunto: results[0] });
      });
    } catch (error) {
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  // Atualiza um assunto
  static async updateAssunto(req, res) {
    const assunto_Id = req.params.id;
    const { nome } = req.body;

    if (!nome) return res.status(400).json({ error: "Nome é obrigatório" });

    try {
      const query = "UPDATE assunto SET nome = ? WHERE id_assunto = ?";
      const values = [nome, assunto_Id];

      connect.query(query, values, function (err, results) {
        if (err) return res.status(500).json({ error: "Erro interno do servidor" });
        if (results.affectedRows === 0) return res.status(404).json({ error: "Assunto não encontrado" });
        return res.status(200).json({ message: "Assunto atualizado com ID: " + assunto_Id });
      });
    } catch (error) {
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  // Exclui um assunto
  static async deleteAssunto(req, res) {
    const assunto_Id = req.params.id;

    try {
      const query = "DELETE FROM assunto WHERE id_assunto = ?";
      const values = [assunto_Id];

      connect.query(query, values, function (err, results) {
        if (err) return res.status(500).json({ error: "Erro interno do servidor" });
        if (results.affectedRows === 0) return res.status(404).json({ error: "Assunto não encontrado" });
        return res.status(200).json({ message: "Assunto excluído com ID: " + assunto_Id });
      });
    } catch (error) {
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
};
