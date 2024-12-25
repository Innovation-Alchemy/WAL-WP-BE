-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 25, 2024 at 03:48 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `wal-wp`
--

-- --------------------------------------------------------

--
-- Table structure for table `blogs`
--

CREATE TABLE `blogs` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `event_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `tags` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`tags`)),
  `files` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`files`)),
  `description` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `blogs`
--

INSERT INTO `blogs` (`id`, `user_id`, `event_id`, `title`, `content`, `tags`, `files`, `description`, `createdAt`, `updatedAt`) VALUES
(2, 1, 1, 'who knows', 'yala again', '[\"loli\",\"pop\"]', '[\"http://localhost:8080/uploads/files-1734788686846-659059480.jpg\",\"http://localhost:8080/uploads/files-1734788686851-770902381.jpg\",\"http://localhost:8080/uploads/files-1734788723155-101040048.jpg\"]', 'its just a trial relax', '2024-12-21 13:44:46', '2024-12-21 13:45:23'),
(3, 1, 2, 'who knows', 'yala again', '[\"loli\",\"pop\",\"oko\"]', '[\"http://localhost:8080/uploads/files-1734951777934-249406010.jpg\"]', 'its just a trial relax', '2024-12-23 11:02:57', '2024-12-23 11:02:57'),
(4, 16, NULL, 'lets try this', 'popolololololololo', '[]', '[]', 'without tags or files', '2024-12-25 13:52:17', '2024-12-25 13:52:17');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `type` enum('product','event','blog') NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `description`, `type`, `createdAt`, `updatedAt`) VALUES
(1, 'Teck event', 'super duber bober', 'event', '2024-12-20 14:10:26', '2024-12-20 14:10:26');

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `blog_id` int(11) NOT NULL,
  `content` text NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`id`, `user_id`, `blog_id`, `content`, `createdAt`, `updatedAt`) VALUES
(1, 1, 2, 'my first comment', '2024-12-25 13:31:47', '2024-12-25 13:31:47'),
(2, 16, 2, 'hey im raul gonl', '2024-12-25 13:32:07', '2024-12-25 13:48:19');

-- --------------------------------------------------------

--
-- Table structure for table `coupons`
--

CREATE TABLE `coupons` (
  `id` int(11) NOT NULL,
  `event_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `coupon_key` varchar(255) NOT NULL,
  `discount_percentage` decimal(5,2) DEFAULT NULL,
  `discount_in_dollar` double DEFAULT NULL,
  `min_price` double DEFAULT 0,
  `max_uses` int(11) DEFAULT 1,
  `current_uses` int(11) DEFAULT 0,
  `allowed_uses_per_user` int(11) DEFAULT 1,
  `valid_from` datetime NOT NULL,
  `valid_to` datetime NOT NULL,
  `used_by_users` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`used_by_users`)),
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `coupons`
--

INSERT INTO `coupons` (`id`, `event_id`, `product_id`, `user_id`, `coupon_key`, `discount_percentage`, `discount_in_dollar`, `min_price`, `max_uses`, `current_uses`, `allowed_uses_per_user`, `valid_from`, `valid_to`, `used_by_users`, `createdAt`, `updatedAt`) VALUES
(1, NULL, NULL, 1, 'SAVE20', 20.00, NULL, 600, 3, 3, 2, '2024-12-01 00:00:00', '2024-12-31 23:59:59', '[1,1,16]', '2024-12-25 10:59:51', '2024-12-25 11:01:35'),
(2, NULL, NULL, 1, 'SAVE30', NULL, 30, 600, 4, 4, 2, '2024-12-01 00:00:00', '2024-12-31 23:59:59', '[1,1,16,16]', '2024-12-25 11:17:09', '2024-12-25 11:18:35');

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `location` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `organizer_id` int(11) NOT NULL,
  `date_time` datetime NOT NULL,
  `seated` tinyint(1) NOT NULL DEFAULT 0,
  `links` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `hobbies`
--

CREATE TABLE `hobbies` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `hobbies` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `hobbies`
--

