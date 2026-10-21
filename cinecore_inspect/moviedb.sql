-- MySQL dump 10.13  Distrib 26.7.0, for macos15 (arm64)
--
-- Host: localhost    Database: MovieDB
-- ------------------------------------------------------
-- Server version	26.7.0

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
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '180c91c6-90ff-11f1-94da-d3c974eb3f76:1-35';

--
-- Table structure for table `ACTORS`
--

DROP TABLE IF EXISTS `ACTORS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ACTORS` (
  `AID` int NOT NULL,
  `Name` varchar(50) NOT NULL,
  `Age` int NOT NULL,
  `Gender` varchar(50) NOT NULL,
  PRIMARY KEY (`AID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ACTORS`
--

LOCK TABLES `ACTORS` WRITE;
/*!40000 ALTER TABLE `ACTORS` DISABLE KEYS */;
INSERT INTO `ACTORS` VALUES (1,'Leonardo DiCaprio',49,'Male'),(2,'Scarlett Johansson',39,'Female'),(3,'Christian Bale',50,'Male'),(4,'Aamir Khan',59,'Male'),(5,'Shah Rukh Khan',58,'Male'),(6,'Kareena Kapoor',43,'Female'),(7,'Robert Downey Jr.',59,'Male'),(8,'Tom Holland',28,'Male'),(9,'Deepika Padukone',38,'Female'),(10,'Ranveer Singh',39,'Male'),(11,'Hrithik Roshan',50,'Male'),(12,'Alia Bhatt',31,'Female'),(13,'Chris Evans',43,'Male'),(14,'Emma Stone',35,'Female'),(15,'Matt Damon',53,'Male'),(16,'Natalie Portman',42,'Female'),(17,'Ranbir Kapoor',41,'Male'),(18,'Priyanka Chopra',42,'Female'),(19,'Keanu Reeves',59,'Male'),(20,'Gal Gadot',39,'Female'),(21,'Kabir Rao',29,'Male');
/*!40000 ALTER TABLE `ACTORS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DIRECTOR`
--

DROP TABLE IF EXISTS `DIRECTOR`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DIRECTOR` (
  `DID` int NOT NULL,
  `Name` varchar(50) NOT NULL,
  `Age` int NOT NULL,
  PRIMARY KEY (`DID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DIRECTOR`
--

LOCK TABLES `DIRECTOR` WRITE;
/*!40000 ALTER TABLE `DIRECTOR` DISABLE KEYS */;
INSERT INTO `DIRECTOR` VALUES (1,'Christopher Nolan',53),(2,'Steven Spielberg',77),(3,'Joss Whedon',59),(4,'Rajkumar Hirani',61),(5,'Nitesh Tiwari',50),(6,'Atlee',37),(7,'Anthony Russo',54),(8,'Joe Russo',53),(9,'Sanjay Leela Bhansali',61),(10,'Zoya Akhtar',51),(11,'James Cameron',69),(12,'Siddharth Anand',46),(13,'Arjun Mehta',38);
/*!40000 ALTER TABLE `DIRECTOR` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `highlyratedmovies`
--

DROP TABLE IF EXISTS `highlyratedmovies`;
/*!50001 DROP VIEW IF EXISTS `highlyratedmovies`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `highlyratedmovies` AS SELECT 
 1 AS `MID`,
 1 AS `Name`,
 1 AS `Genre`,
 1 AS `FilmIndustry`,
 1 AS `ReleaseDate`,
 1 AS `IMDbRating`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `MOVIE_ACTORS`
--

DROP TABLE IF EXISTS `MOVIE_ACTORS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `MOVIE_ACTORS` (
  `MID` int NOT NULL,
  `AID` int NOT NULL,
  PRIMARY KEY (`MID`,`AID`),
  KEY `AID` (`AID`),
  CONSTRAINT `movie_actors_ibfk_1` FOREIGN KEY (`MID`) REFERENCES `MOVIES` (`MID`),
  CONSTRAINT `movie_actors_ibfk_2` FOREIGN KEY (`AID`) REFERENCES `ACTORS` (`AID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `MOVIE_ACTORS`
--

LOCK TABLES `MOVIE_ACTORS` WRITE;
/*!40000 ALTER TABLE `MOVIE_ACTORS` DISABLE KEYS */;
INSERT INTO `MOVIE_ACTORS` VALUES (101,1),(102,2),(110,2),(111,2),(103,3),(109,3),(104,4),(105,4),(125,4),(127,4),(106,5),(122,5),(123,5),(124,5),(104,6),(127,6),(102,7),(110,7),(111,7),(112,7),(113,7),(113,8),(122,9),(123,9),(124,9),(128,9),(129,9),(135,9),(136,9),(128,10),(129,10),(131,10),(132,10),(133,10),(134,11),(135,11),(136,11),(130,12),(132,12),(102,13),(110,13),(111,13),(112,13),(115,14),(116,14),(107,15),(108,15),(114,15),(117,15),(112,16),(117,16),(126,17),(131,18),(133,18),(120,19),(121,19),(118,20),(119,20),(134,20),(137,21);
/*!40000 ALTER TABLE `MOVIE_ACTORS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `MOVIE_AUDIT`
--

DROP TABLE IF EXISTS `MOVIE_AUDIT`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `MOVIE_AUDIT` (
  `AuditID` int NOT NULL AUTO_INCREMENT,
  `MID` int DEFAULT NULL,
  `MovieName` varchar(50) DEFAULT NULL,
  `ActionType` varchar(20) DEFAULT NULL,
  `OldRating` decimal(3,1) DEFAULT NULL,
  `NewRating` decimal(3,1) DEFAULT NULL,
  `ActionTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`AuditID`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `MOVIE_AUDIT`
--

LOCK TABLES `MOVIE_AUDIT` WRITE;
/*!40000 ALTER TABLE `MOVIE_AUDIT` DISABLE KEYS */;
INSERT INTO `MOVIE_AUDIT` VALUES (1,137,'Test Movie','INSERT',NULL,8.5,'2026-09-23 07:00:14'),(2,137,'Test Movie','UPDATE',8.5,9.0,'2026-09-23 07:01:33'),(3,137,'Test Movie','DELETE',9.0,NULL,'2026-09-23 07:02:24'),(4,137,'Krrish 3','INSERT',NULL,8.0,'2026-10-07 07:18:50'),(5,137,'Krrish 3','DELETE',8.0,NULL,'2026-10-07 07:21:22'),(6,105,'Dangal','UPDATE',8.3,8.2,'2026-10-07 07:23:05'),(7,105,'Dangal','UPDATE',8.2,8.3,'2026-10-07 07:23:25'),(8,137,'Neon Horizon','INSERT',NULL,8.7,'2026-10-07 13:07:41');
/*!40000 ALTER TABLE `MOVIE_AUDIT` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `movieactorsview`
--

DROP TABLE IF EXISTS `movieactorsview`;
/*!50001 DROP VIEW IF EXISTS `movieactorsview`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `movieactorsview` AS SELECT 
 1 AS `MovieName`,
 1 AS `ActorName`,
 1 AS `IMDbRating`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `moviedetails`
--

DROP TABLE IF EXISTS `moviedetails`;
/*!50001 DROP VIEW IF EXISTS `moviedetails`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `moviedetails` AS SELECT 
 1 AS `MID`,
 1 AS `MovieName`,
 1 AS `Genre`,
 1 AS `FilmIndustry`,
 1 AS `ReleaseDate`,
 1 AS `IMDbRating`,
 1 AS `Producer`,
 1 AS `Director`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `MOVIES`
--

DROP TABLE IF EXISTS `MOVIES`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `MOVIES` (
  `MID` int NOT NULL,
  `Name` varchar(50) NOT NULL,
  `Genre` varchar(50) NOT NULL,
  `FilmIndustry` varchar(50) NOT NULL,
  `ReleaseDate` date NOT NULL,
  `IMDbRating` decimal(3,1) DEFAULT NULL,
  `PID` int DEFAULT NULL,
  `DID` int DEFAULT NULL,
  PRIMARY KEY (`MID`),
  KEY `PID` (`PID`),
  KEY `DID` (`DID`),
  CONSTRAINT `movies_ibfk_1` FOREIGN KEY (`PID`) REFERENCES `PRODUCER` (`PID`),
  CONSTRAINT `movies_ibfk_2` FOREIGN KEY (`DID`) REFERENCES `DIRECTOR` (`DID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `MOVIES`
--

LOCK TABLES `MOVIES` WRITE;
/*!40000 ALTER TABLE `MOVIES` DISABLE KEYS */;
INSERT INTO `MOVIES` VALUES (101,'Inception','Sci-Fi','Hollywood','2010-07-16',8.8,1,1),(102,'The Avengers','Action','Hollywood','2012-05-04',8.0,2,3),(103,'The Dark Knight','Action','Hollywood','2008-07-18',9.0,1,1),(104,'3 Idiots','Comedy-Drama','Bollywood','2009-12-25',8.4,4,4),(105,'Dangal','Biography','Bollywood','2016-12-23',8.3,6,5),(106,'Jawan','Action','Bollywood','2023-09-07',6.9,5,6),(107,'Interstellar','Sci-Fi','Hollywood','2014-11-07',8.7,1,1),(108,'Tenet','Sci-Fi','Hollywood','2020-08-26',7.3,1,1),(109,'Oppenheimer','Biography','Hollywood','2023-07-21',8.6,1,1),(110,'Avengers Endgame','Action','Hollywood','2019-04-26',8.4,2,7),(111,'Captain America Civil War','Action','Hollywood','2016-05-06',7.8,2,7),(112,'Infinity War','Action','Hollywood','2018-04-27',8.4,2,8),(113,'Spider-Man Homecoming','Action','Hollywood','2017-07-07',7.4,2,7),(114,'Jurassic Park','Adventure','Hollywood','1993-06-11',8.2,3,2),(115,'Ready Player One','Sci-Fi','Hollywood','2018-03-29',7.4,3,2),(116,'E.T.','Sci-Fi','Hollywood','1982-06-11',7.8,3,2),(117,'Titanic','Romance','Hollywood','1997-12-19',7.9,10,11),(118,'Avatar','Sci-Fi','Hollywood','2009-12-18',7.9,10,11),(119,'Avatar The Way of Water','Sci-Fi','Hollywood','2022-12-16',7.5,10,11),(120,'Mission Impossible Fallout','Action','Hollywood','2018-07-27',7.7,9,12),(121,'Top Gun Maverick','Action','Hollywood','2022-05-27',8.2,9,12),(122,'Chennai Express','Comedy','Bollywood','2013-08-08',6.1,5,6),(123,'Pathaan','Action','Bollywood','2023-01-25',5.8,5,6),(124,'Happy New Year','Comedy','Bollywood','2014-10-24',5.0,5,6),(125,'PK','Comedy','Bollywood','2014-12-19',8.1,4,4),(126,'Sanju','Biography','Bollywood','2018-06-29',7.6,4,4),(127,'Munna Bhai MBBS','Comedy','Bollywood','2003-12-19',8.1,4,4),(128,'Bajirao Mastani','Historical','Bollywood','2015-12-18',7.2,7,9),(129,'Padmaavat','Historical','Bollywood','2018-01-25',7.0,7,9),(130,'Gangubai Kathiawadi','Drama','Bollywood','2022-02-25',7.0,7,9),(131,'Zindagi Na Milegi Dobara','Drama','Bollywood','2011-07-15',8.2,12,10),(132,'Gully Boy','Drama','Bollywood','2019-02-14',7.9,12,10),(133,'Dil Dhadakne Do','Drama','Bollywood','2015-06-05',7.0,12,10),(134,'War','Action','Bollywood','2019-10-02',6.5,11,12),(135,'Fighter','Action','Bollywood','2024-01-25',6.1,11,12),(136,'Bang Bang','Action','Bollywood','2014-10-02',5.5,11,12),(137,'Neon Horizon','Sci-Fi','Bollywood','2026-01-15',8.7,13,13);
/*!40000 ALTER TABLE `MOVIES` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `check_imdb_rating` BEFORE INSERT ON `movies` FOR EACH ROW BEGIN
    IF NEW.IMDbRating < 0 OR NEW.IMDbRating > 10 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'IMDb rating must be between 0 and 10';
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `movie_insert_audit` AFTER INSERT ON `movies` FOR EACH ROW BEGIN
    INSERT INTO MOVIE_AUDIT
    (MID, MovieName, ActionType, OldRating, NewRating)
    VALUES
    (NEW.MID, NEW.Name, 'INSERT', NULL, NEW.IMDbRating);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `check_imdb_rating_update` BEFORE UPDATE ON `movies` FOR EACH ROW BEGIN
    IF NEW.IMDbRating < 0 OR NEW.IMDbRating > 10 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'IMDb rating must be between 0 and 10';
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `movie_update_audit` AFTER UPDATE ON `movies` FOR EACH ROW BEGIN
    INSERT INTO MOVIE_AUDIT
    (MID, MovieName, ActionType, OldRating, NewRating)
    VALUES
    (NEW.MID, NEW.Name, 'UPDATE', OLD.IMDbRating, NEW.IMDbRating);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `movie_delete_audit` AFTER DELETE ON `movies` FOR EACH ROW BEGIN
    INSERT INTO MOVIE_AUDIT
    (MID, MovieName, ActionType, OldRating, NewRating)
    VALUES
    (OLD.MID, OLD.Name, 'DELETE', OLD.IMDbRating, NULL);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `PRODUCER`
--

DROP TABLE IF EXISTS `PRODUCER`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PRODUCER` (
  `PID` int NOT NULL,
  `Name` varchar(50) NOT NULL,
  `Age` int NOT NULL,
  `CompanyName` varchar(50) NOT NULL,
  PRIMARY KEY (`PID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PRODUCER`
--

LOCK TABLES `PRODUCER` WRITE;
/*!40000 ALTER TABLE `PRODUCER` DISABLE KEYS */;
INSERT INTO `PRODUCER` VALUES (1,'Emma Thomas',52,'Syncopy Inc.'),(2,'Kevin Feige',50,'Marvel Studios'),(3,'Kathleen Kennedy',70,'Lucasfilm'),(4,'Vidhu Vinod Chopra',72,'Vinod Chopra Films'),(5,'Gauri Khan',53,'Red Chillies Entertainment'),(6,'Kiran Rao',50,'Aamir Khan Productions'),(7,'Karan Johar',52,'Dharma Productions'),(8,'Sajid Nadiadwala',58,'Nadiadwala Grandson'),(9,'Jerry Bruckheimer',80,'Jerry Bruckheimer Films'),(10,'James Cameron',69,'Lightstorm Entertainment'),(11,'Aditya Chopra',53,'YRF'),(12,'Dinesh Vijan',43,'Maddock Films'),(13,'Rohan Malhotra',42,'Nova Pictures');
/*!40000 ALTER TABLE `PRODUCER` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'MovieDB'
--

--
-- Final view structure for view `highlyratedmovies`
--

/*!50001 DROP VIEW IF EXISTS `highlyratedmovies`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `highlyratedmovies` AS select `movies`.`MID` AS `MID`,`movies`.`Name` AS `Name`,`movies`.`Genre` AS `Genre`,`movies`.`FilmIndustry` AS `FilmIndustry`,`movies`.`ReleaseDate` AS `ReleaseDate`,`movies`.`IMDbRating` AS `IMDbRating` from `movies` where (`movies`.`IMDbRating` >= 8.0) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `movieactorsview`
--

/*!50001 DROP VIEW IF EXISTS `movieactorsview`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `movieactorsview` AS select `M`.`Name` AS `MovieName`,`A`.`Name` AS `ActorName`,`M`.`IMDbRating` AS `IMDbRating` from ((`movies` `M` join `movie_actors` `MA` on((`M`.`MID` = `MA`.`MID`))) join `actors` `A` on((`MA`.`AID` = `A`.`AID`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `moviedetails`
--

/*!50001 DROP VIEW IF EXISTS `moviedetails`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `moviedetails` AS select `M`.`MID` AS `MID`,`M`.`Name` AS `MovieName`,`M`.`Genre` AS `Genre`,`M`.`FilmIndustry` AS `FilmIndustry`,`M`.`ReleaseDate` AS `ReleaseDate`,`M`.`IMDbRating` AS `IMDbRating`,`P`.`Name` AS `Producer`,`D`.`Name` AS `Director` from ((`movies` `M` join `producer` `P` on((`M`.`PID` = `P`.`PID`))) join `director` `D` on((`M`.`DID` = `D`.`DID`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-07 19:19:07
