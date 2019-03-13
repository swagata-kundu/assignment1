DROP DATABASE IF EXISTS platform;

CREATE DATABASE platform;

USE platform;

CREATE TABLE `jobs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uploadedBy` int(11) DEFAULT '1',
  `fileName` varchar(200) NOT NULL,
  `status` enum('PENDING','COMPLETED','FAILED') DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `jobs_analytics` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `jobId` int(11) DEFAULT NULL,
  `uid` varchar(200) NOT NULL,
  `platform` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_jobs_analytics_1_idx` (`jobId`),
  CONSTRAINT `fk_jobs_analytics_1` FOREIGN KEY (`jobId`) REFERENCES `jobs` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