INSERT INTO `hobbies` (`id`, `name`, `createdAt`, `updatedAt`, `hobbies`) VALUES
(1, 'Sport', '2024-12-22 10:55:40', '2024-12-22 11:09:32', NULL),
(2, 'football', '2024-12-22 11:10:24', '2024-12-22 11:10:24', NULL),
(3, 'basketball', '2024-12-23 11:07:32', '2024-12-23 11:07:32', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `likes`
--

CREATE TABLE `likes` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `blog_id` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `likes`
--

INSERT INTO `likes` (`id`, `user_id`, `blog_id`, `createdAt`, `updatedAt`) VALUES
(2, 16, 2, '2024-12-25 13:15:14', '2024-12-25 13:15:14'),
(3, 18, 2, '2024-12-25 13:15:48', '2024-12-25 13:15:48');

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `permissions` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`id`, `name`, `createdAt`, `updatedAt`, `permissions`) VALUES
(1, 'create-permission', '2024-12-20 13:01:32', '2024-12-20 13:01:32', NULL),
(2, 'read-permission', '2024-12-20 13:03:18', '2024-12-20 13:03:18', NULL),
(3, 'assign-permission', '2024-12-20 13:03:36', '2024-12-20 13:03:36', NULL),
(4, 'remove-permission', '2024-12-20 13:03:59', '2024-12-20 13:03:59', NULL),
(5, 'update-permission', '2024-12-20 13:04:17', '2024-12-20 13:04:17', NULL),
(6, 'delete-permission', '2024-12-20 13:04:24', '2024-12-20 13:04:24', NULL),
(7, 'create-user', '2024-12-20 13:44:43', '2024-12-20 13:44:43', NULL),
(8, 'update-user', '2024-12-20 13:44:55', '2024-12-20 13:44:55', NULL),
(9, 'delete-user', '2024-12-20 13:45:03', '2024-12-20 13:45:03', NULL),
(10, 'create-coupon', '2024-12-20 16:25:44', '2024-12-20 16:25:44', NULL),
(11, 'update-coupon', '2024-12-20 16:26:01', '2024-12-20 16:26:01', NULL),
(12, 'delete-coupon', '2024-12-20 16:26:11', '2024-12-20 16:26:11', NULL),
(13, 'create-profile', '2024-12-24 13:32:41', '2024-12-24 13:32:41', NULL),
(14, 'update-profile', '2024-12-24 13:32:57', '2024-12-24 13:32:57', NULL),
(15, 'delete-profile', '2024-12-24 13:33:08', '2024-12-24 13:33:08', NULL),
(16, 'create-product', '2024-12-25 13:58:01', '2024-12-25 13:58:01', NULL),
(17, 'update-product', '2024-12-25 13:58:08', '2024-12-25 13:58:08', NULL),
(18, 'delete-product', '2024-12-25 13:58:14', '2024-12-25 13:58:14', NULL),
(20, 'create-event', '2024-12-25 14:44:38', '2024-12-25 14:44:38', NULL),
(21, 'update-event', '2024-12-25 14:44:49', '2024-12-25 14:44:49', NULL),
(22, 'delete-event', '2024-12-25 14:44:55', '2024-12-25 14:44:55', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `description`, `image`, `createdAt`, `updatedAt`, `user_id`) VALUES
(1, 'laptop', 'HP Laptop for sale for 700 usd', 'http://localhost:8080/uploads\\image-1735135840018-858409494.jpg', '2024-12-25 14:10:40', '2024-12-25 14:32:12', 16),
(2, 'lolipop', 'HP Laptop for sale for 700 usd', 'http://localhost:8080/uploads\\image-1735137045565-675578724.jpg', '2024-12-25 14:11:32', '2024-12-25 14:30:45', 1);

-- --------------------------------------------------------

--
-- Table structure for table `profile_details`
--

CREATE TABLE `profile_details` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `facebook` varchar(255) DEFAULT NULL,
  `instagram` varchar(255) DEFAULT NULL,
  `twitter` varchar(255) DEFAULT NULL,
  `linkedin` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `profile_picture` varchar(255) DEFAULT NULL,
  `cover_photo` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `profile_details`
--

INSERT INTO `profile_details` (`id`, `user_id`, `name`, `description`, `website`, `facebook`, `instagram`, `twitter`, `linkedin`, `address`, `city`, `profile_picture`, `cover_photo`, `createdAt`, `updatedAt`) VALUES
(3, 1, 'Raul', 'trying profile ', 'www.profile@google.com', 'www.profile@google.com', 'www.profile@google.com', 'www.profile@google.com', 'www.profile@google.com', 'lebanon', 'beirut', 'http://localhost:8080/uploads\\profile_picture-1735047686757-108974101.jpg', 'http://localhost:8080/uploads\\cover_photo-1735047686761-60460866.jpg', '2024-12-24 13:41:26', '2024-12-24 13:41:26');

