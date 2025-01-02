-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 01, 2025 at 01:02 PM
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
  `updatedAt` datetime NOT NULL,
  `is_approved` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `blogs`
--

INSERT INTO `blogs` (`id`, `user_id`, `event_id`, `title`, `content`, `tags`, `files`, `description`, `createdAt`, `updatedAt`, `is_approved`) VALUES
(2, 1, 1, 'who knows', 'yala again', '[\"loli\",\"pop\"]', '[\"http://localhost:8080/uploads/files-1734788686846-659059480.jpg\",\"http://localhost:8080/uploads/files-1734788686851-770902381.jpg\",\"http://localhost:8080/uploads/files-1734788723155-101040048.jpg\"]', 'its just a trial relax', '2024-12-21 13:44:46', '2024-12-21 13:45:23', 0),
(3, 1, 2, 'who knows', 'yala again', '[\"loli\",\"pop\",\"oko\"]', '[\"http://localhost:8080/uploads/files-1734951777934-249406010.jpg\"]', 'its just a trial relax', '2024-12-23 11:02:57', '2024-12-23 11:02:57', 0),
(5, 1, 1, 'lets try this', 'popolololololololo', '[\"loli\",\"pop\",\"oko\"]', '[]', 'without tags or files', '2024-12-29 15:01:00', '2024-12-29 15:01:00', 1),
(6, 18, 1, 'lets try this', 'popolololololololo', '[\"loli\",\"pop\",\"oko\"]', '[]', 'without tags or files', '2024-12-30 11:28:23', '2024-12-30 11:28:23', 0);

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
(1, 1, 2, 'my first comment', '2024-12-25 13:31:47', '2024-12-25 13:31:47');

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
  `organizer_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `date_time` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`date_time`)),
  `location` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`location`)),
  `seated` tinyint(1) NOT NULL DEFAULT 0,
  `ticket_maps` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `commission` decimal(5,2) NOT NULL DEFAULT 3.00,
  `is_approved` tinyint(1) NOT NULL DEFAULT 0,
  `ticket_alert` int(11) NOT NULL,
  `status` enum('pending','in-progress','canceled','done') DEFAULT 'pending',
  `total_revenue` decimal(10,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `organizer_id`, `title`, `description`, `date_time`, `location`, `seated`, `ticket_maps`, `createdAt`, `updatedAt`, `commission`, `is_approved`, `ticket_alert`, `status`, `total_revenue`) VALUES
(1, 1, 'Annual Conference', 'A premier conference', '{\"start_date\":\"2024-05-01T09:00:00Z\",\"end_date\":\"2024-05-02T17:00:00Z\"}', '{\"lat\":\"40.712776\",\"lng\":\"-74.005974\"}', 1, 'http://localhost:8080/uploads/ticket_maps-1735225553299-516812326.jpg', '2024-12-26 15:05:53', '2025-01-01 11:58:25', 3.00, 0, 0, 'pending', 15.90),
(2, 18, 'Annual Conference2', 'A premier conference', '{\"start_date\":\"2024-05-01T09:00:00Z\",\"end_date\":\"2024-05-02T17:00:00Z\"}', '{\"lat\":\"40.712776\",\"lng\":\"-74.005974\"}', 1, 'https://www.anaconda.com/', '2024-12-26 15:19:12', '2024-12-27 12:09:14', 3.00, 0, 0, 'pending', 0.00),
(4, 18, 'Annual Conference3', 'A premier conference', '{\"start_date\":\"2024-05-11T09:00:00Z\",\"end_date\":\"2024-05-02T17:00:00Z\"}', '{\"lat\":\"40.712776\",\"lng\":\"-74.005974\",\"address\":\"lebanon-beirut\"}', 1, 'http://localhost:8080/uploads/ticket_maps-1735466884334-173739682.jpg', '2024-12-29 10:08:04', '2024-12-29 10:08:04', 4.00, 0, 0, 'pending', 0.00),
(5, 1, 'Annual Conference32', 'A premier conference2', '{\"start_date\":\"2024-05-11T11:00:00Z\",\"end_date\":\"2024-05-05T17:00:00Z\"}', '{\"lat\":\"30.712776\",\"lng\":\"-74.005974\",\"address\":\"lebanon-sour\"}', 1, 'http://localhost:8080/uploads/ticket_maps-1735466973735-450567361.jpg', '2024-12-29 10:09:33', '2024-12-29 10:09:33', 3.00, 1, 0, 'pending', 0.00),
(6, 1, 'Annual Conference3266', 'A premier conference2', '{\"start_date\":\"2024-05-11T11:00:00Z\",\"end_date\":\"2024-05-05T17:00:00Z\"}', '{\"lat\":\"30.712776\",\"lng\":\"-74.005974\",\"address\":\"lebanon-sour\"}', 1, 'http://localhost:8080/uploads/ticket_maps-1735558566416-224721560.jpg', '2024-12-30 11:36:06', '2024-12-30 11:36:06', 3.00, 1, 20, 'pending', 0.00),
(7, 18, 'Annual Conference3266', 'A premier conference2', '{\"start_date\":\"2024-05-11T11:00:00Z\",\"end_date\":\"2024-05-05T17:00:00Z\"}', '{\"lat\":\"30.712776\",\"lng\":\"-74.005974\",\"address\":\"lebanon-sour\"}', 1, 'http://localhost:8080/uploads/ticket_maps-1735558781961-701369423.jpg', '2024-12-30 11:39:41', '2024-12-30 11:39:41', 3.00, 0, 20, 'pending', 0.00);

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
(3, 18, 2, '2024-12-25 13:15:48', '2024-12-25 13:15:48');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `event_id` int(11) DEFAULT NULL,
  `blog_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `notification_type` enum('organizer-approval','event-approval','blog-approval') DEFAULT NULL,
  `alerts` enum('low-stock','low-tickets','report-event','report-blog','report-product') DEFAULT NULL,
  `message` varchar(255) DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `date_time` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `event_id`, `blog_id`, `product_id`, `notification_type`, `alerts`, `message`, `is_read`, `date_time`, `createdAt`, `updatedAt`) VALUES
