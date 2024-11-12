-- Criação do banco de dados eztudy
CREATE DATABASE IF NOT EXISTS eztudy CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Utilizando o banco de dados eztudy
USE eztudy;

-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: eztudy
-- ------------------------------------------------------
-- Server version	8.0.36

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `assunto`
--

DROP TABLE IF EXISTS `assunto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assunto` (
  `id_assunto` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `materia_id` int NOT NULL,
  PRIMARY KEY (`id_assunto`),
  KEY `materia_id` (`materia_id`),
  CONSTRAINT `assunto_ibfk_1` FOREIGN KEY (`materia_id`) REFERENCES `materia` (`id_materia`)
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assunto`
--

LOCK TABLES `assunto` WRITE;
/*!40000 ALTER TABLE `assunto` DISABLE KEYS */;
INSERT INTO `assunto` VALUES (1,'Equação',1),(2,'Literatura',2),(3,'Revolução Francesa',3),(4,'Climas do Mundo',4),(5,'Cadeia Alimentar',5),(6,'Verb to be',6),(7,'Futebol',7),(8,'Pintura a óleo',8),(9,'Genética',9),(10,'Leis de Newton',10),(11,'Tabela Periódica',11),(12,'Estratificação Social',12),(13,'Trigonometria',1),(14,'Análise Sintática',2),(15,'Geometria',1),(16,'Análise Sintática',2),(17,'Análise de Texto',2),(18,'Idade Média',3),(19,'Geopolítica',4),(20,'Astronomia',5),(21,'Ecossistema',5),(22,'Pronomes',6),(23,'Verbos Irregulares',6),(24,'Copa do Mundo',7),(25,'História da Arte',8),(26,'Biotecnologia',9),(27,'Células',9),(28,'Reações Químicas',10),(29,'Propriedades da Matéria',11),(30,'Movimento Social',12),(31,'Teorias Sociológicas',12),(32,'Polinômios',1),(33,'Ortografia',2),(34,'Guerra Fria',3),(35,'Recursos Naturais',4),(36,'Ciclo da Água',5),(37,'Present Perfect',6),(38,'Handebol',7),(39,'Escultura',8),(40,'Evolução das Espécies',9),(41,'Cinemática',10),(42,'Ácidos e Bases',11),(43,'Globalização',12),(44,'Lógica Matemática',1),(45,'Figuras de Linguagem',2),(46,'Imperialismo',3),(47,'Vegetação Brasileira',4),(48,'Fotossíntese',5),(49,'Past Continuous',6),(50,'Alongamento',7),(51,'Grafite',8),(52,'Ecologia',9),(53,'Termodinâmica',10),(54,'Ligações Químicas',11),(55,'Democracia',12),(56,'Ética e Filosofia',13),(57,'Existencialismo',13),(58,'Poesia Romântica',14),(59,'Interpretação de Textos',14),(60,'Banco de Dados',15),(61,'Redes de Computadores',15);
/*!40000 ALTER TABLE `assunto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `flashcards`
--

DROP TABLE IF EXISTS `flashcards`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `flashcards` (
  `flashcard_id` int NOT NULL AUTO_INCREMENT,
  `questao` varchar(255) NOT NULL,
  `resposta` varchar(255) NOT NULL,
  `id_usuario` int NOT NULL,
  `assunto_id` int NOT NULL,
  PRIMARY KEY (`flashcard_id`),
  KEY `id_usuario` (`id_usuario`),
  KEY `assunto_id` (`assunto_id`),
  CONSTRAINT `flashcards_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  CONSTRAINT `flashcards_ibfk_2` FOREIGN KEY (`assunto_id`) REFERENCES `assunto` (`id_assunto`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `flashcards`
--

LOCK TABLES `flashcards` WRITE;
/*!40000 ALTER TABLE `flashcards` DISABLE KEYS */;
INSERT INTO `flashcards` VALUES (1,'O que é uma equação linear?','É uma equação de 1º grau.',1,1),(2,'Quem escreveu \"Dom Casmurro\"?','Machado de Assis',1,2),(3,'O que é geometria?','É o ramo da matemática que estuda as propriedades e relações das figuras no espaço.',1,13),(4,'Quais são os tipos de triângulos?','Equilátero, Isósceles e Escaleno.',1,14),(5,'O que é uma oração simples?','É uma frase que contém apenas um sujeito e um predicado.',1,15),(6,'Qual a diferença entre texto narrativo e descritivo?','Narrativo conta uma história; descritivo descreve características.',1,16),(7,'Quando começou a Idade Média?','Em 476 d.C., com a queda do Império Romano.',1,17),(8,'O que é geopolítica?','É o estudo da influência geográfica sobre as relações políticas.',1,18),(9,'O que é astronomia?','É a ciência que estuda os corpos celestes e o universo.',1,19),(10,'O que é um ecossistema?','É a interação entre seres vivos e o ambiente em que vivem.',1,20),(11,'O que são pronomes?','Palavras que substituem ou acompanham os substantivos.',1,21),(12,'O que são verbos irregulares?','Verbos que não seguem a conjugação padrão.',1,22),(13,'Quantas seleções participaram da primeira Copa do Mundo?','13 seleções.',1,23),(14,'Quais são os principais movimentos artísticos?','Renascimento, Barroco, Impressionismo.',1,24),(15,'O que é biotecnologia?','É o uso de organismos vivos para criar produtos e processos úteis.',1,25),(16,'Qual é a unidade básica da vida?','A célula.',1,26),(17,'O que são reações químicas?','Processos onde substâncias se transformam em outras.',1,27),(18,'Quais são as propriedades da matéria?','Massa, volume, densidade e temperatura.',1,28),(19,'O que são movimentos sociais?','Ações coletivas de grupos que buscam mudanças sociais.',1,29),(20,'Quais são as principais teorias sociológicas?','Funcionalismo, Conflito e Interacionismo.',1,30),(21,'O que é uma equação do 1º grau?','É uma equação na qual a incógnita está elevada à primeira potência.',1,1),(22,'Qual é a forma geral de uma equação do 1º grau?','ax + b = 0, onde a e b são constantes e x é a incógnita.',1,1),(23,'Como resolver uma equação do 1º grau simples?','Isolando a variável x, passando os termos conhecidos para o outro lado da equação.',1,1),(24,'O que significa \"x\" em uma equação?','x representa a incógnita, o valor desconhecido que se deseja encontrar.',1,1),(25,'Como verificar se a solução de uma equação está correta?','Substituindo o valor de x na equação original e verificando se ambos os lados são iguais.',1,1),(26,'O que é uma equação com uma variável?','É uma equação onde apenas uma incógnita (variável) está presente, como x ou y.',1,1),(27,'Qual é o papel do coeficiente na equação do 1º grau?','O coeficiente é o número que multiplica a variável e indica sua relação com os termos conhecidos.',1,1),(28,'O que é uma equação homogênea do 1º grau?','É uma equação onde todos os termos são proporcionais a uma única variável, como 2x = 4.',1,1);
/*!40000 ALTER TABLE `flashcards` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `materia`
--

DROP TABLE IF EXISTS `materia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `materia` (
  `id_materia` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  PRIMARY KEY (`id_materia`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `materia`
--

LOCK TABLES `materia` WRITE;
/*!40000 ALTER TABLE `materia` DISABLE KEYS */;
INSERT INTO `materia` VALUES (1,'Matemática'),(2,'Português'),(3,'História'),(4,'Geografia'),(5,'Ciências'),(6,'Inglês'),(7,'Educação Física'),(8,'Artes'),(9,'Biologia'),(10,'Física'),(11,'Química'),(12,'Sociologia'),(13,'Filosofia'),(14,'Literatura'),(15,'TI'),(16,'Espanhol');
/*!40000 ALTER TABLE `materia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `senha` varchar(255) NOT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Eu','eu','eu'),(2,'Gabriel','gabriel@gmail.com','abc123456@'),(3,'Thayne','thayne@gmail.com','abc123456@'),(4,'Admin','admin@gmail.com','admin12345@');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-10-29 14:05:14
