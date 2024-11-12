const flashcardController = require("../controller/flashcardController");
const connect = require("../db/connect"); // Certifique-se de que está importando a conexão com o banco de dados corretamente

module.exports = class FilterFlashcards {
  static async obterFlashcards() {
    const palavrasProibidas = [
      "merda", "bosta", "porra", "caralho", "desgraça", "maldito", "maldita", 
      "fdp", "cacete", "puta", "puto", "vagabundo", "vagabunda", "imbecil", 
      "idiota", "otário", "otária", "babaca", "corno", "corna", "pilantra", 
      "burro", "burra", "escroto", "escrota", "meretriz", "fudido", "fudida", 
      "arrombado", "arrombada", "trouxa", "vaca", "chato", "chata", "cuzão", 
      "cuzona", "boçal", "retardado", "retardada", "pária", "nojento", "nojenta", 
      "inútil", "maluco", "maluca", "puta que pariu", "filho da puta", "filha da puta", 
      "se fudeu", "safado", "safada", "palerma"
    ];
    
    

    // Constrói uma expressão regular a partir das palavras proibidas
    const regexProibidas = new RegExp(`\\b(${palavrasProibidas.join('|')})\\b`, 'i');

    try {
      const [flashcards] = await flashcardController.getFlashcards(); // Adaptação para pegar o array de flashcards

      if (!Array.isArray(flashcards) || flashcards.length === 0) {
        console.log("Nenhum flashcard encontrado!");
        return;
      }

      // Itera sobre os flashcards
      for (const flashcard of flashcards) {
        const { flashcard_id, questao = "", resposta = "" } = flashcard;

        if (!flashcard_id) {
          console.log(`ID não encontrado para o flashcard`);
          continue; // Pula este flashcard se o ID não for encontrado
        }

        // Verifica se a questão ou a resposta contém palavras proibidas
        if (regexProibidas.test(questao) || regexProibidas.test(resposta)) {
          await deleteFlashcardFromDB(flashcard_id);
          console.log(`O flashcard com ID ${flashcard_id} foi deletado.`);
        } else {
          console.log(`Flashcard com ID ${flashcard_id} não contém palavras proibidas.`);
        }
      }
    } catch (error) {
      console.error(`Erro ao obter ou deletar flashcards: ${error.message}`);
    }
  }
};

// Função para deletar flashcard do banco de dados
async function deleteFlashcardFromDB(flashcardId) {
  try {
    const query = `DELETE FROM flashcards WHERE flashcard_id = ?`;
    await connect.promise().query(query, [flashcardId]);
    console.log(`Flashcard com ID ${flashcardId} deletado com sucesso.`);
  } catch (error) {
    console.error(`Erro ao deletar flashcard com ID ${flashcardId}: ${error.message}`);
    throw new Error("Erro ao deletar flashcard");
  }
}