(1, 1, NULL, NULL, 1, NULL, 'low-stock', 'Low stock for Product A.', 1, '2024-12-30 10:54:08', '2024-12-30 10:54:08', '2024-12-30 10:55:19'),
(2, 1, NULL, NULL, NULL, 'organizer-approval', NULL, 'Fadelhmd has requested to become an organizer. Message: im want to be an organizer', 0, '2024-12-30 11:06:33', '2024-12-30 11:06:33', '2024-12-30 11:06:33'),
(3, 1, NULL, 6, NULL, 'blog-approval', NULL, 'Fadel hmd7 has created a blog titled \"lets try this\" and requests approval.', 0, '2024-12-30 11:28:23', '2024-12-30 11:28:23', '2024-12-30 11:28:23'),
(4, 1, 7, NULL, NULL, 'event-approval', NULL, 'Fadel hmd7 has created an event titled \"Annual Conference3266\" and requests approval.', 0, '2024-12-30 11:39:42', '2024-12-30 11:39:42', '2024-12-30 11:39:42'),
(5, 1, NULL, NULL, 3, NULL, 'low-stock', 'Product T-shirt-v4 is running low on stock. Current stock: 1', 0, '2024-12-30 12:14:21', '2024-12-30 12:14:21', '2024-12-30 12:14:21'),
(6, 1, 1, NULL, NULL, NULL, 'low-tickets', 'Tickets for event \"Annual Conference\" are running low. Remaining tickets: 0', 0, '2024-12-31 13:45:13', '2024-12-31 13:45:13', '2024-12-31 13:45:13');

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
(22, 'delete-event', '2024-12-25 14:44:55', '2024-12-25 14:44:55', NULL),
(23, 'delete-ticket', '2024-12-26 10:22:16', '2024-12-26 10:22:16', NULL),
(24, 'update-ticket', '2024-12-26 10:22:28', '2024-12-26 10:22:28', NULL),
(25, 'create-ticket', '2024-12-26 10:22:35', '2024-12-26 10:22:35', NULL),
(26, 'auth-approve', '2024-12-28 19:22:54', '2024-12-28 19:22:54', NULL),
(28, 'create-blogs', '2024-12-28 19:29:40', '2024-12-28 19:29:40', NULL),
(29, 'update-blogs', '2024-12-28 19:29:50', '2024-12-28 19:29:50', NULL),
(30, 'delete-blogs', '2024-12-28 19:29:56', '2024-12-28 19:29:56', NULL),
(31, 'create-categories', '2024-12-28 19:31:03', '2024-12-28 19:31:03', NULL),
(32, 'update-categories', '2024-12-28 19:31:09', '2024-12-28 19:31:09', NULL),
(33, 'delete-categories', '2024-12-28 19:31:16', '2024-12-28 19:31:16', NULL),
(34, 'create-hobbies', '2024-12-28 19:39:13', '2024-12-28 19:39:13', NULL),
(35, 'update-hobbies', '2024-12-28 19:39:20', '2024-12-28 19:39:20', NULL),
(36, 'delete-hobbies', '2024-12-28 19:39:27', '2024-12-28 19:39:27', NULL),
(38, 'create-operataor', '2024-12-28 20:06:25', '2024-12-28 20:06:25', NULL),
(39, 'read-product-purchase', '2024-12-29 12:39:57', '2024-12-29 12:39:57', NULL),
(40, 'update-product-purchase', '2024-12-29 12:40:05', '2024-12-29 12:40:05', NULL),
(41, 'delete-product-purchase', '2024-12-29 12:40:14', '2024-12-29 12:40:14', NULL),
(42, 'create-product-purchase', '2024-12-29 13:14:35', '2024-12-29 13:14:35', NULL),
(43, 'create-blog', '2024-12-29 14:48:27', '2024-12-29 14:48:27', NULL),
(45, 'create-operator', '2024-12-31 14:44:30', '2024-12-31 14:44:30', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `image` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`image`)),
  `price` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`price`)),
  `size` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`size`)),
  `color` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`color`)),
  `commission` decimal(5,2) NOT NULL DEFAULT 100.00,
  `is_approved` tinyint(1) NOT NULL DEFAULT 0,
  `stock_alert` int(11) NOT NULL DEFAULT 10,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `quantity_in_stock` int(11) NOT NULL DEFAULT 10
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `user_id`, `name`, `description`, `image`, `price`, `size`, `color`, `commission`, `is_approved`, `stock_alert`, `createdAt`, `updatedAt`, `quantity_in_stock`) VALUES
(1, 1, 'T-shirt', 'T-shirt v1 is the most amamzing on the planet', '[]', '[10,12,15,17,18,25,36.5]', '[\"S\",\"M\",\"L\",\"XL\"]', '[\"Red\",\"Blue\",\"Green\",\"Brown\"]', 100.00, 1, 20, '2024-12-29 11:32:33', '2024-12-29 14:03:47', 7),
(2, 1, 'T-shirt-v3', 'T-shirt v3 is the most amamzing on the planet', '[\"http://localhost:8080/uploads/image-1735473188311-493598170.webp\",\"http://localhost:8080/uploads/image-1735473188311-516579452.jpeg\"]', '[10,12,15,17]', '[\"S\",\"M\",\"L\",\"XL\",\"XXL\"]', '[\"Red\",\"Blue\",\"Green\",\"Brown\"]', 100.00, 1, 10, '2024-12-29 11:53:08', '2024-12-29 11:53:08', 10),
(3, 1, 'T-shirt-v4', 'T-shirt v4 is the most amamzing on the planet', '[]', '[10,12,15,17,15,16,19,22,23,25,36,24]', '[\"L\",\"XL\",\"XXL\"]', '[\"Red\",\"Blue\",\"Green\",\"Brown\"]', 100.00, 1, 1, '2024-12-30 11:54:43', '2024-12-30 12:48:00', 0);