-- --------------------------------------------------------

--
-- Table structure for table `tickets`
--

CREATE TABLE `tickets` (
  `id` int(11) NOT NULL,
  `qrCode` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `event_id` int(11) DEFAULT NULL,
  `buyer_id` int(11) NOT NULL,
  `ticket_price` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`ticket_price`)),
  `section` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`section`)),
  `total_seats` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`total_seats`)),
  `total_tickets` int(11) NOT NULL,
  `tickets_sold` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `permissions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`permissions`)),
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `birthdate` varchar(255) DEFAULT NULL,
  `role` enum('Admin','Organizer','Operator','User') DEFAULT 'User',
  `gender` enum('Male','Female') DEFAULT 'Male',
  `isVerified` tinyint(1) DEFAULT 0,
  `token` varchar(255) DEFAULT NULL,
  `TokenExpires` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `isApproved` tinyint(1) DEFAULT 0,
  `hobbies` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`hobbies`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `permissions`, `name`, `email`, `password`, `phone_number`, `birthdate`, `role`, `gender`, `isVerified`, `token`, `TokenExpires`, `createdAt`, `updatedAt`, `isApproved`, `hobbies`) VALUES
(1, '[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,20,21,22]', 'Fadelhmd', 'fadel.ahammoud@gmail.com', '$2a$10$wpMU1fgZaDCDM4ETo8kDWeLzVfFdtd5k2Y4FLxOOyF9rBC.ySKg/6', '10203050', '1996-01-20', 'Admin', 'Male', 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6IlVzZXIiLCJpYXQiOjE3MzQ2OTkxODUsImV4cCI6MTczNTMwMzk4NX0.Z7_lqhRGdK6fwCX5dlYKLMLLjjUfxGUZL2HfZRApr74', '2024-12-27 12:53:05', '2024-12-20 09:03:22', '2024-12-25 14:45:13', 1, '[2]'),
(16, '[]', 'Fadelhmd', 'irada@innoalchemy.business', '$2a$10$745dHUKr1UaWdgex.zs34.YKpyGO4fzAqc5tplR03du0Hcnl283NK', '71491613', '1996-01-20', 'User', 'Male', 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTYsInJvbGUiOiJVc2VyIiwiaWF0IjoxNzM1MDU2NDMzLCJleHAiOjE3MzU2NjEyMzN9.MnuuKSxa3Fj8vHDxpfHFCdPrJCDBfsIsOVgCLlqxYMA', '2024-12-31 16:07:13', '2024-12-24 16:05:46', '2024-12-24 16:07:13', 0, '[]'),
(18, '[]', 'Fadel hmd7', 'fadelhammoud@innoalchemy.com', '$2a$10$w2gVDrlmhKbwXcE03Rgl8uiKloMiK42P6d7b7K6R8vSvWu8QPPrey', '714916136666', '1996-01-20', 'User', 'Male', 1, NULL, NULL, '2024-12-24 16:09:29', '2024-12-24 16:09:50', 0, '[]');

-- --------------------------------------------------------

--
-- Table structure for table `views`
--

CREATE TABLE `views` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `blog_id` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `views`
--

INSERT INTO `views` (`id`, `user_id`, `blog_id`, `createdAt`, `updatedAt`) VALUES
(1, 16, 2, '2024-12-25 13:22:46', '2024-12-25 13:22:46');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `blogs`
--
ALTER TABLE `blogs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `name_2` (`name`),
  ADD UNIQUE KEY `name_3` (`name`),
  ADD UNIQUE KEY `name_4` (`name`),
  ADD UNIQUE KEY `name_5` (`name`),
  ADD UNIQUE KEY `name_6` (`name`),
  ADD UNIQUE KEY `name_7` (`name`),
  ADD UNIQUE KEY `name_8` (`name`),
  ADD UNIQUE KEY `name_9` (`name`),
  ADD UNIQUE KEY `name_10` (`name`),
  ADD UNIQUE KEY `name_11` (`name`),
  ADD UNIQUE KEY `name_12` (`name`),
  ADD UNIQUE KEY `name_13` (`name`),
  ADD UNIQUE KEY `name_14` (`name`),
  ADD UNIQUE KEY `name_15` (`name`),
  ADD UNIQUE KEY `name_16` (`name`),
  ADD UNIQUE KEY `name_17` (`name`),
  ADD UNIQUE KEY `name_18` (`name`),
  ADD UNIQUE KEY `name_19` (`name`),
  ADD UNIQUE KEY `name_20` (`name`),
  ADD UNIQUE KEY `name_21` (`name`),
  ADD UNIQUE KEY `name_22` (`name`),
  ADD UNIQUE KEY `name_23` (`name`),
  ADD UNIQUE KEY `name_24` (`name`),
  ADD UNIQUE KEY `name_25` (`name`),
  ADD UNIQUE KEY `name_26` (`name`),
  ADD UNIQUE KEY `name_27` (`name`),
  ADD UNIQUE KEY `name_28` (`name`),
  ADD UNIQUE KEY `name_29` (`name`);

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `blog_id` (`blog_id`);

