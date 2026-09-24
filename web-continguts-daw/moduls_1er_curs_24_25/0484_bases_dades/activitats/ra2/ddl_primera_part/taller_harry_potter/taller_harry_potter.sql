-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: taller_harry_potter
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `casa`
--

DROP TABLE IF EXISTS `casa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `casa` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10002 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `casa`
--

LOCK TABLES `casa` WRITE;
/*!40000 ALTER TABLE `casa` DISABLE KEYS */;
INSERT INTO `casa` VALUES (1,'Hufflepuff'),(2,'Gryffindor'),(4,'Slytherin'),(10001,'Ravenclaw');
/*!40000 ALTER TABLE `casa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `classes`
--

DROP TABLE IF EXISTS `classes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `classes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `materia` varchar(50) DEFAULT NULL,
  `profe_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_classe_profe` (`profe_id`),
  CONSTRAINT `fk_classe_profe` FOREIGN KEY (`profe_id`) REFERENCES `profe` (`id`) ON DELETE SET NULL ON UPDATE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `classes`
--

LOCK TABLES `classes` WRITE;
/*!40000 ALTER TABLE `classes` DISABLE KEYS */;
INSERT INTO `classes` VALUES (1,'Pocions',1),(2,'Transfiguracio',2),(3,'Encants',3),(4,'Herbologia',4),(5,'Defensa contra les arts oscures',5),(6,'Astronomia',6),(7,'Vol',7),(8,'Estudis dels Muggle',8),(9,'Historia de la Magia',9),(10,'Director',10);
/*!40000 ALTER TABLE `classes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estudiant`
--

DROP TABLE IF EXISTS `estudiant`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estudiant` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(50) NOT NULL,
  `anyo` int NOT NULL,
  `casa_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_estudiant_casa` (`casa_id`),
  CONSTRAINT `fk_estudiant_casa` FOREIGN KEY (`casa_id`) REFERENCES `casa` (`id`) ON DELETE SET NULL ON UPDATE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=281 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estudiant`
--

LOCK TABLES `estudiant` WRITE;
/*!40000 ALTER TABLE `estudiant` DISABLE KEYS */;
INSERT INTO `estudiant` VALUES (1,'Waino Pouros',7,2),(2,'Daren Ortiz',3,4),(3,'Elbert Moore',6,2),(4,'Kaylee Grady',4,1),(5,'Elna Jacobs',1,2),(6,'Alisha Hartmann',4,2),(7,'Mya Dooley',1,4),(8,'Luigi Mante',2,4),(9,'Ella Stroman',4,2),(10,'Moses Prohaska',5,NULL),(11,'Ray Hermann',7,4),(12,'Sherman DuBuque',2,2),(13,'Sasha Volkman ',6,1),(14,'Ivah Kertzmann',6,1),(15,'Margret Blick',2,2),(16,'Marisol Armstrong',4,NULL),(17,'Holden Bahringer',4,NULL),(18,'Maximillia Brakus',5,4),(19,'Ashly Haley',7,4),(20,'Arnaldo Moore',7,1),(21,'Sarina Gottlieb',5,2),(22,'Brook Mraz',5,2),(23,'Mack Hills',2,2),(24,'Micaela DuBuque',3,1),(25,'Magnolia Schmidt',7,1),(26,'Kenneth Ryan',4,1),(27,'Alek Windler',6,2),(28,'Florian Feeney',2,4),(29,'Audie Hamill',4,NULL),(30,'Rhoda Jast',5,4),(31,'Lorena Wilderman',1,NULL),(32,'Dasia Roberts',1,2),(33,'Roy Runte',1,NULL),(34,'Matteo Feeney ',6,NULL),(35,'Electa Gislason',7,2),(36,'Natalie Russel',4,1),(37,'Oswaldo Daugherty',6,NULL),(38,'Fred Veum',2,NULL),(39,'Nels Thiel',3,2),(40,'Shawn Moen',2,NULL),(41,'Alfredo Hackett ',1,1),(42,'Arturo Nitzsche',5,2),(43,'Camille Stoltenberg',5,2),(44,'Ashlee Konopelski',5,NULL),(45,'Harmony Okuneva',1,2),(46,'Jacklyn Hilpert',7,2),(47,'Edward Mante',7,2),(48,'Orville Simonis',1,4),(49,'Antwon Johnson',3,2),(50,'Allie Schaefer',5,4),(51,'Zelda Schuster',3,NULL),(52,'Carleton Farrell',2,2),(53,'Ernesto Krajcik',1,1),(54,'Jason Marks',4,4),(55,'Elmer Swaniawski',4,4),(56,'Dawn Rosenbaum',2,4),(57,'Maryam Miller',6,1),(58,'Perry Konopelski',4,4),(59,'Jennie Raynor',4,NULL),(60,'Jermey Hills',2,1),(61,'Ari Klein',6,1),(62,'Alisa Brakus',5,4),(63,'Stephanie Bechtelar',1,1),(64,'Cornelius Daugherty ',5,2),(65,'Frieda Hayes',4,1),(66,'Angelina Hyatt',2,2),(67,'Cletus Hudson',2,NULL),(68,'Maxwell Parisian',1,NULL),(69,'Dario Blick',4,4),(70,'Camille Ryan ',7,NULL),(71,'Andy Reichert',3,2),(72,'Reid Romaguera',5,2),(73,'Nedra Russel',3,1),(74,'Lonny Quigley',5,NULL),(75,'Gerardo Grimes',7,1),(76,'Gaylord Mertz',2,1),(77,'Keira McDermott',7,NULL),(78,'Chadd Ledner',1,1),(79,'Earnestine Schulist',2,1),(80,'Scarlett Greenholt',2,1),(81,'Haylie Hintz ',6,NULL),(82,'Marion Rolfson',5,2),(83,'Shemar Rempel',7,NULL),(84,'Cristopher Ortiz',5,1),(85,'Aglae Nolan',4,2),(86,'Ellen Weissnat',1,1),(87,'Luther Smith',3,NULL),(88,'Vickie Feest ',7,NULL),(89,'Cheyenne Tillman',4,NULL),(90,'Carmine Friesen',4,2),(91,'Dee Morissette',5,2),(92,'Alvis Wuckert',4,2),(93,'Kayley Kling',3,1),(94,'Maeve Emard',4,1),(95,'Destin Roob',6,2),(96,'Morris Howe ',3,1),(97,'Cedrick Kuhn',3,1),(98,'Modesta Maggio',3,1),(99,'Edwardo Windler',2,NULL),(100,'Deshaun Collins',3,4),(101,'Rubie Mayert',7,2),(102,'Joseph Swift',2,4),(103,'Earnest Bernier',7,4),(104,'Meredith Herzog',7,1),(105,'Ambrose Reichert',1,1),(106,'Jerad Bailey',3,4),(107,'Alia Fadel',1,4),(108,'Mathilde Rosenbaum',2,1),(109,'Stephania Altenwerth',4,2),(110,'Nasir Runte',7,NULL),(111,'Conner Sawayn',2,NULL),(112,'Buster Beahan',1,2),(113,'Carlee Gorczany',3,4),(114,'Bettye Mosciski',2,1),(115,'Eugene Reinger',1,1),(116,'Breanna Bernhard',1,NULL),(117,'Davonte Pouros',1,NULL),(118,'Kay Luettgen',6,NULL),(119,'Zane Kerluke',6,1),(120,'Dawson Towne ',3,1),(121,'Lou Jacobi',2,NULL),(122,'Vena Friesen',1,NULL),(123,'Brett Tremblay',2,4),(124,'Gage Schinner',7,2),(125,'Kirk Lehner ',4,1),(126,'Corrine Sipes',3,4),(127,'Danyka Goodwin',1,NULL),(128,'Jack Kemmer ',4,4),(129,'Kyleigh Nader',6,NULL),(130,'Chauncey Mitchell',2,1),(131,'Eula Zboncak',4,4),(132,'Kathryn Schamberger',1,NULL),(133,'Alec Wisozk',7,1),(134,'Buddy Reynolds ',7,4),(135,'Fleta Schuster',3,1),(136,'Wava Ledner',3,4),(137,'Marian Bernier',4,NULL),(138,'Deja Block',3,4),(139,'Elmo Runte',2,1),(140,'Stephany Franecki',7,NULL),(141,'Dell Kuphal ',1,2),(142,'Verona OReilly',3,NULL),(143,'Ebony Bailey ',6,4),(144,'Dawn Cartwright',1,NULL),(145,'Edward Hegmann ',1,1),(146,'Dorthy Bartoletti',3,2),(147,'Macey Fisher',1,NULL),(148,'Lukas Gibson',3,1),(149,'Magdalen OHara',3,NULL),(150,'Stanley Reynolds',4,1),(151,'Rolando Gutkowski',4,2),(152,'Brice Rohan ',4,1),(153,'Darrion Gottlieb',4,1),(154,'Parker Ryan',5,2),(155,'Della Cruickshank',6,2),(156,'Scarlett Hodkiewicz',5,NULL),(157,'Finn Emard',6,NULL),(158,'Evert Upton',4,NULL),(159,'Bradly Koelpin',7,NULL),(160,'Brock Quitzon',1,2),(161,'Gladyce Champlin',1,2),(162,'Audrey Bednar',4,2),(163,'Vidal Marvin',1,NULL),(164,' Grady Osinski',6,2),(165,'Neha Zemlak',2,1),(166,'Ally Rau',5,1),(167,'Raina Kovacek',4,1),(168,'Irving Marquardt',6,2),(169,'Cordia Padberg',6,1),(170,'Stuart Predovic',6,1),(171,'Malinda Boyer',3,4),(172,'Germaine Kunde',4,4),(173,'Adrain Denesik',5,1),(174,'Kathryn Treutel',1,1),(175,'Gudrun Schowalter',3,1),(176,'Dedrick Jast',4,1),(177,'Rosina Kertzmann',4,4),(178,'Gideon Leannon',1,1),(179,'Adeline Wuckert',1,NULL),(180,'Felix Larkin',5,1),(181,'Chadd Lockman',6,2),(182,'Icie Koch',5,NULL),(183,'Claudia Wolf',1,4),(184,'Cindy Ullrich',1,2),(185,'Brycen Lueilwitz',3,NULL),(186,'Winnifred Macejkovic',3,1),(187,'Kallie Schmitt ',3,4),(188,'Noah Streich',3,2),(189,'Evans Kiehn',1,NULL),(190,'Sidney Kihn ',2,NULL),(191,'Fletcher Leannon',2,1),(192,'Carol Champlin',2,1),(193,'Adelle Dare',3,NULL),(194,'Otho Murazik',1,1),(195,'Viola VonRueden',6,4),(196,'Easton Gusikowski',1,NULL),(197,'Merlin Moore ',7,NULL),(198,' Kirsten Leffler',2,4),(199,'Janie Nienow',1,1),(200,'Seamus Kuvalis',7,2),(201,'Audreanne Harber',1,1),(202,'Ila Torphy',3,4),(203,'Marcelino Anderson',4,1),(204,'Boyd Ebert',7,1),(205,'Heaven Haley',4,1),(206,'Kaya Marquardt',1,4),(207,'Rodrigo Bogisich',5,NULL),(208,'Tiffany Schmidt',5,2),(209,'Isabelle Tromp',1,4),(210,'Annabel Considine',6,NULL),(211,'Carroll Waters',6,1),(212,'Aurelio Eichmann',3,2),(213,'Winnifred Hilll',2,NULL),(214,'Holly Fay',1,1),(215,'Burdette Herman',2,1),(216,'Calista Feeney',4,NULL),(217,'Dillon Green',4,4),(218,'Willy Dach',5,4),(219,'Gage Heller',7,2),(220,'Ryleigh Lakin',4,NULL),(221,'Ida Stokes',3,2),(222,'Roselyn Johnson ',2,1),(223,'Lea Franecki',1,1),(224,'Katherine Herman',4,1),(225,'Kendall Gerlach',7,1),(226,'Joshuah Collier',6,2),(227,'Edmond Swift',7,1),(228,'Savanah Reichert',6,2),(229,'Garnet Davis',4,4),(230,'Efren Cassin',5,4),(231,'Kip Jacobs',2,2),(232,'Michale Collins',4,1),(233,'Harley Hammes',3,1),(234,'Gerry Wilkinson',2,NULL),(235,'Tyrique Ullrich',3,1),(236,'Kellie Herzog',5,NULL),(237,'Santina Roob ',4,1),(238,'Garrison Doyle',1,4),(239,'Malachi Bartell',5,NULL),(240,'Rossie Schaefer',2,NULL),(241,'Ewald Beer',3,4),(242,'Arjun Hegmann',5,1),(243,'Green Kunde',2,4),(244,'Delia Kuphal ',3,1),(245,'Florida Hamill',7,4),(246,'Stephania Franecki',5,1),(247,'Renee Conn',7,4),(248,'Eusebio Lockman',4,4),(249,'Lauriane Sipes',6,2),(250,'Sabrina Hagenes',3,4),(251,'Rosendo Schaden ',4,NULL),(252,'Kaci Klocko ',5,NULL),(253,'Iliana Will',6,4),(254,'Aurelie Boyle',4,NULL),(255,'Taurean Satterfield',1,2),(256,'Liam Kris ',4,NULL),(257,'Reagan Kris',4,NULL),(258,'Athena Fritsch',1,NULL),(259,'Jena Johns',6,NULL),(260,'Nolan Little',3,4),(261,'Elisabeth Lehner',2,4),(262,'Gaetano Simonis',7,2),(263,'Claire Bode',1,1),(264,'Elliot Witting',3,1),(265,'Lois Beer',5,1),(266,'Shanelle Willms',1,4),(267,'Dovie Cartwright',2,NULL),(268,'Kurtis Hermann',2,2),(269,'Floyd Schuppe',5,NULL),(270,'Matt Wehner',3,4),(271,'Danielle Dickinson',6,NULL),(272,'Mariana Cormier ',5,2),(273,'Nadia Hoeger',1,2),(274,'Verla Reynolds',4,2),(275,'Sylvester Skiles',5,2),(276,'Susie Bosco',5,1),(277,'Delaney Leannon',7,4),(278,'Ansel Rice',5,4),(279,'Abdul Mitchell',6,1),(280,'Landen Zulauf',6,NULL);
/*!40000 ALTER TABLE `estudiant` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profe`
--

DROP TABLE IF EXISTS `profe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `profe` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(50) DEFAULT NULL,
  `casa_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_profe_casa` (`casa_id`),
  CONSTRAINT `fk_profe_casa` FOREIGN KEY (`casa_id`) REFERENCES `casa` (`id`) ON DELETE SET NULL ON UPDATE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profe`
--

LOCK TABLES `profe` WRITE;
/*!40000 ALTER TABLE `profe` DISABLE KEYS */;
INSERT INTO `profe` VALUES (1,'Severus Snape',4),(2,'Minerva McGonagall',2),(3,'Filius Flitwick',NULL),(4,'Pomona Sprout',1),(5,'Remus Lupin',NULL),(6,'Aurora Sinistra',NULL),(7,'Rolanda Hooch',NULL),(8,'Charity Burbage',NULL),(9,'Cuthbert Binns',NULL),(10,'Albus Dumbledore',NULL);
/*!40000 ALTER TABLE `profe` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-01-10  9:59:13
