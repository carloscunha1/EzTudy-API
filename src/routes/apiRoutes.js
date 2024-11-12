const router = require("express").Router();

const userController = require('../controller/userController');
const assuntoController = require('../controller/assuntoController');
const materiaController = require('../controller/materiaController');
const flashcardController = require('../controller/flashcardController');

//Flashcards
router.post('/flashcards', flashcardController.createFlashcard);
router.get('/flashcards', flashcardController.getAllFlashcards);
router.get('/flashcardsarr', flashcardController.getFlashcards);
router.put('/flashcards/:flashcardId', flashcardController.updateFlashcard);
router.delete('/deleteFlashcard/:flashcard_id', flashcardController.deleteFlashcard);
router.get("/assunto/:id/flashcards", materiaController.getFlashcardsByAssunto);
router.get('/flashcards/usuario/:id_usuario', flashcardController.getFlashcardsByUser);
router.get('/flashcards/question', flashcardController.getFlashcardByQuestion);
router.get('/flashcards/matter', flashcardController.getFlashcardByMatter);

//User
router.post("/user/", userController.createUser);
router.post("/user/login", userController.postLogin);
router.get("/user/", userController.getAllUsers);
router.get("/user/:id", userController.getUserById);
router.put("/user/:id", userController.updateUser);
router.delete("/user/:id", userController.deleteUser);

//Materia
router.post("/materia/", materiaController.createMateria);
router.get("/materia/", materiaController.getAllMaterias);
router.get("/materia/:id", materiaController.getMateriaById);
router.put("/materia/:id", materiaController.updateMateria);
router.delete("/materia/:id", materiaController.deleteMateria);
router.get("/materia/:id/nome", materiaController.getMateriaNomeById);

router.get("/dockertest/", materiaController.getTesteDocker);

//Assunto
router.post("/assunto/", assuntoController.createAssunto);
router.get("/assunto/", assuntoController.getAllAssuntos);
router.get("/assunto/:id", assuntoController.getAssuntoById);
router.put("/assunto/:id", assuntoController.updateAssunto);
router.delete("/assunto/:id", assuntoController.deleteAssunto);
router.get("/materia/assuntos/:id", materiaController.getAssuntosByMateria);



module.exports = router;