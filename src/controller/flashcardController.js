const connect = require("../db/connect");

module.exports = class flashcardController {
  //Validação geral para campos vazios 
  static async validateFlashcard(req, res) {
    const { questao, resposta, assunto_id } = req.body;
    try {
      if (!questao || !resposta || !assunto_id) {
        throw new Error("Preencha a pergunta e a resposta do flashcard.");
      }

      if (questao.length > 80 || resposta.length > 80) {
        throw new Error(
          "O flashcard precisa ter 80 caracteres ou menos para ser validado!"
        );
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  //Função de validação quando a função exige apenas a questão 
  static async validateQuestion(req, res) {
    const { questao } = req.body;
    try {
      if (!questao) {
        throw new Error("Preencha a pergunta do flashcard.");
      }
      return res.status(200);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro no servidor" });
    }
  }

  static async createFlashcard(req, res) {
    await flashcardController.validateFlashcard(req, res);
    const { questao, resposta, assunto_id, id_usuario } = req.body;

    try {
      const overlapQuery = `SELECT * FROM flashcards WHERE questao = ?`;
      const [results] = await connect.promise().query(overlapQuery, [questao]);

      if (results.length > 0) {
        throw new Error("Já existe um flashcard com essa pergunta!");
      }

      const insertQuery = `INSERT INTO flashcards (questao, resposta, assunto_id, id_usuario) VALUES (?, ?, ?, ?)`;
      const values = [questao, resposta, assunto_id, id_usuario];
      await connect.promise().query(insertQuery, values);

      return res.status(201).json({ message: "Flashcard criado com sucesso!" });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: `Erro ao criar flashcard: ${error.message}` });
    }
  }

  static async getFlashcardByQuestion(req, res) {
    const { questao } = req.body;

    try {
      await flashcardController.validateQuestion(req, res);

      const query = `SELECT questao, resposta FROM flashcards WHERE questao LIKE ?`;
      const [results] = await connect.promise().query(query, [`%${questao}%`]);

      if (results.length === 0) {
        return res
          .status(404)
          .json({
            error: "Não encontramos flashcards compatíveis com a pesquisa.",
          });
      }
      const flashcards = results.map((result) => ({
        pergunta: result.questao,
        resposta: result.resposta,
      }));
      return res.status(201).json({ flashcards });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Erro ao obter o flashcards: " + error.message });
    }
  }
  
  static async getFlashcardByMatter(req, res) {
    const { id_materia } = req.body;

    try {
        const query = `
            SELECT f.flashcard_id, f.questao, f.resposta
            FROM flashcards f
            INNER JOIN assunto a ON f.assunto_id = a.id_assunto
            INNER JOIN materia m ON a.materia_id = m.id_materia
            WHERE m.id_materia = ?;
        `;
        
        const [results] = await connect
            .promise()
            .query(query, [id_materia]);

        if (results.length === 0) {
            throw new Error("Não encontramos flashcards para essa matéria.");
        }
        
        return res.status(200).json({ results });
    } catch (error) {
        return res.status(500).json({ error: `Erro ao obter os flashcards: ${error.message}` });
    }
}

static async getUserFlashcardsByMatter(req, res) {
  const { id_materia } = req.body;
  const { id_usuario } = req.params;

  try {
      const query = `
          SELECT f.flashcard_id, f.questao, f.resposta
          FROM flashcards f
          INNER JOIN assunto a ON f.assunto_id = a.id_assunto
          INNER JOIN materia m ON a.materia_id = m.id_materia
          WHERE m.id_materia = ? AND f.id_usuario = ?;
      `;
      
      const [results] = await connect
          .promise()
          .query(query, [id_materia, id_usuario]);

      if (results.length === 0) {
          throw new Error("Não encontramos flashcards para essa matéria e usuário.");
      }
      
      return res.status(200).json({ results });
  } catch (error) {
      return res.status(500).json({ error: `Erro ao obter os flashcards: ${error.message}` });
  }
}

  //Obtém todos os flashcards
  static async getAllFlashcards(req, res) {
    try {
      const query = `SELECT * FROM flashcards`;
      const [results] = await connect.promise().query(query);
      if (results.length === 0) {
        throw new Error("Não encontramos nenhum flashcard.");
      }
      return res.status(201).json({ results });
    } catch (error) {
      console.log(error);
      throw new Error(`Erro ao obter todos os flashcards: ${error.message}`);
    }
  }

  static async getFlashcardsByUser(req, res) {
    const { id_usuario } = req.params;

    try {
      const query = `SELECT * FROM flashcards WHERE id_usuario = ?`;
      const [results] = await connect.promise().query(query, [id_usuario]);

      if (results.length === 0) {
        return res
          .status(404)
          .json({ message: "Nenhum flashcard encontrado para esse usuário." });
      }

      return res.status(200).json({ flashcards: results });
    } catch (error) {
      console.error(
        `Erro ao obter flashcards para o usuário ${id_usuario}: ${error.message}`
      );
      return res
        .status(500)
        .json({ message: `Erro ao obter flashcards: ${error.message}` });
    }
  }
  //Obtém os todos os flashcards os retornando como um array, para que sejam analisados pela biblioteca externa afim de validá-los 
  static async getFlashcards(req, res) {
    try {
      const query = `SELECT * FROM flashcards`;
      const [results] = await connect.promise().query(query);
      return [results];
    } catch (error) {
      console.error(`Erro ao obter todos os flashcards: ${error.message}`);
    }
  }
  
  static async updateFlashcard(req, res) {
    const { questao, resposta, id_usuario, assunto_id } = req.body; 
    const { flashcardId } = req.params; 

    await flashcardController.validateFlashcard(req, res);
  
    try {
  
      // Query para atualizar os campos do flashcard
      const updateQuery = `
        UPDATE flashcards 
        SET questao = ?, resposta = ?, id_usuario = ?, assunto_id = ? 
        WHERE flashcard_id = ?
      `;
      
      const values = [questao, resposta, id_usuario, assunto_id, flashcardId]; // Inclui os novos valores no array
      await connect.promise().query(updateQuery, values); // Executa a query
  
      return res.status(200).json({ message: "Flashcard atualizado com sucesso!" }); // Retorna status 200 para sucesso
    } catch (error) {
      // Log detalhado e resposta de erro ao cliente
      console.error(`Erro ao atualizar o flashcard: ${error.message}`);
      return res.status(500).json({ error: `Erro ao atualizar o flashcard: ${error.message}` });
    }
  }

  static async deleteFlashcard(req, res) {
    const { flashcard_id  } = req.params; // Use 'id' do parâmetro da URL
    try {
      const deleteQuery = `DELETE FROM flashcards WHERE flashcard_id = ?`;
      const [results] = await connect.promise().query(deleteQuery, [flashcard_id ]);

      // Verifica se o flashcard foi deletado
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Flashcard não encontrado" });
      }

      return res
        .status(200)
        .json({ message: "Flashcard deletado com sucesso" });
    } catch (error) {
      console.error("Erro ao deletar o flashcard:", error.message);
      return res
        .status(500)
        .json({ message: `Erro ao deletar o flashcard: ${error.message}` });
    }
  }
};
