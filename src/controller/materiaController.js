const connect = require("../db/connect");

module.exports = class materiaController {
  // Método para criar uma nova matéria
  static async createMateria(req, res) {
    const { nome } = req.body;

    // Verifica se o nome da matéria foi fornecido
    if (!nome) {
      return res.status(400).json({ error: "Nome é obrigatório" });
    }

    // Verifica se já existe uma matéria com o mesmo nome
    const overlapQuery = `SELECT * FROM materia WHERE nome = ?`;
    const [results] = await connect.promise().query(overlapQuery, [nome]);

    if (results.length > 0) {
      return res.status(400).json({ error: "Essa matéria já existe!" });
    }

    try {
      // Insere a nova matéria no banco de dados
      const query = "INSERT INTO materia (nome) VALUES (?)";
      const values = [nome];

      connect.query(query, values, function (err) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }
        return res.status(201).json({ message: "Matéria criada com sucesso" });
      });
    } catch (error) {
      console.error("Erro ao executar a consulta:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  // Método para obter todas as matérias
  static async getAllMaterias(req, res) {
    try {
      const query = "SELECT * FROM materia"; // Consulta para obter todas as matérias

      connect.query(query, function (err, results) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }

        return res
          .status(200)
          .json({ message: "Obtendo todas as matérias", materias: results });
      });
    } catch (error) {
      console.error("Erro ao executar a consulta:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  // Método para obter uma matéria pelo ID
  static async getMateriaNomeById(req, res) {
    const materiaId = req.params.id; // Obtém o ID da matéria da requisição

    try {
      const query = "SELECT nome FROM materia WHERE id_materia = ?"; // Consulta para obter o nome da matéria
      const values = [materiaId];
      const [results] = await connect.promise().query(query, values);

      if (results.length === 0) {
        return res.status(404).json({ error: "Matéria não encontrada" });
      }

      return res.status(200).json({ nome: results[0].nome });
    } catch (error) {
      console.error("Erro ao executar a consulta:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  // Método para obter todos os detalhes de uma matéria pelo ID
  static async getMateriaById(req, res) {
    const materiaId = req.params.id; // Obtém o ID da matéria

    try {
      const query = "SELECT * FROM materia WHERE id_materia = ?"; // Consulta para obter a matéria
      const values = [materiaId];

      connect.query(query, values, function (err, results) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }

        if (results.length === 0) {
          return res.status(404).json({ error: "Matéria não encontrada" });
        }

        return res.status(200).json({
          message: "Obtendo matéria com ID: " + materiaId,
          materia: results[0],
        });
      });
    } catch (error) {
      console.error("Erro ao executar a consulta:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  // Método para atualizar uma matéria
  static async updateMateria(req, res) {
    const materiaId = req.params.id; // Obtém o ID da matéria
    const { nome } = req.body; // Obtém o novo nome da matéria

    if (!nome || !materiaId) {
      return res.status(400).json({ error: "Nome é obrigatório" });
    }

    try {
      const query = "UPDATE materia SET nome = ? WHERE id_materia = ?"; // Consulta para atualizar a matéria
      const values = [nome, materiaId];

      connect.query(query, values, function (err, results) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }

        // Retorna erro se a matéria não for encontrada
        if (results.affectedRows === 0) {
          return res.status(404).json({ error: "Matéria não encontrada" });
        }

        return res
          .status(200)
          .json({ message: "Matéria atualizada com ID: " + materiaId });
      });
    } catch (error) {
      console.error("Erro ao executar a consulta:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  // Método para excluir uma matéria
  static async deleteMateria(req, res) {
    const materiaId = req.params.id; // Obtém o ID da matéria

    try {
      const query = "DELETE FROM materia WHERE id_materia = ?"; // Consulta para excluir a matéria
      const values = [materiaId];

      connect.query(query, values, function (err, results) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }

        // Retorna erro se a matéria não for encontrada
        if (results.affectedRows === 0) {
          return res.status(404).json({ error: "Matéria não encontrada" });
        }

        return res
          .status(200)
          .json({ message: "Matéria excluída com ID: " + materiaId });
      });
    } catch (error) {
      console.error("Erro ao executar a consulta:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  // Método para obter os assuntos de uma matéria específica
  static async getAssuntosByMateria(req, res) {
    const materiaId = req.params.id; // Obtém o ID da matéria

    try {
      const query = "SELECT * FROM assunto WHERE materia_id = ?"; // Consulta para obter os assuntos
      const values = [materiaId];

      connect.query(query, values, function (err, results) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }

        // Retorna erro se não houver assuntos
        if (results.length === 0) {
          return res
            .status(404)
            .json({ error: "Nenhum assunto encontrado para essa matéria" });
        }

        return res.status(200).json({
          message: `Obtendo assuntos para a matéria com ID: ${materiaId}`,
          assuntos: results,
        });
      });
    } catch (error) {
      console.error("Erro ao executar a consulta:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  // Método para obter os flashcards de um assunto específico
  static async getFlashcardsByAssunto(req, res) {
    const assuntoId = req.params.id; // Obtém o ID do assunto

    try {
      const query = "SELECT * FROM flashcards WHERE assunto_id = ?"; // Consulta para obter os flashcards
      const values = [assuntoId];

      connect.query(query, values, function (err, results) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }

        // Retorna erro se não houver flashcards
        if (results.length === 0) {
          return res
            .status(404)
            .json({ error: "Nenhum flashcard encontrado para esse assunto" });
        }

        return res.status(200).json({
          message: `Obtendo flashcards para o assunto com ID: ${assuntoId}`,
          flashcards: results,
        });
      });
    } catch (error) {
      console.error("Erro ao executar a consulta:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
  // Método para obter uma mensagem de teste
  static async getTesteDocker(req, res) {
    try {
      return res.status(200).json({ message: "Teste Docker Finzetto" });
    } catch (error) {
      console.error("Erro ao retornar a mensagem de teste:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
};