--
-- Indexes for table `coupons`
--
ALTER TABLE `coupons`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `coupon_key` (`coupon_key`),
  ADD UNIQUE KEY `coupon_key_2` (`coupon_key`),
  ADD KEY `event_id` (`event_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `hobbies`
--
ALTER TABLE `hobbies`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `name_2` (`name`),
  ADD UNIQUE KEY `name_3` (`name`),
  ADD UNIQUE KEY `name_4` (`name`),
  ADD UNIQUE KEY `name_5` (`name`),
  ADD UNIQUE KEY `name_6` (`name`),
  ADD UNIQUE KEY `name_7` (`name`),
  ADD KEY `hobbies` (`hobbies`);

--
-- Indexes for table `likes`
--
ALTER TABLE `likes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `blog_id` (`blog_id`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `name_2` (`name`),
  ADD UNIQUE KEY `name_3` (`name`),
  ADD UNIQUE KEY `name_4` (`name`),
  ADD UNIQUE KEY `name_5` (`name`),
  ADD UNIQUE KEY `name_6` (`name`),
  ADD UNIQUE KEY `name_7` (`name`),
  ADD UNIQUE KEY `name_8` (`name`),
  ADD UNIQUE KEY `name_9` (`name`),
  ADD UNIQUE KEY `name_10` (`name`),
  ADD UNIQUE KEY `name_11` (`name`),
  ADD UNIQUE KEY `name_12` (`name`),
  ADD UNIQUE KEY `name_13` (`name`),
  ADD UNIQUE KEY `name_14` (`name`),
  ADD UNIQUE KEY `name_15` (`name`),
  ADD UNIQUE KEY `name_16` (`name`),
  ADD UNIQUE KEY `name_17` (`name`),
  ADD UNIQUE KEY `name_18` (`name`),
  ADD UNIQUE KEY `name_19` (`name`),
  ADD UNIQUE KEY `name_20` (`name`),
  ADD UNIQUE KEY `name_21` (`name`),
  ADD UNIQUE KEY `name_22` (`name`),
  ADD UNIQUE KEY `name_23` (`name`),
  ADD UNIQUE KEY `name_24` (`name`),
  ADD UNIQUE KEY `name_25` (`name`),
  ADD UNIQUE KEY `name_26` (`name`),
  ADD UNIQUE KEY `name_27` (`name`),
  ADD UNIQUE KEY `name_28` (`name`),
  ADD UNIQUE KEY `name_29` (`name`),
  ADD KEY `permissions` (`permissions`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `name_2` (`name`),
  ADD UNIQUE KEY `name_3` (`name`),
  ADD KEY `Products_user_id_foreign_idx` (`user_id`);

--
-- Indexes for table `profile_details`
--
ALTER TABLE `profile_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `tickets`
--
ALTER TABLE `tickets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `qrCode` (`qrCode`),
  ADD UNIQUE KEY `qrCode_2` (`qrCode`),
  ADD UNIQUE KEY `qrCode_3` (`qrCode`),
  ADD UNIQUE KEY `qrCode_4` (`qrCode`),
  ADD UNIQUE KEY `qrCode_5` (`qrCode`),
  ADD UNIQUE KEY `qrCode_6` (`qrCode`),
  ADD UNIQUE KEY `qrCode_7` (`qrCode`),
  ADD UNIQUE KEY `qrCode_8` (`qrCode`),
  ADD UNIQUE KEY `qrCode_9` (`qrCode`),
  ADD UNIQUE KEY `qrCode_10` (`qrCode`),
  ADD UNIQUE KEY `qrCode_11` (`qrCode`),
  ADD UNIQUE KEY `qrCode_12` (`qrCode`),
  ADD UNIQUE KEY `qrCode_13` (`qrCode`),
  ADD UNIQUE KEY `qrCode_14` (`qrCode`),
  ADD UNIQUE KEY `qrCode_15` (`qrCode`),
  ADD UNIQUE KEY `qrCode_16` (`qrCode`),
  ADD UNIQUE KEY `qrCode_17` (`qrCode`),
  ADD UNIQUE KEY `qrCode_18` (`qrCode`),
  ADD UNIQUE KEY `qrCode_19` (`qrCode`),
  ADD UNIQUE KEY `qrCode_20` (`qrCode`),
  ADD UNIQUE KEY `qrCode_21` (`qrCode`),
  ADD UNIQUE KEY `qrCode_22` (`qrCode`),
  ADD UNIQUE KEY `qrCode_23` (`qrCode`),
  ADD UNIQUE KEY `qrCode_24` (`qrCode`),
  ADD UNIQUE KEY `qrCode_25` (`qrCode`),
  ADD UNIQUE KEY `qrCode_26` (`qrCode`),
  ADD UNIQUE KEY `qrCode_27` (`qrCode`),
  ADD UNIQUE KEY `qrCode_28` (`qrCode`),
  ADD UNIQUE KEY `qrCode_29` (`qrCode`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `event_id` (`event_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD UNIQUE KEY `email_3` (`email`),
  ADD UNIQUE KEY `email_4` (`email`),
  ADD UNIQUE KEY `email_5` (`email`),
  ADD UNIQUE KEY `email_6` (`email`),
  ADD UNIQUE KEY `email_7` (`email`),
  ADD UNIQUE KEY `email_8` (`email`),
  ADD UNIQUE KEY `email_9` (`email`),
  ADD UNIQUE KEY `email_10` (`email`),
  ADD UNIQUE KEY `email_11` (`email`),
  ADD UNIQUE KEY `email_12` (`email`),
  ADD UNIQUE KEY `email_13` (`email`),
  ADD UNIQUE KEY `email_14` (`email`),
  ADD UNIQUE KEY `email_15` (`email`),
  ADD UNIQUE KEY `email_16` (`email`),
  ADD UNIQUE KEY `email_17` (`email`),
  ADD UNIQUE KEY `email_18` (`email`),
  ADD UNIQUE KEY `email_19` (`email`),
  ADD UNIQUE KEY `email_20` (`email`),
  ADD UNIQUE KEY `email_21` (`email`),
  ADD UNIQUE KEY `email_22` (`email`),
  ADD UNIQUE KEY `email_23` (`email`),
  ADD UNIQUE KEY `email_24` (`email`),
  ADD UNIQUE KEY `email_25` (`email`),
  ADD UNIQUE KEY `email_26` (`email`),
  ADD UNIQUE KEY `email_27` (`email`),
  ADD UNIQUE KEY `email_28` (`email`),
  ADD UNIQUE KEY `email_29` (`email`),
  ADD UNIQUE KEY `email_30` (`email`),
  ADD UNIQUE KEY `email_31` (`email`),
  ADD UNIQUE KEY `phone_number` (`phone_number`),
  ADD UNIQUE KEY `phone_number_2` (`phone_number`),
  ADD UNIQUE KEY `phone_number_3` (`phone_number`),
  ADD UNIQUE KEY `phone_number_4` (`phone_number`);

--
-- Indexes for table `views`
--
ALTER TABLE `views`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `blog_id` (`blog_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `blogs`
--
ALTER TABLE `blogs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `coupons`
--
ALTER TABLE `coupons`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `hobbies`
--
ALTER TABLE `hobbies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `likes`
--
ALTER TABLE `likes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `profile_details`
--
ALTER TABLE `profile_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tickets`
--
ALTER TABLE `tickets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `views`
--
ALTER TABLE `views`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `blogs`
--
ALTER TABLE `blogs`
  ADD CONSTRAINT `blogs_ibfk_21` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `blogs_ibfk_22` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `blogs_ibfk_23` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `blogs_ibfk_24` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `blogs_ibfk_25` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `blogs_ibfk_26` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `blogs_ibfk_27` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `blogs_ibfk_28` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `blogs_ibfk_29` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comments_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comments_ibfk_4` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comments_ibfk_5` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comments_ibfk_6` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `coupons`
--
ALTER TABLE `coupons`
  ADD CONSTRAINT `coupons_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `coupons_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `coupons_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `coupons_ibfk_4` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `coupons_ibfk_5` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `coupons_ibfk_6` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `Events_user_id_foreign_idx` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `events_ibfk_40` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `events_ibfk_41` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `events_ibfk_43` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `events_ibfk_45` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `events_ibfk_47` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `events_ibfk_49` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `events_ibfk_51` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `events_ibfk_52` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `hobbies`
--
ALTER TABLE `hobbies`
  ADD CONSTRAINT `hobbies_ibfk_1` FOREIGN KEY (`hobbies`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `hobbies_ibfk_2` FOREIGN KEY (`hobbies`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `hobbies_ibfk_3` FOREIGN KEY (`hobbies`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `hobbies_ibfk_4` FOREIGN KEY (`hobbies`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `hobbies_ibfk_5` FOREIGN KEY (`hobbies`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `hobbies_ibfk_6` FOREIGN KEY (`hobbies`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `hobbies_ibfk_7` FOREIGN KEY (`hobbies`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `likes`
--
ALTER TABLE `likes`
  ADD CONSTRAINT `likes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `likes_ibfk_2` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `likes_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `likes_ibfk_4` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `likes_ibfk_5` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `likes_ibfk_6` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `permissions`
--
ALTER TABLE `permissions`
  ADD CONSTRAINT `permissions_ibfk_1` FOREIGN KEY (`permissions`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `permissions_ibfk_10` FOREIGN KEY (`permissions`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `permissions_ibfk_11` FOREIGN KEY (`permissions`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `permissions_ibfk_12` FOREIGN KEY (`permissions`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `permissions_ibfk_13` FOREIGN KEY (`permissions`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `permissions_ibfk_14` FOREIGN KEY (`permissions`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `permissions_ibfk_15` FOREIGN KEY (`permissions`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `permissions_ibfk_16` FOREIGN KEY (`permissions`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `permissions_ibfk_17` FOREIGN KEY (`permissions`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `permissions_ibfk_18` FOREIGN KEY (`permissions`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `permissions_ibfk_19` FOREIGN KEY (`permissions`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `permissions_ibfk_2` FOREIGN KEY (`permissions`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `permissions_ibfk_20` FOREIGN KEY (`permissions`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `permissions_ibfk_21` FOREIGN KEY (`permissions`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `permissions_ibfk_22` FOREIGN KEY (`permissions`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `permissions_ibfk_23` FOREIGN KEY (`permissions`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `permissions_ibfk_24` FOREIGN KEY (`permissions`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `permissions_ibfk_25` FOREIGN KEY (`permissions`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `permissions_ibfk_26` FOREIGN KEY (`permissions`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `permissions_ibfk_27` FOREIGN KEY (`permissions`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `permissions_ibfk_28` FOREIGN KEY (`permissions`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `permissions_ibfk_29` FOREIGN KEY (`permissions`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `permissions_ibfk_3` FOREIGN KEY (`permissions`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `permissions_ibfk_4` FOREIGN KEY (`permissions`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `permissions_ibfk_5` FOREIGN KEY (`permissions`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `permissions_ibfk_6` FOREIGN KEY (`permissions`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `permissions_ibfk_7` FOREIGN KEY (`permissions`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `permissions_ibfk_8` FOREIGN KEY (`permissions`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `permissions_ibfk_9` FOREIGN KEY (`permissions`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `Products_user_id_foreign_idx` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `profile_details`
--
ALTER TABLE `profile_details`
  ADD CONSTRAINT `profile_details_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `profile_details_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `profile_details_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `profile_details_ibfk_4` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tickets`
--
ALTER TABLE `tickets`
  ADD CONSTRAINT `Tickets_event_id_foreign_idx` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Tickets_user_id_foreign_idx` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tickets_ibfk_41` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tickets_ibfk_42` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tickets_ibfk_43` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tickets_ibfk_44` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tickets_ibfk_45` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tickets_ibfk_46` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tickets_ibfk_47` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tickets_ibfk_48` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tickets_ibfk_49` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tickets_ibfk_50` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tickets_ibfk_51` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tickets_ibfk_52` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tickets_ibfk_53` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tickets_ibfk_54` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tickets_ibfk_55` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tickets_ibfk_56` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `views`
--
ALTER TABLE `views`
  ADD CONSTRAINT `views_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `views_ibfk_2` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `views_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `views_ibfk_4` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