-- --------------------------------------------------------

--
-- Table structure for table `product_purchases`
--

CREATE TABLE `product_purchases` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `total_price` decimal(10,2) NOT NULL,
  `status` enum('pending','completed','cancelled') DEFAULT 'pending',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_purchases`
--

INSERT INTO `product_purchases` (`id`, `product_id`, `user_id`, `quantity`, `total_price`, `status`, `createdAt`, `updatedAt`) VALUES
(1, 1, 1, 3, 54.00, 'completed', '2024-12-29 13:33:01', '2024-12-29 14:03:47'),
(2, 3, 18, 4, 92.00, 'completed', '2024-12-30 11:55:56', '2024-12-30 11:57:00'),
(3, 3, 18, 4, 88.00, 'completed', '2024-12-30 12:02:00', '2024-12-30 12:02:26'),
(4, 3, 18, 1, 22.00, 'completed', '2024-12-30 12:14:08', '2024-12-30 12:14:21'),
(5, 3, 18, 1, 22.00, 'pending', '2024-12-30 12:48:00', '2024-12-30 12:48:00');

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
  `event_id` int(11) NOT NULL,
  `waves` varchar(255) DEFAULT NULL,
  `amount_issued` int(11) NOT NULL,
  `issued_at` datetime DEFAULT NULL,
  `price` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`price`)),
  `section` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`section`)),
  `total_seats` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`total_seats`)),
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `tickets_sold_count` int(11) DEFAULT 0,
  `tickets_sold_count_sum_price` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tickets`
