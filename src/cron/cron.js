const cron = require("node-cron");
const filtro = require("../services/flashcardFilter");

cron.schedule(" 0 */12 * * *", async () => {
  try {
    console.log("Iniciando a execução do filtro de flashcards...");
    await filtro.obterFlashcards();
    console.log("Filtro de flashcards executado com sucesso.");
  } catch (error) {
    console.error("Erro ao executar limpeza automática:", error);
  }
});
