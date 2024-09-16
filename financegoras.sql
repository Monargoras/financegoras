-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.32 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.3.0.6589
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for financegoras
CREATE DATABASE IF NOT EXISTS `financegoras` /*!40100 DEFAULT CHARACTER SET utf8mb3 */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `financegoras`;

-- Dumping structure for table financegoras.transactions
CREATE TABLE IF NOT EXISTS `transactions` (
  `userId` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `id` char(16) NOT NULL,
  `isIncome` bit(1) NOT NULL,
  `isSavings` bit(1) NOT NULL,
  `amount` double NOT NULL DEFAULT 0,
  `name` varchar(50) NOT NULL,
  `category` varchar(50) NOT NULL,
  `transactionType` enum('Single','Monthly','Annual') CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT 'Single',
  `createdAt` datetime NOT NULL,
  `stoppedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`userId`,`id`),
  KEY `isIncome` (`userId`,`isIncome`),
  KEY `isSavings` (`userId`,`isSavings`),
  KEY `userId` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Dumping data for table financegoras.transactions: ~28 rows (approximately)
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
INSERT IGNORE INTO `transactions` (`userId`, `id`, `isIncome`, `isSavings`, `amount`, `name`, `category`, `transactionType`, `createdAt`, `stoppedAt`) VALUES
	('DEMO', 'zRZsBdTnqP2hP7iN', b'0', b'0', 25, 'Oishii', 'Restaurants', 'Single', '2024-08-19 13:08:15', '2024-08-19 13:08:15');
INSERT IGNORE INTO `transactions` (`userId`, `id`, `isIncome`, `isSavings`, `amount`, `name`, `category`, `transactionType`, `createdAt`, `stoppedAt`) VALUES
	('DEMO', 'g0cSphjvcXYDeMgI', b'0', b'0', 11.99, 'Youtube Premium', 'Subscriptions', 'Monthly', '2023-11-01 00:00:00', NULL);
INSERT IGNORE INTO `transactions` (`userId`, `id`, `isIncome`, `isSavings`, `amount`, `name`, `category`, `transactionType`, `createdAt`, `stoppedAt`) VALUES
	('DEMO', 'qPLU0zZFZJA5T-oS', b'0', b'0', 89.9, 'Amazon Prime', 'Subscriptions', 'Annual', '2024-04-01 00:00:00', NULL);
INSERT IGNORE INTO `transactions` (`userId`, `id`, `isIncome`, `isSavings`, `amount`, `name`, `category`, `transactionType`, `createdAt`, `stoppedAt`) VALUES
	('DEMO', 'DD9pTKl4hYudmMde', b'0', b'0', 49, 'Train Ticket', 'Subscriptions', 'Monthly', '2023-09-01 00:00:00', NULL);
INSERT IGNORE INTO `transactions` (`userId`, `id`, `isIncome`, `isSavings`, `amount`, `name`, `category`, `transactionType`, `createdAt`, `stoppedAt`) VALUES
	('DEMO', '9rW8wdPmV-AU-ts9', b'0', b'0', 20, 'Google One', 'Subscriptions', 'Annual', '2023-09-01 00:00:00', NULL);
INSERT IGNORE INTO `transactions` (`userId`, `id`, `isIncome`, `isSavings`, `amount`, `name`, `category`, `transactionType`, `createdAt`, `stoppedAt`) VALUES
	('DEMO', 't6l58vgA-JkIzTdx', b'0', b'0', 10.99, 'Spotify', 'Subscriptions', 'Monthly', '2023-09-01 00:00:00', NULL);
INSERT IGNORE INTO `transactions` (`userId`, `id`, `isIncome`, `isSavings`, `amount`, `name`, `category`, `transactionType`, `createdAt`, `stoppedAt`) VALUES
	('DEMO', 'w1cGt9HpqXiBAcAr', b'0', b'0', 75, 'Europa Park', 'Activities', 'Single', '2024-06-12 22:00:00', '2024-06-12 22:00:00');
INSERT IGNORE INTO `transactions` (`userId`, `id`, `isIncome`, `isSavings`, `amount`, `name`, `category`, `transactionType`, `createdAt`, `stoppedAt`) VALUES
	('DEMO', 'gAE0W9YnlaXxW8Wg', b'0', b'0', 20, 'Rewe', 'Groceries', 'Single', '2024-07-01 22:00:00', '2024-07-01 22:00:00');
INSERT IGNORE INTO `transactions` (`userId`, `id`, `isIncome`, `isSavings`, `amount`, `name`, `category`, `transactionType`, `createdAt`, `stoppedAt`) VALUES
	('DEMO', 'EuYu5mFPBAX3Wl-j', b'0', b'0', 17, 'Edeka', 'Groceries', 'Single', '2024-07-15 22:00:00', '2024-07-15 22:00:00');
INSERT IGNORE INTO `transactions` (`userId`, `id`, `isIncome`, `isSavings`, `amount`, `name`, `category`, `transactionType`, `createdAt`, `stoppedAt`) VALUES
	('DEMO', 'R9QN7hbDcX0WBD9P', b'0', b'0', 21, 'Jamies', 'Restaurants', 'Single', '2024-08-19 13:37:28', '2024-08-19 13:37:28');
INSERT IGNORE INTO `transactions` (`userId`, `id`, `isIncome`, `isSavings`, `amount`, `name`, `category`, `transactionType`, `createdAt`, `stoppedAt`) VALUES
	('DEMO', 'yK9WilZPcvPLmAMk', b'1', b'0', 2337.42, 'Company X', 'Salary', 'Monthly', '2023-09-01 00:00:00', NULL);
INSERT IGNORE INTO `transactions` (`userId`, `id`, `isIncome`, `isSavings`, `amount`, `name`, `category`, `transactionType`, `createdAt`, `stoppedAt`) VALUES
	('DEMO', 'YwqL8J6DAim17L6e', b'1', b'0', 999, 'Christmas Bonus', 'Bonus', 'Single', '2023-12-24 09:27:44', '2023-12-24 09:27:44');
INSERT IGNORE INTO `transactions` (`userId`, `id`, `isIncome`, `isSavings`, `amount`, `name`, `category`, `transactionType`, `createdAt`, `stoppedAt`) VALUES
	('DEMO', '-tkp_4l3DMcKJPPc', b'0', b'1', 750, 'ETFs', 'Investment', 'Monthly', '2023-09-01 00:00:00', NULL);
INSERT IGNORE INTO `transactions` (`userId`, `id`, `isIncome`, `isSavings`, `amount`, `name`, `category`, `transactionType`, `createdAt`, `stoppedAt`) VALUES
	('DEMO', '2PBE1KOOdWfwF3Mf', b'0', b'1', 250, 'Savings account', 'Investment', 'Monthly', '2023-11-01 00:00:00', NULL);
INSERT IGNORE INTO `transactions` (`userId`, `id`, `isIncome`, `isSavings`, `amount`, `name`, `category`, `transactionType`, `createdAt`, `stoppedAt`) VALUES
	('DEMO', 'v4GkvnNSUbg3Ovke', b'0', b'1', 250, 'Savings account bonus', 'Investment', 'Single', '2023-12-24 00:00:00', '2023-12-24 00:00:00');
INSERT IGNORE INTO `transactions` (`userId`, `id`, `isIncome`, `isSavings`, `amount`, `name`, `category`, `transactionType`, `createdAt`, `stoppedAt`) VALUES
	('DEMO', '9JeYJZQaUHNl2iwp', b'0', b'0', 14.99, 'Netflix', 'Subscriptions', 'Monthly', '2024-02-01 00:00:00', NULL);
INSERT IGNORE INTO `transactions` (`userId`, `id`, `isIncome`, `isSavings`, `amount`, `name`, `category`, `transactionType`, `createdAt`, `stoppedAt`) VALUES
	('DEMO', 'GmzXD-w7PGey-t31', b'0', b'0', 553, 'Shorttrip Vienna', 'Vacation', 'Single', '2024-05-23 00:00:00', '2024-05-23 00:00:00');
INSERT IGNORE INTO `transactions` (`userId`, `id`, `isIncome`, `isSavings`, `amount`, `name`, `category`, `transactionType`, `createdAt`, `stoppedAt`) VALUES
	('DEMO', 't7GVIelq4JIXWpvz', b'0', b'0', 36, 'Liability insurance', 'Insurance', 'Annual', '2024-02-01 00:00:00', NULL);
INSERT IGNORE INTO `transactions` (`userId`, `id`, `isIncome`, `isSavings`, `amount`, `name`, `category`, `transactionType`, `createdAt`, `stoppedAt`) VALUES
	('DEMO', 'C6gbJ7SJPWsxxWCS', b'0', b'0', 700, 'Car insurance', 'Insurance', 'Annual', '2023-09-01 00:00:00', NULL);
INSERT IGNORE INTO `transactions` (`userId`, `id`, `isIncome`, `isSavings`, `amount`, `name`, `category`, `transactionType`, `createdAt`, `stoppedAt`) VALUES
	('DEMO', 'GW5-Qsd7KNTsr2OJ', b'0', b'0', 310, 'Rent', 'Rent', 'Monthly', '2023-09-01 00:00:00', NULL);
INSERT IGNORE INTO `transactions` (`userId`, `id`, `isIncome`, `isSavings`, `amount`, `name`, `category`, `transactionType`, `createdAt`, `stoppedAt`) VALUES
	('DEMO', 'THLvIHbq1WyS0YSl', b'0', b'0', 70, 'Europa Park', 'Activities', 'Single', '2024-06-13 00:00:00', '2024-06-13 00:00:00');
INSERT IGNORE INTO `transactions` (`userId`, `id`, `isIncome`, `isSavings`, `amount`, `name`, `category`, `transactionType`, `createdAt`, `stoppedAt`) VALUES
	('DEMO', 'AQfHCxmO14f2oSOq', b'0', b'0', 40, 'Escape Room', 'Activities', 'Single', '2024-03-06 00:00:00', '2024-03-06 00:00:00');
INSERT IGNORE INTO `transactions` (`userId`, `id`, `isIncome`, `isSavings`, `amount`, `name`, `category`, `transactionType`, `createdAt`, `stoppedAt`) VALUES
	('DEMO', 'GnwEibt61altfSHc', b'0', b'0', 75, 'New Years', 'Socializing', 'Single', '2023-12-31 00:00:00', '2023-12-31 00:00:00');
INSERT IGNORE INTO `transactions` (`userId`, `id`, `isIncome`, `isSavings`, `amount`, `name`, `category`, `transactionType`, `createdAt`, `stoppedAt`) VALUES
	('DEMO', '_lulFS76SNX_b3Yk', b'0', b'0', 24, 'Oishii', 'Restaurants', 'Monthly', '2023-09-01 00:00:00', NULL);
INSERT IGNORE INTO `transactions` (`userId`, `id`, `isIncome`, `isSavings`, `amount`, `name`, `category`, `transactionType`, `createdAt`, `stoppedAt`) VALUES
	('DEMO', 'R2IRJzgW1uSypKLq', b'0', b'0', 35, 'Restaurant Testing', 'Restaurants', 'Monthly', '2023-09-01 00:00:00', NULL);
INSERT IGNORE INTO `transactions` (`userId`, `id`, `isIncome`, `isSavings`, `amount`, `name`, `category`, `transactionType`, `createdAt`, `stoppedAt`) VALUES
	('DEMO', '6K3btqfaSu8gOBb8', b'0', b'0', 150, 'Groceries', 'Groceries', 'Monthly', '2023-09-01 00:00:00', NULL);
INSERT IGNORE INTO `transactions` (`userId`, `id`, `isIncome`, `isSavings`, `amount`, `name`, `category`, `transactionType`, `createdAt`, `stoppedAt`) VALUES
	('DEMO', '-I8LNwol-sXdwi8G', b'0', b'0', 47, 'Health insurance', 'Insurance', 'Monthly', '2023-09-01 00:00:00', NULL);
INSERT IGNORE INTO `transactions` (`userId`, `id`, `isIncome`, `isSavings`, `amount`, `name`, `category`, `transactionType`, `createdAt`, `stoppedAt`) VALUES
	('DEMO', 'fJ95Txm8PVBCIuqY', b'0', b'0', 55, 'Krü', 'Restaurants', 'Single', '2024-07-13 00:00:00', '2024-07-13 00:00:00');
/*!40000 ALTER TABLE `transactions` ENABLE KEYS */;

-- Dumping structure for table financegoras.userdata
CREATE TABLE IF NOT EXISTS `userData` (
  `userId` varchar(50) NOT NULL,
  `categories` mediumtext,
  PRIMARY KEY (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Dumping data for table financegoras.userdata: ~1 rows (approximately)
INSERT INTO `userdata` (`userId`, `categories`) VALUES
	('DEMO', '[{"group":"Freetime","items":["Restaurants","Activities","Socializing","Gifts","Vacation"]},{"group":"Recurring","items":["Rent","Groceries","Upkeep","Subscriptions","Investment","Insurance"]},{"group":"Income","items":["Salary","Bonus","Infrequent"]},{"group":"Rest","items":["Clothes","Cash"]}]');

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