--

INSERT INTO `tickets` (`id`, `event_id`, `waves`, `amount_issued`, `issued_at`, `price`, `section`, `total_seats`, `createdAt`, `updatedAt`, `tickets_sold_count`, `tickets_sold_count_sum_price`) VALUES
(2, 1, 'wave-1', 8, '2024-12-30 13:45:19', '[{\"color\":\"blue\",\"price\":130},{\"color\":\"red\",\"price\":70}]', '[{\"color\":\"blue\",\"section\":[\"A\",\"B\"]},{\"color\":\"red\",\"section\":[\"B\"]}]', '[{\"section\":\"A\",\"seats\":4},{\"section\":\"B\",\"seats\":4}]', '2024-12-30 13:45:19', '2025-01-01 11:58:24', 5, 530.00);

-- --------------------------------------------------------

--
-- Table structure for table `ticket_solds`
--

CREATE TABLE `ticket_solds` (
  `id` int(11) NOT NULL,
  `buyer_id` int(11) NOT NULL,
  `ticket_id` int(11) NOT NULL,
  `section` varchar(255) NOT NULL,
  `seat` int(11) NOT NULL,
  `color` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `status` enum('pending','reserved','sold','canceled') DEFAULT 'pending',
  `reserved_at` datetime DEFAULT NULL,
  `qr_code` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ticket_solds`
--

INSERT INTO `ticket_solds` (`id`, `buyer_id`, `ticket_id`, `section`, `seat`, `color`, `price`, `status`, `reserved_at`, `qr_code`, `createdAt`, `updatedAt`) VALUES
(1, 1, 2, 'A', 1, 'blue', 130.00, 'sold', '2025-01-01 11:20:24', 'data:image/png;base64,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', '2025-01-01 11:20:24', '2025-01-01 11:21:45'),
(2, 1, 2, 'B', 1, 'red', 70.00, 'sold', '2025-01-01 11:20:24', 'data:image/png;base64,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', '2025-01-01 11:20:24', '2025-01-01 11:23:21'),
(3, 1, 2, 'A', 2, 'blue', 130.00, 'sold', '2025-01-01 11:20:24', 'data:image/png;base64,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', '2025-01-01 11:20:24', '2025-01-01 11:23:21'),
(4, 1, 2, 'B', 2, 'red', 70.00, 'sold', '2025-01-01 11:20:24', 'data:image/png;base64,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', '2025-01-01 11:20:24', '2025-01-01 11:58:24'),
(5, 1, 2, 'A', 3, 'blue', 130.00, 'sold', '2025-01-01 11:20:24', 'data:image/png;base64,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', '2025-01-01 11:20:24', '2025-01-01 11:58:24'),
(6, 1, 2, 'B', 3, 'red', 70.00, 'reserved', '2025-01-01 11:20:24', NULL, '2025-01-01 11:20:24', '2025-01-01 11:20:24'),
(7, 1, 2, 'A', 4, 'blue', 130.00, 'reserved', '2025-01-01 11:20:24', NULL, '2025-01-01 11:20:24', '2025-01-01 11:20:24'),
(8, 1, 2, 'B', 4, 'red', 70.00, 'reserved', '2025-01-01 11:20:24', NULL, '2025-01-01 11:20:24', '2025-01-01 11:20:24');

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
(1, '[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,20,21,22,23,24,25,39,40,41,42,43,45]', 'Fadelhmd', 'fadel.ahammoud@gmail.com', '$2a$10$wpMU1fgZaDCDM4ETo8kDWeLzVfFdtd5k2Y4FLxOOyF9rBC.ySKg/6', '10203050', '1996-01-20', 'Admin', 'Male', 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6IkFkbWluIiwiaWF0IjoxNzM1MzA0MTIzLCJleHAiOjE3MzU5MDg5MjN9.2tb_ESvj0oPT3XRTsfNt7CQrAr0SROo3aQ799E2jICY', '2025-01-03 12:55:23', '2024-12-20 09:03:22', '2024-12-31 14:44:42', 1, '[2]'),
(18, '[2,10,11,12,13,14,16,17,18,20,21,22,23,24,25,28,29,30,38]', 'Fadel hmd7', 'fadelhammoud@innoalchemy.com', '$2a$10$w2gVDrlmhKbwXcE03Rgl8uiKloMiK42P6d7b7K6R8vSvWu8QPPrey', '714916136666', '1996-01-20', 'Organizer', 'Male', 1, NULL, NULL, '2024-12-24 16:09:29', '2024-12-29 10:06:37', 0, '[]'),
(24, '[2,13,14]', 'Abbas', 'abbas.mosaleh@gmail.com', NULL, '71080906', '1997-01-11', 'Organizer', 'Male', 1, 'ec274f8ac1ce63d02676ac755f0314b982b20271c7b552114f8db096c738158f', '2024-12-31 09:02:53', '2024-12-28 09:02:53', '2024-12-28 09:02:53', 0, '[]'),
(25, '[]', 'John Doe', 'irada@innoalchemy.business', '$2a$10$nfpizAIUVktiFFcyeNmjVO.1jBh5qDRfQD0YLUkVi8umIO0KIE7UG', '1234567890', '1990-01-01', 'Operator', 'Male', 1, NULL, NULL, '2024-12-31 14:50:10', '2024-12-31 14:51:15', 0, '[]');

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
  ADD UNIQUE KEY `name_29` (`name`),
  ADD UNIQUE KEY `name_30` (`name`),
  ADD UNIQUE KEY `name_31` (`name`),
  ADD UNIQUE KEY `name_32` (`name`),
  ADD UNIQUE KEY `name_33` (`name`),
  ADD UNIQUE KEY `name_34` (`name`),
  ADD UNIQUE KEY `name_35` (`name`),
  ADD UNIQUE KEY `name_36` (`name`),
  ADD UNIQUE KEY `name_37` (`name`),
  ADD UNIQUE KEY `name_38` (`name`),
  ADD UNIQUE KEY `name_39` (`name`),
  ADD UNIQUE KEY `name_40` (`name`),
  ADD UNIQUE KEY `name_41` (`name`);

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
  ADD UNIQUE KEY `coupon_key_3` (`coupon_key`),
  ADD UNIQUE KEY `coupon_key_4` (`coupon_key`),
  ADD UNIQUE KEY `coupon_key_5` (`coupon_key`),
  ADD UNIQUE KEY `coupon_key_6` (`coupon_key`),
  ADD UNIQUE KEY `coupon_key_7` (`coupon_key`),
  ADD UNIQUE KEY `coupon_key_8` (`coupon_key`),
  ADD UNIQUE KEY `coupon_key_9` (`coupon_key`),
  ADD UNIQUE KEY `coupon_key_10` (`coupon_key`),
  ADD UNIQUE KEY `coupon_key_11` (`coupon_key`),
  ADD UNIQUE KEY `coupon_key_12` (`coupon_key`),
  ADD UNIQUE KEY `coupon_key_13` (`coupon_key`),
  ADD UNIQUE KEY `coupon_key_14` (`coupon_key`),
  ADD KEY `event_id` (`event_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `organizer_id` (`organizer_id`);

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
  ADD KEY `hobbies` (`hobbies`);

--
-- Indexes for table `likes`
--
ALTER TABLE `likes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `blog_id` (`blog_id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `event_id` (`event_id`),
  ADD KEY `blog_id` (`blog_id`),
  ADD KEY `product_id` (`product_id`);

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
  ADD UNIQUE KEY `name_30` (`name`),
  ADD UNIQUE KEY `name_31` (`name`),
  ADD UNIQUE KEY `name_32` (`name`),
  ADD UNIQUE KEY `name_33` (`name`),
  ADD UNIQUE KEY `name_34` (`name`),
  ADD UNIQUE KEY `name_35` (`name`),
  ADD UNIQUE KEY `name_36` (`name`),
  ADD UNIQUE KEY `name_37` (`name`),
  ADD UNIQUE KEY `name_38` (`name`),
  ADD UNIQUE KEY `name_39` (`name`),
  ADD UNIQUE KEY `name_40` (`name`),
  ADD UNIQUE KEY `name_41` (`name`),
  ADD KEY `permissions` (`permissions`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
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
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `product_purchases`
--
ALTER TABLE `product_purchases`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `user_id` (`user_id`);

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
  ADD KEY `event_id` (`event_id`);

--
-- Indexes for table `ticket_solds`
--
ALTER TABLE `ticket_solds`
  ADD PRIMARY KEY (`id`),
  ADD KEY `buyer_id` (`buyer_id`),
  ADD KEY `ticket_id` (`ticket_id`);

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
  ADD UNIQUE KEY `email_32` (`email`),
  ADD UNIQUE KEY `email_33` (`email`),
  ADD UNIQUE KEY `email_34` (`email`),
  ADD UNIQUE KEY `email_35` (`email`),
  ADD UNIQUE KEY `email_36` (`email`),
  ADD UNIQUE KEY `email_37` (`email`),
  ADD UNIQUE KEY `email_38` (`email`),
  ADD UNIQUE KEY `email_39` (`email`),
  ADD UNIQUE KEY `email_40` (`email`),
  ADD UNIQUE KEY `email_41` (`email`),
  ADD UNIQUE KEY `email_42` (`email`),
  ADD UNIQUE KEY `email_43` (`email`),
  ADD UNIQUE KEY `email_44` (`email`),
  ADD UNIQUE KEY `email_45` (`email`),
  ADD UNIQUE KEY `phone_number` (`phone_number`),
  ADD UNIQUE KEY `phone_number_2` (`phone_number`),
  ADD UNIQUE KEY `phone_number_3` (`phone_number`),
  ADD UNIQUE KEY `phone_number_4` (`phone_number`),
  ADD UNIQUE KEY `phone_number_5` (`phone_number`),
  ADD UNIQUE KEY `phone_number_6` (`phone_number`),
  ADD UNIQUE KEY `phone_number_7` (`phone_number`),
  ADD UNIQUE KEY `phone_number_8` (`phone_number`),
  ADD UNIQUE KEY `phone_number_9` (`phone_number`),
  ADD UNIQUE KEY `phone_number_10` (`phone_number`),
  ADD UNIQUE KEY `phone_number_11` (`phone_number`),
  ADD UNIQUE KEY `phone_number_12` (`phone_number`),
  ADD UNIQUE KEY `phone_number_13` (`phone_number`),
  ADD UNIQUE KEY `phone_number_14` (`phone_number`),
  ADD UNIQUE KEY `phone_number_15` (`phone_number`),
  ADD UNIQUE KEY `phone_number_16` (`phone_number`),
  ADD UNIQUE KEY `phone_number_17` (`phone_number`),
  ADD UNIQUE KEY `phone_number_18` (`phone_number`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

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
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `product_purchases`
--
ALTER TABLE `product_purchases`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `profile_details`
--
ALTER TABLE `profile_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tickets`
--
ALTER TABLE `tickets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `ticket_solds`
--
ALTER TABLE `ticket_solds`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

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
  ADD CONSTRAINT `blogs_ibfk_29` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `blogs_ibfk_30` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `blogs_ibfk_31` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `blogs_ibfk_32` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `blogs_ibfk_33` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `blogs_ibfk_34` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `blogs_ibfk_35` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `blogs_ibfk_36` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `blogs_ibfk_37` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `blogs_ibfk_38` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `blogs_ibfk_39` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `blogs_ibfk_40` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `blogs_ibfk_41` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `blogs_ibfk_42` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `blogs_ibfk_43` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comments_ibfk_10` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comments_ibfk_11` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comments_ibfk_12` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comments_ibfk_13` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comments_ibfk_14` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comments_ibfk_15` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comments_ibfk_16` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comments_ibfk_17` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comments_ibfk_18` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comments_ibfk_19` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comments_ibfk_20` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comments_ibfk_21` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comments_ibfk_22` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comments_ibfk_23` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comments_ibfk_24` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comments_ibfk_25` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comments_ibfk_26` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comments_ibfk_27` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comments_ibfk_28` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comments_ibfk_29` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comments_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comments_ibfk_30` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comments_ibfk_4` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comments_ibfk_5` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comments_ibfk_6` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comments_ibfk_7` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comments_ibfk_8` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comments_ibfk_9` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `coupons`
--
ALTER TABLE `coupons`
  ADD CONSTRAINT `coupons_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `coupons_ibfk_10` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `coupons_ibfk_11` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `coupons_ibfk_12` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `coupons_ibfk_13` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `coupons_ibfk_14` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `coupons_ibfk_15` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `coupons_ibfk_16` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `coupons_ibfk_17` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `coupons_ibfk_18` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `coupons_ibfk_19` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `coupons_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `coupons_ibfk_20` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `coupons_ibfk_21` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `coupons_ibfk_22` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `coupons_ibfk_23` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `coupons_ibfk_24` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `coupons_ibfk_25` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `coupons_ibfk_26` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `coupons_ibfk_27` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `coupons_ibfk_28` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `coupons_ibfk_29` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `coupons_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `coupons_ibfk_30` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `coupons_ibfk_31` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `coupons_ibfk_32` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `coupons_ibfk_33` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `coupons_ibfk_34` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `coupons_ibfk_35` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `coupons_ibfk_36` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `coupons_ibfk_37` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `coupons_ibfk_38` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `coupons_ibfk_39` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `coupons_ibfk_4` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `coupons_ibfk_40` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `coupons_ibfk_41` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `coupons_ibfk_42` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `coupons_ibfk_5` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `coupons_ibfk_6` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `coupons_ibfk_7` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `coupons_ibfk_8` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `coupons_ibfk_9` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `events_ibfk_1` FOREIGN KEY (`organizer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `events_ibfk_10` FOREIGN KEY (`organizer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `events_ibfk_11` FOREIGN KEY (`organizer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `events_ibfk_12` FOREIGN KEY (`organizer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `events_ibfk_13` FOREIGN KEY (`organizer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `events_ibfk_14` FOREIGN KEY (`organizer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `events_ibfk_15` FOREIGN KEY (`organizer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `events_ibfk_2` FOREIGN KEY (`organizer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `events_ibfk_3` FOREIGN KEY (`organizer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `events_ibfk_4` FOREIGN KEY (`organizer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `events_ibfk_5` FOREIGN KEY (`organizer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `events_ibfk_6` FOREIGN KEY (`organizer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `events_ibfk_7` FOREIGN KEY (`organizer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `events_ibfk_8` FOREIGN KEY (`organizer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `events_ibfk_9` FOREIGN KEY (`organizer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `hobbies`
--
ALTER TABLE `hobbies`
  ADD CONSTRAINT `hobbies_ibfk_1` FOREIGN KEY (`hobbies`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `hobbies_ibfk_10` FOREIGN KEY (`hobbies`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `hobbies_ibfk_11` FOREIGN KEY (`hobbies`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `hobbies_ibfk_12` FOREIGN KEY (`hobbies`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `hobbies_ibfk_13` FOREIGN KEY (`hobbies`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `hobbies_ibfk_14` FOREIGN KEY (`hobbies`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `hobbies_ibfk_15` FOREIGN KEY (`hobbies`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `hobbies_ibfk_16` FOREIGN KEY (`hobbies`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `hobbies_ibfk_17` FOREIGN KEY (`hobbies`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `hobbies_ibfk_18` FOREIGN KEY (`hobbies`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `hobbies_ibfk_19` FOREIGN KEY (`hobbies`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `hobbies_ibfk_2` FOREIGN KEY (`hobbies`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `hobbies_ibfk_3` FOREIGN KEY (`hobbies`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `hobbies_ibfk_4` FOREIGN KEY (`hobbies`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `hobbies_ibfk_5` FOREIGN KEY (`hobbies`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `hobbies_ibfk_6` FOREIGN KEY (`hobbies`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `hobbies_ibfk_7` FOREIGN KEY (`hobbies`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `hobbies_ibfk_8` FOREIGN KEY (`hobbies`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `hobbies_ibfk_9` FOREIGN KEY (`hobbies`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `likes`
--
ALTER TABLE `likes`
  ADD CONSTRAINT `likes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `likes_ibfk_10` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `likes_ibfk_11` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `likes_ibfk_12` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `likes_ibfk_13` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `likes_ibfk_14` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `likes_ibfk_15` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `likes_ibfk_16` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `likes_ibfk_17` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `likes_ibfk_18` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `likes_ibfk_19` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `likes_ibfk_2` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `likes_ibfk_20` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `likes_ibfk_21` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `likes_ibfk_22` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `likes_ibfk_23` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `likes_ibfk_24` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `likes_ibfk_25` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `likes_ibfk_26` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `likes_ibfk_27` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `likes_ibfk_28` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `likes_ibfk_29` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `likes_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `likes_ibfk_30` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `likes_ibfk_4` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `likes_ibfk_5` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `likes_ibfk_6` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `likes_ibfk_7` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `likes_ibfk_8` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `likes_ibfk_9` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_10` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_11` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_12` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_13` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_14` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_15` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_16` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_3` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_4` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_5` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_6` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_7` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_8` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_9` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

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
  ADD CONSTRAINT `permissions_ibfk_30` FOREIGN KEY (`permissions`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `permissions_ibfk_31` FOREIGN KEY (`permissions`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `permissions_ibfk_32` FOREIGN KEY (`permissions`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `permissions_ibfk_33` FOREIGN KEY (`permissions`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `permissions_ibfk_34` FOREIGN KEY (`permissions`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `permissions_ibfk_35` FOREIGN KEY (`permissions`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `permissions_ibfk_36` FOREIGN KEY (`permissions`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `permissions_ibfk_37` FOREIGN KEY (`permissions`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `permissions_ibfk_38` FOREIGN KEY (`permissions`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `permissions_ibfk_39` FOREIGN KEY (`permissions`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `permissions_ibfk_4` FOREIGN KEY (`permissions`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `permissions_ibfk_40` FOREIGN KEY (`permissions`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `permissions_ibfk_41` FOREIGN KEY (`permissions`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `permissions_ibfk_5` FOREIGN KEY (`permissions`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `permissions_ibfk_6` FOREIGN KEY (`permissions`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `permissions_ibfk_7` FOREIGN KEY (`permissions`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `permissions_ibfk_8` FOREIGN KEY (`permissions`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `permissions_ibfk_9` FOREIGN KEY (`permissions`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `products_ibfk_10` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `products_ibfk_11` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `products_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `products_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `products_ibfk_4` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `products_ibfk_5` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `products_ibfk_6` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `products_ibfk_7` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `products_ibfk_8` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `products_ibfk_9` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `product_purchases`
--
ALTER TABLE `product_purchases`
  ADD CONSTRAINT `product_purchases_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `product_purchases_ibfk_10` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `product_purchases_ibfk_11` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `product_purchases_ibfk_12` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `product_purchases_ibfk_13` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `product_purchases_ibfk_14` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `product_purchases_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `product_purchases_ibfk_3` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `product_purchases_ibfk_4` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `product_purchases_ibfk_5` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `product_purchases_ibfk_6` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `product_purchases_ibfk_7` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `product_purchases_ibfk_8` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `product_purchases_ibfk_9` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `profile_details`
--
ALTER TABLE `profile_details`
  ADD CONSTRAINT `profile_details_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `profile_details_ibfk_10` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `profile_details_ibfk_11` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `profile_details_ibfk_12` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `profile_details_ibfk_13` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `profile_details_ibfk_14` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `profile_details_ibfk_15` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `profile_details_ibfk_16` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `profile_details_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `profile_details_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `profile_details_ibfk_4` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `profile_details_ibfk_5` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `profile_details_ibfk_6` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `profile_details_ibfk_7` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `profile_details_ibfk_8` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `profile_details_ibfk_9` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tickets`
--
ALTER TABLE `tickets`
  ADD CONSTRAINT `tickets_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tickets_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tickets_ibfk_3` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tickets_ibfk_4` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `ticket_solds`
--
ALTER TABLE `ticket_solds`
  ADD CONSTRAINT `ticket_solds_ibfk_1` FOREIGN KEY (`buyer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ticket_solds_ibfk_2` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `views`
--
ALTER TABLE `views`
  ADD CONSTRAINT `views_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `views_ibfk_10` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `views_ibfk_11` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `views_ibfk_12` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `views_ibfk_13` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `views_ibfk_14` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `views_ibfk_15` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `views_ibfk_16` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `views_ibfk_17` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `views_ibfk_18` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `views_ibfk_19` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `views_ibfk_2` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `views_ibfk_20` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `views_ibfk_21` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `views_ibfk_22` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `views_ibfk_23` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `views_ibfk_24` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `views_ibfk_25` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `views_ibfk_26` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `views_ibfk_27` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `views_ibfk_28` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `views_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `views_ibfk_4` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `views_ibfk_5` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `views_ibfk_6` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `views_ibfk_7` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `views_ibfk_8` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `views_ibfk_9` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
