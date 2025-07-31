

-- 데이터베이스 생성 확인
CREATE DATABASE IF NOT EXISTS ai_quizpic CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE ai_quizpic;

-- 테이블: users
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `username` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `role` varchar(50) COLLATE utf8mb4_general_ci DEFAULT 'USER',
  `solved` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `is_admin` bit(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블: quiz
CREATE TABLE `quiz` (
  `id` int NOT NULL AUTO_INCREMENT,
  `img` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `url` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `word_1` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `word_2` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `word_3` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `validate` tinyint(1) DEFAULT '0',
  `creator` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_quiz_creator` (`creator`),
  CONSTRAINT `fk_quiz_creator` FOREIGN KEY (`creator`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블: solved_quiz
CREATE TABLE `solved_quiz` (
  `user_id` bigint NOT NULL,
  `quiz_id` int NOT NULL,
  PRIMARY KEY (`user_id`, `quiz_id`),
  KEY `FK_solved_quiz_quiz` (`quiz_id`),
  CONSTRAINT `FK_solved_quiz_quiz` FOREIGN KEY (`quiz_id`) REFERENCES `quiz` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_solved_quiz_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
