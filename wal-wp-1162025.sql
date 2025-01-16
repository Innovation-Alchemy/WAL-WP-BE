-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 16, 2025 at 09:17 AM
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
-- Table structure for table `advertisements`
--

CREATE TABLE `advertisements` (
  `id` int(11) NOT NULL,
  `admin_id` int(11) NOT NULL,
  `customer_id` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`customer_id`)),
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `target_audience` text DEFAULT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`images`)),
  `ads_spend` double NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `blogreports`
--

CREATE TABLE `blogreports` (
  `id` int(11) NOT NULL,
  `blog_id` int(11) NOT NULL,
  `report_id` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `blogreports`
--

INSERT INTO `blogreports` (`id`, `blog_id`, `report_id`, `createdAt`, `updatedAt`, `description`) VALUES
(2, 1, 1, '2025-01-08 08:22:43', '2025-01-08 08:22:43', 'a bad info');

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
  `files` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`files`)),
  `description` text DEFAULT NULL,
  `is_approved` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `blogs`
--

INSERT INTO `blogs` (`id`, `user_id`, `event_id`, `title`, `content`, `files`, `description`, `is_approved`, `createdAt`, `updatedAt`) VALUES
(1, 1, NULL, 'lets try this', 'popolololololololo', '[]', 'without tags or files', 1, '2025-01-08 08:22:31', '2025-01-08 08:22:31');

-- --------------------------------------------------------

--
-- Table structure for table `blogtags`
--

CREATE TABLE `blogtags` (
  `id` int(11) NOT NULL,
  `blog_id` int(11) NOT NULL,
  `tag_id` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `blogtags`
--

INSERT INTO `blogtags` (`id`, `blog_id`, `tag_id`, `createdAt`, `updatedAt`) VALUES
(1, 1, 1, '2025-01-08 08:36:05', '2025-01-08 08:36:05');

-- --------------------------------------------------------

--
-- Table structure for table `carts`
--

CREATE TABLE `carts` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `products` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`products`)),
  `status` enum('pending','checked_out') DEFAULT 'pending',
  `total_price` double NOT NULL DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `carts`
--

INSERT INTO `carts` (`id`, `user_id`, `products`, `status`, `total_price`, `createdAt`, `updatedAt`) VALUES
(1, 1, '[{\"product_id\":1,\"color\":\"brown\",\"size\":\"S\",\"quantity\":2,\"price\":20}]', 'checked_out', 40, '2025-01-09 11:03:47', '2025-01-09 11:25:31'),
(2, 1, '[{\"product_id\":1,\"color\":\"blue\",\"size\":\"M\",\"quantity\":3,\"price\":20}]', 'checked_out', 60, '2025-01-09 12:06:56', '2025-01-09 12:55:21'),
(3, 1, '[{\"product_id\":1,\"color\":\"blue\",\"size\":\"M\",\"quantity\":3,\"price\":20},{\"product_id\":1,\"color\":\"brown\",\"size\":\"S\",\"quantity\":3,\"price\":20}]', 'checked_out', 120, '2025-01-09 12:55:38', '2025-01-09 13:05:05'),
(4, 1, '[]', 'checked_out', 0, '2025-01-09 13:06:14', '2025-01-09 13:06:14'),
(5, 1, '[{\"product_id\":1,\"color\":\"brown\",\"size\":\"S\",\"quantity\":10,\"price\":20},{\"product_id\":1,\"color\":\"blue\",\"size\":\"M\",\"quantity\":3,\"price\":20}]', 'pending', 260, '2025-01-09 13:11:57', '2025-01-09 13:12:38');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `categories` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `blog_id` int(11) DEFAULT NULL,
  `event_id` int(11) DEFAULT NULL,
  `ads_id` int(11) DEFAULT NULL,
  `content` text NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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

-- --------------------------------------------------------

--
-- Table structure for table `eventreports`
--

CREATE TABLE `eventreports` (
  `id` int(11) NOT NULL,
  `event_id` int(11) NOT NULL,
  `report_id` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` int(11) NOT NULL,
  `organizer_id` int(11) NOT NULL,
  `categories` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`categories`)),
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `date_time` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`date_time`)),
  `location` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`location`)),
  `seated` tinyint(1) NOT NULL DEFAULT 1,
  `ticket_maps` varchar(255) DEFAULT NULL,
  `commission` decimal(5,2) NOT NULL DEFAULT 3.00,
  `is_approved` tinyint(1) NOT NULL DEFAULT 0,
  `status` enum('pending','in-progress','canceled','done') DEFAULT 'pending',
  `total_revenue` decimal(10,2) DEFAULT 0.00,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `organizer_id`, `categories`, `title`, `description`, `date_time`, `location`, `seated`, `ticket_maps`, `commission`, `is_approved`, `status`, `total_revenue`, `createdAt`, `updatedAt`) VALUES
(1, 1, '[]', 'Annual Conference3266', 'A premier conference2', '[\"2025-07-10T18:00:00\",\"2025-07-11T18:00:00\",\"2025-07-12T18:00:00\"]', '{\"lat\":\"30.712776\",\"lng\":\"-74.005974\",\"address\":\"lebanon-sour\"}', 0, NULL, 4.00, 1, 'pending', 2.00, '2025-01-08 11:11:48', '2025-01-08 12:01:06'),
(2, 1, '[]', 'eminem', 'a kwim event with the best rapper alive', '[\"2025-07-10T18:00:00\",\"2025-07-11T18:00:00\",\"2025-07-12T18:00:00\"]', '{\"lat\":\"30.712776\",\"lng\":\"-74.005974\",\"address\":\"lebanon-beirut\"}', 1, NULL, 3.00, 1, 'pending', 3.30, '2025-01-08 12:04:06', '2025-01-08 14:05:02'),
(3, 1, '[]', 'taylor swift', 'a taylor event with the best rapper alive', '[\"2025-07-10T18:00:00\",\"2025-07-11T18:00:00\",\"2025-07-12T18:00:00\"]', '{\"lat\":\"30.712776\",\"lng\":\"-74.005974\",\"address\":\"lebanon-beirut\"}', 0, NULL, 3.00, 1, 'pending', 32.10, '2025-01-08 14:23:37', '2025-01-08 15:01:32');

-- --------------------------------------------------------

--
-- Table structure for table `eventtags`
--

CREATE TABLE `eventtags` (
  `id` int(11) NOT NULL,
  `event_id` int(11) NOT NULL,
  `tag_id` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
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

-- --------------------------------------------------------

--
-- Table structure for table `likes`
--

CREATE TABLE `likes` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `blog_id` int(11) DEFAULT NULL,
  `event_id` int(11) DEFAULT NULL,
  `ads_id` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `news`
--

CREATE TABLE `news` (
  `id` int(11) NOT NULL,
  `admin_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `category` varchar(255) NOT NULL,
  `published_at` datetime DEFAULT NULL,
  `images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`images`)),
  `language` enum('en','ar') NOT NULL DEFAULT 'en',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(1, 1, 2, NULL, NULL, NULL, 'low-tickets', 'Tickets for event \"eminem\" are running low. Remaining tickets: 19', 0, '2025-01-08 14:05:02', '2025-01-08 14:05:02', '2025-01-08 14:05:02'),
(2, 1, 3, NULL, NULL, NULL, 'low-tickets', 'Tickets for event \"taylor swift\" are running low. Remaining tickets: 179', 0, '2025-01-08 15:01:30', '2025-01-08 15:01:30', '2025-01-08 15:01:30'),
(3, 1, NULL, NULL, 1, NULL, 'low-stock', 'Stock is low for product_id=1, color=brown, size=S. Remaining: 5', 0, '2025-01-09 13:05:05', '2025-01-09 13:05:05', '2025-01-09 13:05:05'),
(4, 1, NULL, NULL, 2, '', NULL, 'Product \"short\" requires approval.', 0, '2025-01-09 13:58:24', '2025-01-09 13:58:24', '2025-01-09 13:58:24');

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `token` varchar(255) NOT NULL,
  `expires_at` datetime NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(1, 'create-permission', '2025-01-07 10:48:43', '2025-01-07 10:48:43', NULL),
(2, 'update-permission', '2025-01-07 10:48:51', '2025-01-07 10:48:51', NULL),
(3, 'delete-permission', '2025-01-07 10:48:59', '2025-01-07 10:48:59', NULL),
(4, 'remove-permission', '2025-01-07 10:49:28', '2025-01-07 10:49:28', NULL),
(5, 'read-permission', '2025-01-07 10:49:35', '2025-01-07 10:49:35', NULL),
(6, 'create-product', '2025-01-07 10:50:12', '2025-01-07 10:50:12', NULL),
(7, 'update-product', '2025-01-07 10:50:20', '2025-01-07 10:50:20', NULL),
(8, 'delete-product', '2025-01-07 10:50:27', '2025-01-07 10:50:27', NULL),
(9, 'create-blog', '2025-01-08 08:21:17', '2025-01-08 08:21:17', NULL),
(10, 'update-blog', '2025-01-08 08:21:26', '2025-01-08 08:21:26', NULL),
(11, 'delete-blog', '2025-01-08 08:21:34', '2025-01-08 08:21:34', NULL),
(12, 'create-event', '2025-01-08 11:02:13', '2025-01-08 11:02:13', NULL),
(13, 'update-event', '2025-01-08 11:02:30', '2025-01-08 11:02:30', NULL),
(14, 'delete-event', '2025-01-08 11:02:37', '2025-01-08 11:02:37', NULL),
(15, 'create-ticket', '2025-01-08 11:12:30', '2025-01-08 11:12:30', NULL),
(16, 'update-ticket', '2025-01-08 11:12:39', '2025-01-08 11:12:39', NULL),
(17, 'delete-ticket', '2025-01-08 11:12:45', '2025-01-08 11:12:45', NULL),
(18, 'create-operator', '2025-01-09 13:43:30', '2025-01-09 13:43:30', NULL),
(19, 'auth-approve', '2025-01-09 13:50:14', '2025-01-09 13:50:14', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `productreports`
--

CREATE TABLE `productreports` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `report_id` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `productreports`
--

INSERT INTO `productreports` (`id`, `product_id`, `report_id`, `createdAt`, `updatedAt`, `description`) VALUES
(1, 1, 1, '2025-01-08 08:06:21', '2025-01-08 08:06:21', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `blog_id` int(11) DEFAULT NULL,
  `event_id` int(11) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `price` double NOT NULL,
  `image` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`image`)),
  `size` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`size`)),
  `color` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`color`)),
  `commission` decimal(5,2) NOT NULL DEFAULT 100.00,
  `is_approved` tinyint(1) NOT NULL DEFAULT 0,
  `categories` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`categories`)),
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `user_id`, `blog_id`, `event_id`, `name`, `description`, `price`, `image`, `size`, `color`, `commission`, `is_approved`, `categories`, `createdAt`, `updatedAt`) VALUES
(1, 1, NULL, NULL, 'T-shirt', 'T-shirt  is the most amamzing on the planet', 20, '[{\"color\":\"brown\",\"image\":\"http://localhost:8080/uploads/image-1736249539531-49853363.jpeg\"},{\"color\":\"blue\",\"image\":\"http://localhost:8080/uploads/image-1736249539532-622797209.jpg\"}]', '[\"S\",\"M\",\"L\"]', '[\"brown\",\"blue\"]', 15.00, 0, '[]', '2025-01-07 11:32:19', '2025-01-07 11:32:19'),
(2, 2, NULL, 1, 'short', 'short  is the most amamzing on the planet', 30, '[{\"color\":\"red\",\"image\":\"http://localhost:8080/uploads/image-1736431103702-580869939.jpeg\"},{\"color\":\"blue\",\"image\":\"http://localhost:8080/uploads/image-1736431103717-236134708.jpeg\"}]', '[\"S\",\"M\",\"L\",\"XL\"]', '[\"red\",\"blue\"]', 50.00, 0, '[]', '2025-01-09 13:58:23', '2025-01-09 13:58:23'),
(4, 1, NULL, NULL, 'short-v', 'short  is the most amamzing on the planet', 40, '[{\"color\":\"red\",\"image\":\"http://localhost:8080/uploads/image-1736431166063-930161691.jpeg\"},{\"color\":\"blue\",\"image\":\"http://localhost:8080/uploads/image-1736431166064-52670359.jpeg\"}]', '[\"S\",\"M\",\"L\",\"XL\"]', '[\"red\",\"blue\"]', 50.00, 1, '[]', '2025-01-09 13:59:26', '2025-01-09 13:59:26'),
(6, 1, NULL, NULL, 'short-v2', 'short  is the most amamzing on the planet', 40, '[{\"color\":\"red\",\"image\":\"http://localhost:8080/uploads/image-1736431277722-956111543.jpeg\"},{\"color\":\"blue\",\"image\":\"http://localhost:8080/uploads/image-1736431277723-326577755.jpeg\"}]', '[\"S\",\"M\",\"L\",\"XL\"]', '[\"red\",\"blue\"]', 50.00, 1, '[]', '2025-01-09 14:01:17', '2025-01-09 14:01:17');

-- --------------------------------------------------------

--
-- Table structure for table `producttags`
--

CREATE TABLE `producttags` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `tag_id` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product_purchases`
--

CREATE TABLE `product_purchases` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `color` varchar(255) NOT NULL,
  `size` varchar(255) NOT NULL,
  `price` double NOT NULL,
  `quantity` int(11) NOT NULL,
  `quantity_unit` varchar(255) NOT NULL DEFAULT 'pcs',
  `total_price` double NOT NULL,
  `status` enum('pending','completed','canceled') DEFAULT 'pending',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_purchases`
--

INSERT INTO `product_purchases` (`id`, `product_id`, `user_id`, `color`, `size`, `price`, `quantity`, `quantity_unit`, `total_price`, `status`, `createdAt`, `updatedAt`) VALUES
(1, 1, 1, 'brown', 'S', 20, 2, 'pcs', 40, 'completed', '2025-01-09 11:25:31', '2025-01-09 11:25:31'),
(2, 1, 1, 'blue', 'M', 20, 3, 'pcs', 60, 'completed', '2025-01-09 12:55:21', '2025-01-09 12:55:21'),
(3, 1, 1, 'blue', 'M', 20, 3, 'pcs', 60, 'completed', '2025-01-09 13:05:05', '2025-01-09 13:05:05'),
(4, 1, 1, 'brown', 'S', 20, 3, 'pcs', 60, 'completed', '2025-01-09 13:05:05', '2025-01-09 13:05:05');

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

-- --------------------------------------------------------

--
-- Table structure for table `ratings`
--

CREATE TABLE `ratings` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `rating` float NOT NULL,
  `comment` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ratings`
--

INSERT INTO `ratings` (`id`, `user_id`, `product_id`, `rating`, `comment`, `createdAt`, `updatedAt`) VALUES
(1, 1, 1, 2, 'so so', '2025-01-08 09:35:20', '2025-01-08 09:35:20');

-- --------------------------------------------------------

--
-- Table structure for table `reports`
--

CREATE TABLE `reports` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `report_type` enum('false-information','racism','hate-speech') DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reports`
--

INSERT INTO `reports` (`id`, `title`, `description`, `report_type`, `createdAt`, `updatedAt`) VALUES
(1, 'not correct information', 'a bad info', 'false-information', '2025-01-08 08:05:30', '2025-01-08 08:05:30');

-- --------------------------------------------------------

--
-- Table structure for table `stocks`
--

CREATE TABLE `stocks` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `color` varchar(255) NOT NULL,
  `size` varchar(255) NOT NULL,
  `quantity_unit` varchar(255) NOT NULL DEFAULT 'pcs',
  `quantity_in_stock` int(11) NOT NULL DEFAULT 10,
  `stock_alert` int(11) NOT NULL DEFAULT 10,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `stocks`
--

INSERT INTO `stocks` (`id`, `product_id`, `color`, `size`, `quantity_unit`, `quantity_in_stock`, `stock_alert`, `createdAt`, `updatedAt`) VALUES
(1, 1, 'brown', 'S', 'pcs', 5, 5, '2025-01-07 11:32:19', '2025-01-09 13:05:05'),
(2, 1, 'blue', 'M', 'pcs', 9, 5, '2025-01-07 11:32:19', '2025-01-09 13:05:05'),
(3, 2, 'red', 'S', 'pcs', 10, 5, '2025-01-09 13:58:23', '2025-01-09 13:58:23'),
(4, 2, 'blue', 'M', 'pcs', 10, 5, '2025-01-09 13:58:24', '2025-01-09 13:58:24'),
(5, 4, 'red', 'L', 'pcs', 10, 5, '2025-01-09 13:59:26', '2025-01-09 13:59:26'),
(6, 6, 'red', 'L', 'pcs', 10, 5, '2025-01-09 14:01:17', '2025-01-09 14:01:17'),
(7, 6, 'blue', 'XL', 'pcs', 10, 5, '2025-01-09 14:01:17', '2025-01-09 14:01:17');

-- --------------------------------------------------------

--
-- Table structure for table `tags`
--

CREATE TABLE `tags` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tags`
--

INSERT INTO `tags` (`id`, `name`, `createdAt`, `updatedAt`) VALUES
(1, 'Travel', '2025-01-08 08:31:04', '2025-01-08 08:31:04');

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
  `total_seats` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`total_seats`)),
  `tickets_sold_count` int(11) DEFAULT 0,
  `tickets_sold_count_sum_price` decimal(10,2) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `ticket_alert` int(11) NOT NULL DEFAULT 10
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tickets`
--

INSERT INTO `tickets` (`id`, `event_id`, `waves`, `amount_issued`, `issued_at`, `price`, `section`, `total_seats`, `tickets_sold_count`, `tickets_sold_count_sum_price`, `createdAt`, `updatedAt`, `ticket_alert`) VALUES
(1, 1, 'Wave 1', 400, '2025-01-05 07:00:00', '[{\"color\":\"blue\",\"price\":50},{\"color\":\"red\",\"price\":70}]', '[{\"color\":\"blue\",\"section\":[\"Zone-A\"]},{\"color\":\"red\",\"section\":[\"Zone-B\",\"Zone-C\"]}]', NULL, 1, 50.00, '2025-01-08 11:31:07', '2025-01-08 12:01:06', 0),
(2, 1, 'Wave 2', 400, '2025-01-08 07:00:00', '[{\"color\":\"blue\",\"price\":50},{\"color\":\"red\",\"price\":70}]', '[{\"color\":\"blue\",\"section\":[\"Zone-A\"]},{\"color\":\"red\",\"section\":[\"Zone-B\",\"Zone-C\"]}]', NULL, 0, NULL, '2025-01-08 11:32:02', '2025-01-08 11:32:02', 0),
(4, 2, NULL, 20, '2025-01-08 12:52:31', '[{\"color\":\"blue\",\"price\":110},{\"color\":\"red\",\"price\":70}]', '[{\"color\":\"blue\",\"section\":[\"A\",\"B\"]},{\"color\":\"red\",\"section\":[\"B\"]}]', '[{\"section\":\"A\",\"seats\":5},{\"section\":\"B\",\"seats\":12},{\"section\":\"B\",\"seats\":3}]', 1, 110.00, '2025-01-08 12:52:31', '2025-01-08 14:05:02', 0),
(5, 3, 'Wave one', 200, '2025-01-08 07:00:00', '[{\"color\":\"blue\",\"price\":50},{\"color\":\"red\",\"price\":70}]', '[{\"color\":\"blue\",\"section\":[\"Zone-A\"],\"quantity\":100},{\"color\":\"red\",\"section\":[\"Zone-B\",\"Zone-C\"],\"quantity\":100}]', NULL, 21, 1070.00, '2025-01-08 14:29:25', '2025-01-08 15:01:32', 180);

-- --------------------------------------------------------

--
-- Table structure for table `ticket_solds`
--

CREATE TABLE `ticket_solds` (
  `id` int(11) NOT NULL,
  `buyer_id` int(11) NOT NULL,
  `ticket_id` int(11) NOT NULL,
  `section` varchar(255) DEFAULT NULL,
  `seat` int(11) DEFAULT NULL,
  `color` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `status` enum('pending','reserved','sold','canceled','used') DEFAULT 'pending',
  `reserved_at` datetime DEFAULT NULL,
  `qr_code` text DEFAULT NULL,
  `qr_code_token` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ticket_solds`
--

INSERT INTO `ticket_solds` (`id`, `buyer_id`, `ticket_id`, `section`, `seat`, `color`, `price`, `status`, `reserved_at`, `qr_code`, `qr_code_token`, `createdAt`, `updatedAt`) VALUES
(1, 1, 1, 'Zone-A', NULL, 'blue', 50.00, 'sold', '2025-01-08 11:59:42', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAYAAAB1PADUAAAAAklEQVR4AewaftIAAATmSURBVO3BQY4kRxIEQdNA/f/LunP0ywaQSK9mD2ki+EeqlpxULTqpWnRSteikatFJ1aKTqkUnVYtOqhadVC06qVp0UrXopGrRSdWik6pFJ1WLPnkJyE9ScwNkUvMEkEnNDZBJzQTkRs0NkJ+k5o2TqkUnVYtOqhZ9skzNJiA3QG6APKFmAvKGmgnIBGRSc6NmE5BNJ1WLTqoWnVQt+uTLgDyh5gk1N0AmNTdAbtRMQG6A3Kh5A8gTar7ppGrRSdWik6pFn/zHAXkCyKTmRs0EZAIyqfmbnVQtOqladFK16JO/HJAbNU+omYBMaur/O6ladFK16KRq0Sdfpuab1DwBZFIzAZnUvAHkm9T8JidVi06qFp1ULfpkGZCfBGRSMwGZ1ExAJjUTkEnNBGRSc6NmAvIEkN/spGrRSdWik6pF+Ef+xYBMam6A3KiZgLyh5t/kpGrRSdWik6pFn7wEZFIzAZnUTEAmNROQSc03qZmATEAmNROQnwRkUnMDZFKz6aRq0UnVopOqRZ+8pOab1DwBZFLzm6h5AsiNmjeATGreOKladFK16KRq0ScvAXkCyKRmAvKGmjeATGqeUPMEkEnNE0CeUDMB2XRSteikatFJ1aJPfjk1N0AmIE+omdTcAJnUTEAmNROQN9S8AWRSs+mkatFJ1aKTqkWfLFMzAZnUPAHkRs0EZFJzA2RSc6NmAvKEmn+SmgnIpOaNk6pFJ1WLTqoWfbIMyA2QGzWbgDwBZFIzAfnNgNyomdRsOqladFK16KRq0ScvqZmATGomIE8AmdRMQG7U3ACZ1ExAnlDzBJAngGwCMql546Rq0UnVopOqRfhHFgG5UTMBuVFzA+QJNROQJ9RMQJ5QcwPkDTUTkBs1m06qFp1ULTqpWoR/ZBGQGzVPAJnUPAHkRs0NkBs1E5AbNROQN9Q8AeRGzRsnVYtOqhadVC365IcBmdTcqJmATGpu1ExAJiCTmjfUTED+S06qFp1ULTqpWvTJS0AmNROQGyCTmgnIDZBJzRNqJiCTmm9SMwF5AsiNmp90UrXopGrRSdWiT15SMwGZ1ExAboBMaiYgk5oJyBNAJjU3QCY1E5AngLyhZgLyhJpNJ1WLTqoWnVQt+uQlIJOaCcik5gkgN0AmNTdA3lAzAfknAZnUPAFkUvPGSdWik6pFJ1WLPnlJzY2aN9TcALkBMqm5ATKpmYB8k5ongExAbtRMQDadVC06qVp0UrXok5eA/CQ1k5oJyA2QGzUTkCfUTEAmIE8AmdTcqJmA/KSTqkUnVYtOqhZ9skzNJiBPqJmATGomIBOQGzUTkAnIpGYC8oSaN9RMQL7ppGrRSdWik6pFn3wZkCfUPAHkCSA3aiYgE5AngExqJiATkDeATGomNROQTSdVi06qFp1ULfrkL6dmAjKpeQLIE2omIE+oeQLIjZobIJOaTSdVi06qFp1ULfrkLwfkCSBvqJmATGp+EyCTmgnIpOaNk6pFJ1WLTqoWffJlar5JzQRkAnKjZgIyqblRMwG5UTMBuVEzqbkBMqmZgExqNp1ULTqpWnRStQj/yAtAfpKaCcik5gbIG2omIDdqboBMam6AfJOaN06qFp1ULTqpWoR/pGrJSdWik6pFJ1WLTqoWnVQtOqladFK16KRq0UnVopOqRSdVi06qFp1ULTqpWnRSteh/9O4peXosoaAAAAAASUVORK5CYII=', '4d361924647a9e36fb97b497b74e905b', '2025-01-08 11:59:42', '2025-01-08 12:01:06'),
(2, 1, 1, 'Zone-A', NULL, 'blue', 50.00, 'reserved', '2025-01-08 11:59:42', NULL, NULL, '2025-01-08 11:59:42', '2025-01-08 11:59:42'),
(3, 1, 1, 'Zone-B', NULL, 'red', 70.00, 'reserved', '2025-01-08 11:59:43', NULL, NULL, '2025-01-08 11:59:43', '2025-01-08 11:59:43'),
(4, 1, 4, 'A', 1, 'blue', 110.00, 'sold', '2025-01-08 14:03:32', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAYAAAB1PADUAAAAAklEQVR4AewaftIAAAToSURBVO3BQY4bSRAEwfAC//9lXx3zVECjkyPNIszwj1QtOaladFK16KRq0UnVopOqRSdVi06qFp1ULTqpWnRSteikatFJ1aKTqkUnVYtOqhZ98hKQn6RmAjKpuQFyo+YGyI2aCcgTaiYgP0nNGydVi06qFp1ULfpkmZpNQJ4AcqPmDTUTkBs1m9RsArLppGrRSdWik6pFn3wZkCfUvKFmAnIDZFJzA+QGyBNq3gDyhJpvOqladFK16KRq0Se/nJo31DyhZgIyqbkB8n92UrXopGrRSdWiT345IJOaSc0E5EbNBOQJIJOaSc0EZFLzm51ULTqpWnRSteiTL1PzTWomIJOaGzU3aiYgm9S8oeZfclK16KRq0UnVok+WAflJQCY1E5BJzQRkUjMBmdRMQCY1E5BJzQRkUnMD5F92UrXopGrRSdUi/CP/Y0Bu1ExAJjUTkG9S85udVC06qVp0UrXok5eATGpugHyTmknNJjU3QCY1E5AbIJOaGyCTmgnIE2reOKladFK16KRq0SfLgExqJjUTkEnNDZAbIJOaGyBvAJnUTEAmNW8AeUPNN51ULTqpWnRSteiTl9RMQG6APAFkUnMDZAIyqXkDyA2QN4BMaiY1N0AmNT/ppGrRSdWik6pFn/zj1DyhZgIyAZnUTEBu1ExAJjVPALkB8oSaJ4BMat44qVp0UrXopGrRJy8BmdRMQG7U3AB5Qs2kZgIyAXkCyA2Qb1LzBpBvOqladFK16KRq0SfLgGxSMwG5AXKj5gbIBGRSMwG5UTMBeULNDZBJzQTkJ51ULTqpWnRSteiTl9RMQCY1E5AbIDdqJiDfpOYJNROQGzUTkAnIpOZfdlK16KRq0UnVok9eAjKpmYBMaiYgN2omIJOaN4BMam6ATGomIJOaCciNmgnIBOQNNd90UrXopGrRSdWiT15Sc6NmAjKpuQEyqbkBsgnIpGYCcgPkCSCTmgnIpGYCMqn5SSdVi06qFp1ULfrkJSCTmgnIpOYJNT8JyBtqboBMQJ5QMwGZ1PxNJ1WLTqoWnVQtwj/yApBNaiYgk5o3gExqngAyqZmA3Kh5AsikZgJyo+YGyKTmjZOqRSdVi06qFn3yZWomIJOaCcik5gbIE2omIJOaCcik5gk1N0AmNTdAngByo2bTSdWik6pFJ1WLPvnLgExqJiCTmjeATGomIDdAbtRMQJ4A8oaaCcgNkEnNGydVi06qFp1ULcI/8osBmdRsAjKpuQEyqZmA3Kh5Asik5gbIpGbTSdWik6pFJ1WLPnkJyE9S8wSQJ9RsAjKpmYDcAJnU3AD5m06qFp1ULTqpWvTJMjWbgGxSMwF5Asik5pvUPKHmBsgEZFLzxknVopOqRSdViz75MiBPqPmbgNyo+SYg36Tmm06qFp1ULTqpWvTJ/wyQSc2Nmp8EZFIzAZnUPAHkRs03nVQtOqladFK16JNfTs0NkEnNBGRSMwG5UXOjZgIyAZnUTECeUHMD5EbNGydVi06qFp1ULfrky9T8JCCTmgnIDZBJzQ2QGyBPANkEZFIzAdl0UrXopGrRSdWiT5YB+UlAJjWbgNyomYBMaiYgN2pugNwAmdTcqNl0UrXopGrRSdUi/CNVS06qFp1ULTqpWnRSteikatFJ1aKTqkUnVYtOqhadVC06qVp0UrXopGrRSdWik6pF/wGrUSiD9TP8TAAAAABJRU5ErkJggg==', '1f0c72911ed3a5973623198975c58fff', '2025-01-08 14:03:32', '2025-01-08 14:05:02'),
(5, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'sold', '2025-01-08 14:48:27', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAYAAAB1PADUAAAAAklEQVR4AewaftIAAATXSURBVO3BQY4cSRIEQdNA/f/Lun30UwCJ9OohuSaCP1K15KRq0UnVopOqRSdVi06qFp1ULTqpWnRSteikatFJ1aKTqkUnVYtOqhadVC06qVr0yUtAfpOaJ4B8k5ongExqboD8JjVvnFQtOqladFK16JNlajYB2aRmAvIGkCfUvKFmE5BNJ1WLTqoWnVQt+uTLgDyh5gkgk5pJzQRkUjMBmdRMQCY1N0AmIJOaN4A8oeabTqoWnVQtOqla9Mk/DsikZgIyqZmAPAHkRs2/7KRq0UnVopOqRZ/8nwHyhJoJyATkRs0E5EbN3+ykatFJ1aKTqkWffJma/5KaGyBPqHkCyKRmAvKGmj/JSdWik6pFJ1WLPlkG5E8CZFLzBJBJzQRkUvNNQP5kJ1WLTqoWnVQt+uQlNX8TIJOa3wTkCTV/k5OqRSdVi06qFn3yEpBJzQRkk5pJzTepeQLIjZoJyA2QTWq+6aRq0UnVopOqRZ98mZongExqJiA3aiY1E5AbIE+oeQLIpOYJNROQGzU3QCY1b5xULTqpWnRStQh/5A8G5EbNBGRSMwH5JjUTkEnNG0AmNU8AmdRsOqladFK16KRqEf7IC0Bu1NwAuVEzAZnUbAIyqZmATGqeADKpeQPIpOYJIJOaN06qFp1ULTqpWvTJS2omIBOQGzU3QJ4AMqm5ATKpmYA8AeRGzQ2QSc0EZFIzAXlCzaaTqkUnVYtOqhbhj7wA5Ak1E5BJzRtA3lBzA+RGzQ2QGzUTkEnNBORGzQ2QSc0bJ1WLTqoWnVQtwh/5IiCb1ExAJjU3QCY13wRkUnMDZFJzA2RScwNkUrPppGrRSdWik6pFn7wEZFJzo+YGyKRmk5ongExqJiCTmknNDZBJzQ2QGyCTmknNN51ULTqpWnRStQh/5D8EZFIzAZnUTECeUPNNQCY1m4BMam6A3KjZdFK16KRq0UnVIvyRF4BMar4JyKRmAjKpmYBMaiYgT6i5AbJJzQRkUnMD5EbNGydVi06qFp1ULfrky4DcqLkBMql5Q80E5DepeQPIDZAbNd90UrXopGrRSdUi/JEXgExqboA8oWYCMqnZBGRSMwG5UfMEkEnNE0AmNTdAJjWbTqoWnVQtOqla9MkvUzMBmdRMQJ4AcqPmRs0E5EbNBGRS8wSQN4DcqPmmk6pFJ1WLTqoW4Y/8xYBMaiYgk5oJyKTmCSCTmgnIE2qeADKpuQFyo+aNk6pFJ1WLTqoWffISkN+kZlLzBJA3gExqbtRMQJ4AMql5Q803nVQtOqladFK16JNlajYBuQHyhpobIG8AmdRMQG7UPAFkUjMBmdRsOqladFK16KRq0SdfBuQJNZvUTEAmIJOaSc0EZAKyCcgbaiYgv+mkatFJ1aKTqkWf/GPUbAIyqbkBMqm5UfMEkEnNBGRSMwGZgExq3jipWnRSteikatEn/xggbwCZ1ExAbtRMQG7UTEBu1ExAJjVPqNl0UrXopGrRSdWiT75MzTepeQLIjZobNROQJ9RMQG7UPAFkUvObTqoWnVQtOqla9MkyIL8JyBNqngDyBJAbIJOaJ4DcqJmATGq+6aRq0UnVopOqRfgjVUtOqhadVC06qVp0UrXopGrRSdWik6pFJ1WLTqoWnVQtOqladFK16KRq0UnVopOqRf8DMsU8Od6hNuMAAAAASUVORK5CYII=', 'da344c0dd14351ead4db7b2811ad870d', '2025-01-08 14:48:27', '2025-01-08 14:52:25'),
(6, 1, 5, 'Zone-B', NULL, 'red', 70.00, 'sold', '2025-01-08 14:48:27', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAYAAAB1PADUAAAAAklEQVR4AewaftIAAATKSURBVO3BQY4cSRIEQdNA/f/Lun30UwCJ9OohuSaCP1K15KRq0UnVopOqRSdVi06qFp1ULTqpWnRSteikatFJ1aKTqkUnVYtOqhadVC06qVr0yUtAfpOaGyBPqJmAPKHmm4D8JjVvnFQtOqladFK16JNlajYBeULNDZBNQJ5QMwGZ1Nyo2QRk00nVopOqRSdViz75MiBPqHkCyKRmAvKGmgnIpGYCMqmZgExq3gDyhJpvOqladFK16KRq0Sf/GCA3am7UTECeUDMBmdRMQCY1f7OTqkUnVYtOqhZ98o9RcwPkRs2kZgIyAZnUTGr+n5xULTqpWnRSteiTL1PzJ1PzhJobIDdqJjVvqPmTnFQtOqladFK16JNlQP4kQCY1E5BJzQRkUjMBmdRMQG6ATGpugPzJTqoWnVQtOqla9MlLav4kQCY1E5BJzTepmYA8oeZvclK16KRq0UnVok9eAjKpmYBsUjOpmYBMQN5Q8waQSc0TQDap+aaTqkUnVYtOqhZ98svUTEBu1ExAJjVPqLkB8oSaN4BMaiY1E5An1ExAJjWbTqoWnVQtOqla9MkvA/IEkEnNBOS/BORGzY2aCcikZlLzBJBJzQRkUvPGSdWik6pFJ1WLPlkG5EbNJjUTkE1qJiCTmhsgT6iZgDyhZlJzo2bTSdWik6pFJ1WLPlmmZgLyBJAbNROQJ4BMaiY1E5AngExqngAyqXkDyI2aTSdVi06qFp1ULcIf+SIgN2qeAPKEmgnIjZobIDdqJiCTmhsgb6i5ATKp2XRSteikatFJ1aJPlgGZ1ExAJiBvqLkBMqmZgDyh5gbIE0AmNW8AuVHzTSdVi06qFp1ULfrky4BMaiYgk5obIBOQbwIyqZmATGpugExqJiBvqLkBMqnZdFK16KRq0UnVIvyRRUAmNROQGzUTkEnN3wTIpGYTkE1q3jipWnRSteikatEnLwGZ1ExAngAyqbkBMql5Asgbam7UTEBu1Lyh5gkgm06qFp1ULTqpWoQ/8gKQSc0NkEnNBGSTmieAPKFmAjKpeQLIpGYCMqmZgDyhZtNJ1aKTqkUnVYs++WVqbtTcAHkCyKRmAnKjZgJyo2YC8oSaCcikZgJyo+Y3nVQtOqladFK1CH/kBSCTmgnIjZobIJOaCcgmNROQTWomIJvUTEAmNd90UrXopGrRSdUi/JG/GJBJzQTkRs03AXlCzRNAJjU3QCY1m06qFp1ULTqpWvTJS0B+k5pJzQTkRs0EZFJzA+Q3AZnU3AD5L51ULTqpWnRSteiTZWo2AbkBcqNmAvIEkEnNJiA3ap5Q8186qVp0UrXopGrRJ18G5Ak1m4C8oWYCMqmZgExqngCyCciNmk0nVYtOqhadVC365B+j5gbIpOYGyA2QSc0EZFJzo+YNIJOaCcg3nVQtOqladFK16JN/DJBJzaTmBsikZgIyqZmA3ACZ1ExA3lAzAflNJ1WLTqoWnVQt+uTL1HyTmhsgT6i5UTMBmdRsUvOGmt90UrXopGrRSdWiT5YB+U1A3lAzAZnUTEBugNyouVEzAXlDzQRkUrPppGrRSdWik6pF+CNVS06qFp1ULTqpWnRSteikatFJ1aKTqkUnVYtOqhadVC06qVp0UrXopGrRSdWik6pF/wNdDjY2P+RQtgAAAABJRU5ErkJggg==', '0838b362af0fe2e60cf0de190f1b63d3', '2025-01-08 14:48:27', '2025-01-08 14:52:25'),
(7, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'sold', '2025-01-08 14:49:43', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAYAAAB1PADUAAAAAklEQVR4AewaftIAAATwSURBVO3BQQ4bSRIEwfAC//9lXx3zVECjk9yREGb4R6qWnFQtOqladFK16KRq0UnVopOqRSdVi06qFp1ULTqpWnRSteikatFJ1aKTqkUnVYs+eQnIL6m5AXKj5gkgk5pfAvJLat44qVp0UrXopGrRJ8vUbAJyA2RScwNkUjMBmdS8AeRGzRNqNgHZdFK16KRq0UnVok++DMgTap5QMwGZ1ExqbtTcAJnUTECeADKpeQLIE2q+6aRq0UnVopOqRZ/844C8oWZSMwG5UTMBmdT8S06qFp1ULTqpWvTJXw7IG2omIG+omYDcAJnU/M1OqhadVC06qVr0yZep+SY1N0BugExqJiBPAHlCzRtq/ktOqhadVC06qVr0yTIgvwRkUnOjZgLyhJoJyKRmAjKpmYBMam6A/JedVC06qVp0UrUI/8g/DMiNmieATGpugNyo+ZecVC06qVp0UrXok5eATGomIJOaCcikZgIyqXlDzRtqJiA3ar4JyKTmBsikZtNJ1aKTqkUnVYs+WQZkk5obIJOaGyCTmgnIpGYCcqPmBsikZgJyo2ZSMwG5UTMBmdS8cVK16KRq0UnVok+WqZmATECeAHKjZgJyo+ZGzQTkDSCTmhs1E5AJyKRmUjMB+aWTqkUnVYtOqhZ98mNqJiA3at5QMwGZ1ExAbtRMQG7UbFJzA2RSc6Nm00nVopOqRSdViz5ZBmQTkEnNBOQGyA2QSc0EZAIyqZmA3KiZgExqboBMat4AMql546Rq0UnVopOqRZ8sUzMBmYDcAJnUTECeUDMBmdR8k5pfUnMD5JtOqhadVC06qVqEf2QRkCfU3ACZ1ExAJjVPALlR8waQSc0NkBs1TwB5Qs0bJ1WLTqoWnVQtwj/yApAbNROQSc0TQCY1E5BJzSYgk5oJyKRmAjKpeQLIpGYCMqn5pZOqRSdVi06qFn3ykpoJyBNAJjUTkEnNE0AmNROQSc2NmgnIDZBJzQTkX3JSteikatFJ1aJPlqmZgExqJiA3aiYgk5pJzQ2QSc0EZFIzAXlCzX8ZkEnNGydVi06qFp1ULfrkJSCTmhsgN0Bu1ExAnlBzo2YC8gaQSc2NmgnIE2omIJOabzqpWnRSteikatEnL6mZgNyomYDcqLlRcwPkCSA3aiYgb6i5UTMBuQEyqZmATGo2nVQtOqladFK16JOXgExq3lAzAZnU3AB5AsikZgIyAdkE5A0gT6iZgExq3jipWnRSteikatEnL6l5Q82NmhsgN2pu1Lyh5gkgN2qeADKp+X86qVp0UrXopGrRJy8B+SU1k5ongDyh5gbIpGYC8gaQSc0NkBs133RSteikatFJ1aJPlqnZBOSb1DwBZFLzhJoJyI2aJ9TcAJnUbDqpWnRSteikatEnXwbkCTVPAJnUTEA2qbkB8gaQXwIyqXnjpGrRSdWik6pFn/zl1ExAngByo2YCMqmZ1NwAeULNDZAn1HzTSdWik6pFJ1WLPvnLAZnUTEA2qbkB8jcBMql546Rq0UnVopOqRZ98mZpvUjMBeULNL6mZgExqboDcAJnUTEAmNZtOqhadVC06qVr0yTIgvwRkUnMDZAIyqZmAPKFmArJJzQTkDSCTmjdOqhadVC06qVqEf6RqyUnVopOqRSdVi06qFp1ULTqpWnRSteikatFJ1aKTqkUnVYtOqhadVC06qVp0UrXof67aTEqV+4CSAAAAAElFTkSuQmCC', '09a8405f2327c5a66bac59853581e5ab', '2025-01-08 14:49:43', '2025-01-08 14:52:25'),
(8, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'sold', '2025-01-08 14:49:43', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAYAAAB1PADUAAAAAklEQVR4AewaftIAAAT2SURBVO3BQY4jRxAEwfAC//9l1xzzVECjk6PVKszwR6qWnFQtOqladFK16KRq0UnVopOqRSdVi06qFp1ULTqpWnRSteikatFJ1aKTqkUnVYs+eQnIb1LzBJAbNROQJ9TcAHlCzQTkN6l546Rq0UnVopOqRZ8sU7MJyBNAngDyBpAn1ExAnlCzCcimk6pFJ1WLTqoWffJlQJ5Q8wSQSc0NkEnNBGRSMwGZ1NwAmYBsAvKEmm86qVp0UrXopGrRJ385IE+omYA8AeRGzQTkb3JSteikatFJ1aJP/mfUPKFmAjIBmdTcAJnU/E1OqhadVC06qVr0yZep+ZMAmdQ8oeYNNROQSc0Tav4kJ1WLTqoWnVQt+mQZkD+ZmgnIpGYCMqmZgExqJiCTmjeA/MlOqhadVC06qVr0yUtq/iRAJjUTkH8TkCfU/JecVC06qVp0UrXok5eATGomIJvUTGomIE+ouVHzBJAbNROQGyCb1HzTSdWik6pFJ1WL8Ef+RUBu1GwCsknNBGRSMwGZ1NwAmdRMQG7UTEBu1LxxUrXopGrRSdWiT14CsknNBGRS8wSQbwIyqZmATGpugExqnlBzo+abTqoWnVQtOqla9MlLajYBmdTcAJnUTGqeADKpmYBMap4AcqPmBsgbQCY1m06qFp1ULTqpWvTJlwGZ1NyomYBsAnKjZgLyBJAbNTdAJjU3aiYgN2q+6aRq0UnVopOqRZ+8BORGzQRkUjMBmdRMQH6TmgnIBORGzQTkRs0EZFIzAZnU3AC5UfPGSdWik6pFJ1WL8EcWAblR8wSQSc0bQCY13wRkUjMBeULNBOQJNd90UrXopGrRSdUi/JEXgExqboBMaiYgk5ongLyhZgIyqZmATGr+ZEAmNZtOqhadVC06qVr0yUtqJiCTmjeA3Ki5UXMD5EbNjZoJyKRmAnKj5gbIpGYCcqPmm06qFp1ULTqpWvTJS0CeUPOEmjeA3KiZgDyhZlIzAblRMwG5UTMBmdRMQG6ATGreOKladFK16KRq0SfL1NwAmdRMaiYgk5oJyKRmAjKpmYBsAjKpeUPNjZoJyKRmAjKp2XRSteikatFJ1SL8kReATGomIJOaN4A8oeYJIJOaN4DcqLkB8oaaCciNmjdOqhadVC06qVr0yS8DMqm5AXKjZgJyA2RSM6mZgNyomYBMam6AbFIzAblRs+mkatFJ1aKTqkX4I/9hQCY1N0AmNW8AmdRMQJ5Q8wSQSc0TQCY1b5xULTqpWnRSteiTl4D8JjWTmifUTEAmNTdAboBsAjKpeQLIjZpNJ1WLTqoWnVQt+mSZmk1AboBMaiYgk5pJzQ2QSc0mIDdqngAyqZmAfNNJ1aKTqkUnVYs++TIgT6h5A8ik5gbIpGZSMwGZ1ExAJjVPAHlDzQTkN51ULTqpWnRSteiTv4yaTUAmNROQSc0EZFIzqZmATGreUDMBmYBMat44qVp0UrXopGrRJ/8zQCY1E5AbIJOaGzUTkEnNpGYC8oSaCciNmk0nVYtOqhadVC365MvUfJOaN4A8oWYCMql5AsiNmgnIE2omIN90UrXopGrRSdWiT5YB+U1AJjVvqJmATEAmNROQSc2k5gbIjZobIDdqvumkatFJ1aKTqkX4I1VLTqoWnVQtOqladFK16KRq0UnVopOqRSdVi06qFp1ULTqpWnRSteikatFJ1aKTqkX/AGQrWjZeAd80AAAAAElFTkSuQmCC', '24dd39bb9f8419c0429f77b489fcefcb', '2025-01-08 14:49:43', '2025-01-08 14:52:25'),
(9, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'sold', '2025-01-08 14:49:43', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAYAAAB1PADUAAAAAklEQVR4AewaftIAAATJSURBVO3BQY4cSRIEQdNA/f/Lun30UwCJ9OohuSaCP1K15KRq0UnVopOqRSdVi06qFp1ULTqpWnRSteikatFJ1aKTqkUnVYtOqhadVC06qVr0yUtAfpOaGyCTmieAPKFmAjKpmYBMam6A/CY1b5xULTqpWnRSteiTZWo2AXkDyI2aN4BMaiYgk5oJyKTmRs0mIJtOqhadVC06qVr0yZcBeULNE0Bu1LyhZgIyqXkCyCYgT6j5ppOqRSdVi06qFn3yj1HzhpoJyBNAbtRMQP4lJ1WLTqoWnVQt+uQfA+RGzQRkUjOpmYBMQCY1N0AmNf+Sk6pFJ1WLTqoWffJlan6Tmhsgb6h5AsikZpOaP8lJ1aKTqkUnVYs+WQbkTwJkUjMBuQEyqZmATGqeADKpuQHyJzupWnRSteikatEnL6n5kwD5m6i5UfM3OaladFK16KRqEf7IC0AmNROQTWqeADKp2QTkRs0E5EbNBGSTmm86qVp0UrXopGrRJy+pmYBMap4AMqm5AXKj5gbIG2pugNyoeULNBGRScwPkRs0bJ1WLTqoWnVQtwh9ZBOSb1LwB5DepeQLIpOYJIDdqvumkatFJ1aKTqkWf/DI1N0AmNU8AeULNBGRSMwGZ1NwAuVFzA+QJNTdAbtS8cVK16KRq0UnVok++TM0EZFJzA+RGzY2aCcgEZFIzAXkCyI2aCciNmieA3Kj5ppOqRSdVi06qFn3yEpBJzQTkCTU3QG7UbFIzAZmATGpugExqboC8oeYGyKTmjZOqRSdVi06qFuGP/MGA3Kh5A8ik5g0gN2omIE+oeQPIpGbTSdWik6pFJ1WL8EdeADKpmYA8oeYGyBtqngAyqZmATGomIDdqJiCTmhsgk5obIDdq3jipWnRSteikahH+yCIgk5ongLyh5gkgk5o3gNyoeQPIpGYCcqPmm06qFp1ULTqpWvTJS0AmNTdAJjU3aiYgk5obIDdqJiBPqJnU3AB5Q80E5EbNDZBJzRsnVYtOqhadVC365D8G5AbIpOYGyI2a/5KaCcik5g01N0AmNZtOqhadVC06qVr0yZcBmdRMQCY1m9S8oeYGyKRmAjKpuQFyo2ZS8waQSc0bJ1WLTqoWnVQt+uSXAXkCyKTmDSA3aiYgN2omIN8EZJOaTSdVi06qFp1ULcIf+YsBmdRMQG7UvAFkUvMEkEnNE0Bu1ExAbtS8cVK16KRq0UnVok9eAvKb1ExqJiCTmk1A3gDyBJBJzRtqvumkatFJ1aKTqkWfLFOzCcgNkBsgk5ongNyouQHyhpon1NwAmdRsOqladFK16KRq0SdfBuQJNZvUvKHmBsgTaiYgE5A3gPyXTqoWnVQtOqla9Mk/Rs0E5EbNDZBJzaTmCSCTmieATGomIJOaCcgEZFLzxknVopOqRSdViz75P6NmAvIEkDfU3AC5UTMBuQFyo2bTSdWik6pFJ1WLPvkyNd+k5kbNjZongExqboDcALlRMwF5Qs0E5JtOqhadVC06qVr0yTIgvwnIpGYCMqm5AfIGkEnNBGRScwNkUjMBmdRMQCY133RSteikatFJ1SL8kaolJ1WLTqoWnVQtOqladFK16KRq0UnVopOqRSdVi06qFp1ULTqpWnRSteikatFJ1aL/AZGAMTWzUZEXAAAAAElFTkSuQmCC', 'b66c4457a82f28fcaec28780f2442a9f', '2025-01-08 14:49:43', '2025-01-08 14:52:25'),
(10, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'sold', '2025-01-08 14:49:43', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAYAAAB1PADUAAAAAklEQVR4AewaftIAAATUSURBVO3BSY4jSRAEQdMA//9lnT76KYBEOquXMRH8JVVLTqoWnVQtOqladFK16KRq0UnVopOqRSdVi06qFp1ULTqpWnRSteikatFJ1aKTqkWfvATkJ6m5AXKj5gbIE2pugDyhZgLyk9S8cVK16KRq0UnVok+WqdkE5JuAvAFkUnOj5g01m4BsOqladFK16KRq0SdfBuQJNU8AuVEzAZnUTEAmNROQSc2NmgnIpOYNIE+o+aaTqkUnVYtOqhZ98o9R8wSQSc0E5AkgN2r+ZSdVi06qFp1ULfrkHwPkCTU3aiYgE5BJzQ2QGzV/s5OqRSdVi06qFn3yZWp+JzUTkAnIpOZGzQ2QGzWb1PxJTqoWnVQtOqla9MkyIL+TmgnIpGYCcgNkUjMBmdRMQG6ATGpugPzJTqoWnVQtOqla9MlLav5kav4kQJ5Q8zc5qVp0UrXopGrRJy8BmdRMQDapmdTcAHlDzRNAbtRMQG6AbFLzTSdVi06qFp1ULfrkN1MzAZnUbFJzA+QJNROQSc0EZFLzhJoJyKTmCSCTmjdOqhadVC06qVqEv+SLgExqboDcqJmAvKFmAvKGmgnIpGYCcqNmAvKEmgnIpGbTSdWik6pFJ1WLPnkJyKTmBsiNmp8E5EbNBGRS8wSQGzUTkL/JSdWik6pFJ1WLPvkyNROQGyBPqLkBMqmZgExqJiBPALlRMwGZgExq3gAyqfmmk6pFJ1WLTqoW4S/5QUAmNd8E5EbNE0Bu1NwAmdTcAHlCzRNAJjVvnFQtOqladFK16JOXgDyhZgIyqZmA3KiZgNyoeUPNE0AmNROQGzVPAJnUTEAmNZtOqhadVC06qVr0yZepeUPNDZBJzQRkAjKpuQEyqZmATGpugExqboBMaiYgf5KTqkUnVYtOqhZ9skzNDZBJzQ2QJ4DcqJmATGomNTdqJiCTmieATGomIJOaGyA/6aRq0UnVopOqRfhLXgDyhJoJyI2aCcgmNROQJ9TcAHlCzQRkUjMBmdQ8AWRS88ZJ1aKTqkUnVYs+WaZmAvKEmgnIE2pugGwCMqmZ1NwAmYBMaiYgk5obIDdqNp1ULTqpWnRSteiT30zNjZobIBOQGzVPqLkB8oaaGyCTmgnIpGZScwNkUvPGSdWik6pFJ1WLPvlhQCY1E5AbNTdqJiATkBs1E5AngNyomYA8AeQGyBNqNp1ULTqpWnRStQh/yV8MyBNq/iRAJjVPAJnU3AC5UfPGSdWik6pFJ1WLPnkJyE9SM6m5ATIBuVFzA+RGzQ2QJ4BMat5Q800nVYtOqhadVC36ZJmaTUBugHwTkEnNBOQGyBtqNgGZ1Gw6qVp0UrXopGrRJ18G5Ak1b6iZgLyhZgJyA+RGzQRkAvIGkN/ppGrRSdWik6pFn/zPqLkBcqPmDSA3ajYBuQEyqXnjpGrRSdWik6pFn/zj1NwAmdTcAHlCzY2aCcgbaiY1E5BJzaaTqkUnVYtOqhZ98mVqvknNDZBJzaRmAvKGmieA3KiZgExqJiCTmp90UrXopGrRSdWiT5YB+UlA3gDyhpoJyKRmUvOGmgnIpGYCMqn5ppOqRSdVi06qFuEvqVpyUrXopGrRSdWik6pFJ1WLTqoWnVQtOqladFK16KRq0UnVopOqRSdVi06qFp1ULfoPlMIySdJHzq0AAAAASUVORK5CYII=', 'c041ab08cc2e333a7ac76ba280e47e77', '2025-01-08 14:49:43', '2025-01-08 14:52:25'),
(11, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'sold', '2025-01-08 14:49:43', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAYAAAB1PADUAAAAAklEQVR4AewaftIAAATQSURBVO3BQY4cSRIEQdNA/f/Lun30UwCJ9GKTsyaCP1K15KRq0UnVopOqRSdVi06qFp1ULTqpWnRSteikatFJ1aKTqkUnVYtOqhadVC06qVr0yUtA/iQ1TwD5JjU3QJ5QMwH5k9S8cVK16KRq0UnVok+WqdkEZJOaGyBPAHlCzRtqNgHZdFK16KRq0UnVok++DMgTap4AMqnZpGYCMqm5ATIBuVHzBJAn1HzTSdWik6pFJ1WLPvmPAXIDZFIzqZmAPAHkRs1/2UnVopOqRSdViz75j1PzhpoJyARkUnMD5EbNv+ykatFJ1aKTqkWffJma3wTkCTU3am6A3KiZgLyh5m9yUrXopGrRSdWiT5YB+U1qJiCTmgnIDZBJzQRkUjMB2QTkb3ZSteikatFJ1aJPXlLzNwFyA2RS801q3lDzLzmpWnRSteikahH+yAtAJjUTkE1qboBMaiYgN2qeAPKEmieAbFLzTSdVi06qFp1ULfrkJTUTkEnNBGRSMwGZ1ExAJjVPqJmATECeUDMBmdRMQG7U3KiZgNyomYDcqHnjpGrRSdWik6pFnyxT8wSQGyCbgGwCMqmZgExqboBMam7U3ACZ1HzTSdWik6pFJ1WLPnkJyBtqJiCTmgnIjZon1ExAJjUTkEnNJjUTkEnNBGRSM6m5ATKpeeOkatFJ1aKTqkWf/OWA3ADZpGYC8gSQJ4DcqLlRMwG5UTOp2XRSteikatFJ1SL8kS8C8oaaCciNmieATGpugNyouQEyqbkB8oSaCcikZgIyqXnjpGrRSdWik6pF+CO/CMikZgJyo2YC8oSaTUAmNZuATGqeADKp2XRSteikatFJ1SL8kUVAJjU3QG7UTEBu1ExAJjVPAJnUTEAmNTdAbtRMQCY1E5BJzW86qVp0UrXopGoR/sgXAblRcwNkUjMB2aTmDSCTmhsgk5obIJOaCcgTajadVC06qVp0UrUIf+QFIN+kZgIyqZmATGqeAPKEmhsgN2omIDdqJiCTmieATGreOKladFK16KRq0SfL1NwAmdRMQCYgk5obNTdAJjWbgNyomYBMam6APAHkRs2mk6pFJ1WLTqoWffJlQJ5QcwPkCTWTmgnIjZoJyI2aGyCTmifUTEAmIJOaCcg3nVQtOqladFK16JMvU/MEkDfU3AC5UTMBuQHyhJoJyCY1E5BJzTedVC06qVp0UrUIf+QfBmSTmm8CcqPmCSA3aiYgN2reOKladFK16KRq0ScvAfmT1ExqboDcqHkCyKRmArIJyKTmDTXfdFK16KRq0UnVok+WqdkE5AbIjZoJyARkUjMBmdRMQCY1TwC5UfOEmhsgk5pNJ1WLTqoWnVQt+uTLgDyh5k9Sc6NmAnIDZFLzBJA3gPymk6pFJ1WLTqoWffJ/Rs0TQCY1TwB5Q80TQCY1E5AJyKTmjZOqRSdVi06qFn1SV2omIG+oeQLIN6nZdFK16KRq0UnVok++TM03qbkBMqmZgExq3lBzA+QJNROQSc0E5DedVC06qVp0UrXok2VA/iQgN2omIJvUTEAmNZOaGyATkEnNBGRSMwGZ1HzTSdWik6pFJ1WL8EeqlpxULTqpWnRSteikatFJ1aKTqkUnVYtOqhadVC06qVp0UrXopGrRSdWik6pFJ1WL/gdm/js0XOgKTwAAAABJRU5ErkJggg==', 'd17f82e5ca3b37e23360efb387c3ce60', '2025-01-08 14:49:43', '2025-01-08 14:52:25'),
(12, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'sold', '2025-01-08 14:49:44', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAYAAAB1PADUAAAAAklEQVR4AewaftIAAATOSURBVO3BSY4jSRAEQdMA//9lnT76KYBEOquXMRH8JVVLTqoWnVQtOqladFK16KRq0UnVopOqRSdVi06qFp1ULTqpWnRSteikatFJ1aKTqkWfvATkJ6m5ATKpmYBsUnMDZFIzAZnUTEB+kpo3TqoWnVQtOqla9MkyNZuAfJOaCcgTQCY1T6h5Qs0mIJtOqhadVC06qVr0yZcBeULNE0AmNROQSc0E5EbNBGRS8waQSc0TQJ5Q800nVYtOqhadVC365B8DZFIzAZnU3AB5AsikZgIyqfmXnFQtOqladFK16JN/HJA31ExAJiA3QCY1/7KTqkUnVYtOqhZ98mVqfpKaJ4BMam7UPAFkAnKj5gk1f5KTqkUnVYtOqhZ9sgzInwTIpOYJIJOaCcik5kbNBOQJIH+yk6pFJ1WLTqoWffKSmr8JkEnNJiBPqLlR8zc5qVp0UrXopGrRJy8BmdRMQDapmdRMQG7UPKHmDTVvANmk5ptOqhadVC06qVr0yQ9T801qngDyhpo3gExqJjU3QCY1N0Bu1LxxUrXopGrRSdUi/CWLgNyomYBsUvMEkG9SMwGZ1ExAJjUTkCfU/KSTqkUnVYtOqhZ98hKQSc0NkCfUPAFkUjMBmdRMQCY1E5BJzQ2QSc3vBGRSs+mkatFJ1aKTqkWfvKTmCTVPAJnUfJOaCcgTQCY1N0CeUPMEkBsgk5o3TqoWnVQtOqla9MlLQG7UTEBu1ExqboBMap4AMqmZ1ExAJiCTmgnIpOZGzQ2QJ9TcANl0UrXopGrRSdWiT5apmYC8AeRGzU9ScwNkUjMBmdRMQG7UTECeADKp2XRSteikatFJ1SL8JX8RIE+ouQEyqZmATGomIJOaJ4DcqJmAPKHmJ51ULTqpWnRStQh/yQtAnlAzAZnUTECeUDMBmdRMQCY1vxOQJ9TcALlRs+mkatFJ1aKTqkWfLFNzA2RSMwGZ1Lyh5gkgT6i5ATKpeULNDZAbNTdAJjVvnFQtOqladFK16JMfpmYCcgNkUvMEkD8JkBs1E5BJzaRmAnIDZFKz6aRq0UnVopOqRZ/8MCA3am6ATGpu1ExAnlAzAXlDzRNqboBMam7UfNNJ1aKTqkUnVYs++TIgbwCZ1ExANqmZgLyh5gbIJiBPqNl0UrXopGrRSdUi/CV/MSBvqHkDyKRmAvKEmieA3KiZgNyoeeOkatFJ1aKTqkWfvATkJ6mZ1ExAJjU3QCY1N0BugExqboDcAJnU3KiZgExqvumkatFJ1aKTqkWfLFOzCcgNkEnNDZAngExqngAyqXlCzRtqJiCTmk0nVYtOqhadVC365MuAPKFmE5BJzRNqJiA3aiY1TwB5A8iNmgnIpOaNk6pFJ1WLTqoWffI/A+RGzQTkDSCTmknNDZAbNU8AmdRsOqladFK16KRq0Sf/M2pugExqJiCTmgnIG0AmNTdAJjW/00nVopOqRSdViz75MjXfpGYCMqmZgDwBZFIzAblRMwGZ1DwBZFIzAZnU/KSTqkUnVYtOqhZ9sgzITwLyhJoJyBNAbtRMQJ5QMwGZ1ExAJjUTkEnNN51ULTqpWnRStQh/SdWSk6pFJ1WLTqoWnVQtOqladFK16KRq0UnVopOqRSdVi06qFp1ULTqpWnRSteikatF/8RQ4NMxp/dEAAAAASUVORK5CYII=', 'a18aee60c24e141781a40c573615d9e6', '2025-01-08 14:49:44', '2025-01-08 14:52:25'),
(13, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'sold', '2025-01-08 14:49:44', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAYAAAB1PADUAAAAAklEQVR4AewaftIAAATOSURBVO3BQY4cSRIEQdNA/f/Lun30UwCJ9GIPuSaCP1K15KRq0UnVopOqRSdVi06qFp1ULTqpWnRSteikatFJ1aKTqkUnVYtOqhadVC06qVr0yUtA/iQ1N0CeUDMBeULNDZAn1ExA/iQ1b5xULTqpWnRSteiTZWo2AXlDzQRkAvIGkEnNpOYGyBNqNgHZdFK16KRq0UnVok++DMgTap4AcgNkUjMBuVEzAZnU3AC5UfMGkCfUfNNJ1aKTqkUnVYs++T+n5gbIE0Bu1PzLTqoWnVQtOqla9Mk/Ts0NkEnNpGYCMgGZ1NwAuVHzNzupWnRSteikatEnX6bmX6LmBsikZlIzAXlDzX/JSdWik6pFJ1WLPlkG5DepmYBMap4AMqmZgExqJiCTmjeA/JedVC06qVp0UrXok5fU/JcAuQEyqflNam7U/E1OqhadVC06qVr0yUtAJjUTkE1qJjUTkBs1T6h5AsgTQCY1E5BNar7ppGrRSdWik6pFn7ykZgLyhJongExqngAyqZmAPKFmAjKpmYBMaiYgb6iZgNwAmdS8cVK16KRq0UnVIvyRLwJyo+YGyCY1E5BNaiYgk5o3gNyouQEyqdl0UrXopGrRSdWiT14C8oSaCciNmhsgk5oJyATkCTUTkEnNE0AmNROQSc2kZgLyBpBJzRsnVYtOqhadVC365JepmYBMQCY1b6h5AsgTQCY136RmAvKEmk0nVYtOqhadVC3CH1kEZJOaGyCTmieATGpugNyomYA8oWYC8oSaCcgTat44qVp0UrXopGoR/sgiIE+omYC8oeY3AblRMwF5Qs0EZFLzm06qFp1ULTqpWoQ/8kVA3lBzA2RS8wSQSc0EZFIzAZnU3AC5UXMD5Ak1f9JJ1aKTqkUnVYs+WQbkRs0TQDYBmdTcqLlRMwG5UTMBeUPNDZBJzTedVC06qVp0UrUIf+QFIG+omYBMaiYgm9RMQJ5Q8wSQSc0E5EbNBGRScwPkRs0bJ1WLTqoWnVQtwh95AcikZgJyo+YGyI2aCcikZgLym9RMQCY1N0CeUPMnnVQtOqladFK1CH/kBSCTmhsgN2pugLyhZgJyo2YCcqPmBsiNmieATGpugNyoeeOkatFJ1aKTqkX4Iy8AmdQ8AWSTmk1ANqmZgPxJar7ppGrRSdWik6pF+CN/MSBPqJmATGreADKpmYDcqHkCyKTmBsiNmjdOqhadVC06qVr0yUtA/iQ1k5obIBOQN4BMaiY1E5A3gExqboDcqPmmk6pFJ1WLTqoWfbJMzSYgN0AmNTdqngByA2RSc6NmAnKj5gk1N0AmNZtOqhadVC06qVr0yZcBeULNNwGZ1NyomYBMaiYgbwB5A8hvOqladFK16KRq0Sd1BWRSMwG5UTMBmdRMQCY1E5BJzQ2QGyCTmjdOqhadVC06qVr0yT9OzQRkAvIEkBs1E5An1ExAJjUTkEnNpGYCMqnZdFK16KRq0UnVok++TM03qZmAvKFmAjKpmYA8oWYCcqPmb3JSteikatFJ1SL8kReA/ElqJiCTmgnIpGYC8pvUTEAmNU8AuVHzTSdVi06qFp1ULcIfqVpyUrXopGrRSdWik6pFJ1WLTqoWnVQtOqladFK16KRq0UnVopOqRSdVi06qFp1ULfofBZtBIkieam4AAAAASUVORK5CYII=', 'feb88a38814ad9e0e77b1cd68c3887d5', '2025-01-08 14:49:44', '2025-01-08 14:52:26'),
(14, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'sold', '2025-01-08 14:49:44', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAYAAAB1PADUAAAAAklEQVR4AewaftIAAATDSURBVO3BQW4ERxIEwfDC/P/LvjzmqYBG51CUNszwR6qWnFQtOqladFK16KRq0UnVopOqRSdVi06qFp1ULTqpWnRSteikatFJ1aKTqkUnVYs+eQnIb1JzA2RScwPkDTU3QJ5QMwH5TWreOKladFK16KRq0SfL1GwC8oSaCciNmgnIE0AmNU+oeULNJiCbTqoWnVQtOqla9MmXAXlCzRNAbtRMQJ5QMwGZ1ExAbtRsAvKEmm86qVp0UrXopGrRJ/8xat5QMwF5Qs0NkBs1/2YnVYtOqhadVC365D8OyKTmCTUTkAnIjZpJzX/ZSdWik6pFJ1WLPvkyNf8kNZvUvAHkRs0Tav6Sk6pFJ1WLTqoWfbIMyF8CZFIzAZnUTEAmNROQSc0EZFIzAXkCyF92UrXopGrRSdWiT15S85cAmdRMQCY1m4A8oeZGzb/JSdWik6pFJ1WL8EdeADKpmYBsUrMJyKTmCSCTmieATGomIJvUfNNJ1aKTqkUnVYvwRxYBmdRMQG7U3ACZ1NwAuVEzAXlCzSYgN2reAHKj5o2TqkUnVYtOqhbhj7wA5EbNDZBvUjMBmdRMQN5QcwPkCTUTkCfU/KaTqkUnVYtOqhZ98mVAJjWTmjeAvAHkRs0EZFIzAZnUTGpugDyh5g0gk5o3TqoWnVQtOqlahD+yCMg3qZmA3Ki5ATKpmYDcqLkBcqPmBsik5gbIE2o2nVQtOqladFK1CH/kBSCTmgnIpOYGyKTmDSCTmjeA3KiZgExqJiCTmjeATGomIDdq3jipWnRSteikahH+yAtAbtRMQCY1E5AbNROQGzV/CZBJzQRkUjMBmdT8JSdVi06qFp1ULfrkJTUTkAnIG2r+SUAmNROQJ9RMQJ5Q85edVC06qVp0UrXoky9TcwNkUjMBmdTcqLkBcqNmUnOjZgIyqXlCzQ2QN9R800nVopOqRSdViz55Ccik5g0gk5rfBOQJNZOaCcik5gbIpGZSMwGZ1ExAboBMat44qVp0UrXopGrRJ18GZFLzBJAbNROQSc2k5gbINwGZ1HyTmgnIpGbTSdWik6pFJ1WLPvkyNTdqNqm5AfKEmgnIDZAbNX8JkEnNGydVi06qFp1ULfrklwGZ1ExA3lDzhpoJyKRmAnKjZgLyTUCeULPppGrRSdWik6pF+CP/YkBu1ExAJjVPALlRMwGZ1ExAJjVPAJnUTECeUPPGSdWik6pFJ1WLPnkJyG9SM6mZgExAJjUTkEnNjZrfBGRScwNkUvObTqoWnVQtOqla9MkyNZuA3ACZ1ExAJiBPAHlDzRtqnlDzTzqpWnRSteikatEnXwbkCTV/iZoJyI2aCcgTQN4A8oaaN06qFp1ULTqpWvTJ/xk1E5AJyBNqJiBPqJmAvKHmBsikZtNJ1aKTqkUnVYs++Y8BcgNkUnMDZFIzAZnUTECeUPMEkAnIP+mkatFJ1aKTqkWffJmab1IzAZnUvKFmAjKpmYBMaiYgN0AmNROQJ9RMQL7ppGrRSdWik6pFnywD8puAvAFkUnOj5kbNBOQGyCY1E5BJzTedVC06qVp0UrUIf6RqyUnVopOqRSdVi06qFp1ULTqpWnRSteikatFJ1aKTqkUnVYtOqhadVC06qVp0UrXofyOSOxzBrYzkAAAAAElFTkSuQmCC', 'b5ca4893e941643d5b52df875a88bbe6', '2025-01-08 14:49:44', '2025-01-08 14:52:26'),
(15, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'sold', '2025-01-08 14:49:44', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAYAAAB1PADUAAAAAklEQVR4AewaftIAAATKSURBVO3BQY4cSRIEQdNA/f/Lun30UwCJ9OohuSaCP1K15KRq0UnVopOqRSdVi06qFp1ULTqpWnRSteikatFJ1aKTqkUnVYtOqhadVC06qVr0yUtAfpOaCcgTat4A8oSaCciNmgnIb1LzxknVopOqRSdViz5ZpmYTkCfU3AC5UXOjZgIyqZmA3Kh5Qs0mIJtOqhadVC06qVr0yZcBeULNG0AmNZuA/EmAPKHmm06qFp1ULTqpWvTJX07NBORGzRtqJiATkBs1E5BJzd/spGrRSdWik6pFn/zlgExqJiCTmgnIpGYCsgnIpOZfclK16KRq0UnVok++TM03qblRMwF5Qs0E5Ak136TmT3JSteikatFJ1aJPlgH5TUAmNROQSc0E5AbIpGYCMqmZgExqJiCTmhsgf7KTqkUnVYtOqhbhj/wfA3KjZgJyo+YGyKTmX3JSteikatFJ1aJPXgIyqbkB8pvUTEDeUPMEkBsgN2pugExqJiBPqHnjpGrRSdWik6pFn3wZkEnNbwLyTUAmNZOaCciNmhsgb6j5ppOqRSdVi06qFuGP/IeATGomIJOaGyA3am6ATGomIE+o2QTkCTW/6aRq0UnVopOqRZ98GZBJzaRmAjKpeULNDZA31ExAngByo2YCMqmZgExqboBMajadVC06qVp0UrUIf2QRkDfUTEDeUHMD5EbNBGSTmgnIE2qeAHKj5o2TqkUnVYtOqhbhj7wA5EbNBORGzQ2QSc0E5EbNDZAbNROQGzU3QP5LajadVC06qVp0UrXok/+YmgnIJjVvqHlCzQ2QSc0EZFIzAblRcwNkAjKpeeOkatFJ1aKTqkWfvKRmAvIEkBs1E5AngNyomdTcAJnU3AB5Qs0EZFJzA+RGzQRk00nVopOqRSdVi/BHXgByo+YNIJOaCcikZgIyqXkCyKRmAnKj5gbIjZq/yUnVopOqRSdViz5ZpuYGyKRmAjKpeQLIpGYC8k1qJiCbgDyh5gbIpOaNk6pFJ1WLTqoW4Y+8AORGzRtAbtRMQCY1E5AbNTdAJjUTkEnNBGSTmgnIE2o2nVQtOqladFK16JMvAzKpmYDcqJmATECeUPMEkEnNJjUTkEnNDZAn1ExAJjVvnFQtOqladFK1CH/kBSA3aiYgv0nNDZBNaiYgv0nNBORGzaaTqkUnVYtOqhbhj/zFgExqboBMam6ATGqeADKpmYBMap4A8oSabzqpWnRSteikatEnLwH5TWo2AZnUvAFkUjMBeQLIpOZGzQTkBsik5o2TqkUnVYtOqhZ9skzNJiB/EiCTmhsgb6h5Q81vOqladFK16KRq0SdfBuQJNZuAPAHkRs0EZBOQbwLyTSdVi06qFp1ULfrkH6dmAnKj5gk1N0CeUHMDZFJzA2RS800nVYtOqhadVC365C+n5gbIpGYCMgGZ1ExAJjW/Sc0E5EbNBORGzRsnVYtOqhadVC365MvU/CYgk5obNU+omYBMaiY1E5BJzQTkCTU3QH7TSdWik6pFJ1WL8EdeAPKb1ExAnlAzAZnUTEBu1LwB5EbNBOQJNROQSc2mk6pFJ1WLTqoW4Y9ULTmpWnRSteikatFJ1aKTqkUnVYtOqhadVC06qVp0UrXopGrRSdWik6pFJ1WLTqoW/Q8gpDoppdzOfAAAAABJRU5ErkJggg==', '680c1d44329dd8148df74a277113216a', '2025-01-08 14:49:44', '2025-01-08 14:52:26'),
(16, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'sold', '2025-01-08 14:49:44', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAYAAAB1PADUAAAAAklEQVR4AewaftIAAATgSURBVO3BQY4jRxAEwfAC//9l1x7zVECjk6MdKczwj1QtOaladFK16KRq0UnVopOqRSdVi06qFp1ULTqpWnRSteikatFJ1aKTqkUnVYtOqhZ98hKQn6RmAnKj5gkgT6iZgNyoeQLIT1LzxknVopOqRSdViz5ZpmYTkH+TmhsgP0nNJiCbTqoWnVQtOqla9MmXAXlCzRNqboBMaiYgk5o31ExAJiCTmjeAPKHmm06qFp1ULTqpWvTJLwfkDTU3QG7U3KiZgExAJjW/2UnVopOqRSdViz755dS8AWRSc6NmAjKpuVEzAfkvOaladFK16KRq0SdfpuZvAmRSMwGZ1ExAngAyqZnUvKHmb3JSteikatFJ1aJPlgH5SUAmNROQSc0EZFIzAZnUTEDeADKpuQHyNzupWnRSteikahH+kV8MyBtqngDyhJoJyI2a3+ykatFJ1aKTqkWfvARkUjMBuVEzAXlCzQ2QJ4BMam7UvKHmBsik5gbIpGYCcqPmjZOqRSdVi06qFn3ykpoJyBNAbtRMQG6ATGreAPIEkEnNpOYGyA2Qv9lJ1aKTqkUnVYs++TI1E5BJzQRkAnIDZFIzAZnUTEBu1NwA2aTmCSCTmgnIjZpNJ1WLTqoWnVQtwj+yCMgmNROQGzU3QCY1bwCZ1NwAeUPN3+ykatFJ1aKTqkWfvATkRs0bQG7U3ACZ1DwB5EbNE2reADKpuQEyqfmmk6pFJ1WLTqoWffKSmgnIBGRSMwGZ1ExqboA8AeRGzY2aCcikZgIyqXkCyBNAngAyqXnjpGrRSdWik6pFn7wE5JuA3Ki5ATKpmYBMQCY1E5An1DwB5AkgTwD5ppOqRSdVi06qFn3ykppNQCY1E5AJyI2aJ9RMQCY1E5AbIDdqJjVPAJnUPAFk00nVopOqRSdVi/CP/CAgb6i5AfKEmhsgN2omIDdqboBMaiYgT6j5SSdVi06qFp1ULfpkGZBJzY2aCcik5gbIjZoJyBtqJiA3aiYgk5pJzRNqJiATkEnNN51ULTqpWnRSteiTl4BMaiYgk5oJyA2QbwLyBJBJzRNqboBMat5Q85NOqhadVC06qVr0yUtqNqm5AfIEkE1qngByo2ZSMwF5A8ik5ptOqhadVC06qVr0yTIgk5oJyBNAJjUTkBs1N0DeADKpmdTcAHkDyBtAJjVvnFQtOqladFK16JNlam7UPKHmCTVvqLkBMqmZgNyouVHzBJBJzb/ppGrRSdWik6pFn7wE5Cep2aTmBsikZgIyqZmAvAFkUnMD5EbNpGbTSdWik6pFJ1WLPlmmZhOQJ4BMam6AfJOaCcgTat5QMwGZ1Gw6qVp0UrXopGrRJ18G5Ak1T6iZgExAJjU3ajYBmdRMQCYgm4BMaiYgk5o3TqoWnVQtOqla9MkvB+QJIJOab1IzAZnUvAHkDTWbTqoWnVQtOqla9Mn/jJoJyI2aJ4DcqJmAPKFmUjMBeQLIpOaNk6pFJ1WLTqoWffJlar5JzQTkDTU3QG7UTEAmIJOaCcik5gbIpOYGyKRm00nVopOqRSdViz5ZBuQnAXlDzQTkCTUTkEnNDZBJzQ2QSc0EZFLzk06qFp1ULTqpWoR/pGrJSdWik6pFJ1WLTqoWnVQtOqladFK16KRq0UnVopOqRSdVi06qFp1ULTqpWnRStegfmDcxX4kDoHoAAAAASUVORK5CYII=', '0cfdf9a603c3aeb7820751d50aa6881d', '2025-01-08 14:49:44', '2025-01-08 14:52:26'),
(17, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'sold', '2025-01-08 14:49:44', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAYAAAB1PADUAAAAAklEQVR4AewaftIAAAS/SURBVO3BQQ4jRxIEQY8C//9l3znmqYBGJymNNsziH1QtOVQtOlQtOlQtOlQtOlQtOlQtOlQtOlQtOlQtOlQtOlQtOlQtOlQtOlQtOlQt+vBSEn5J5SYJv6QyJWFSuUnCpDIl4ZdU3jhULTpULTpULfqwTGVTEt5QuUnCG0mYVKYk3Kg8obIpCZsOVYsOVYsOVYs+fFkSnlB5IgmTyhMqUxImlSkJk8qUhEnlJgmTyhNJeELlmw5Viw5Viw5Viz78xyThCZVJZUrCEypTEiaVSeW/5FC16FC16FC16MN/jMpNEp5QmZIwJeGNJEwqf7ND1aJD1aJD1aIPX6byS0mYVCaVKQmTyo3KE0mYkjCpvKHyb3KoWnSoWnSoWvRhWRL+SSpTEiaVJ5IwqUxJmFRuVKYkTCo3Sfg3O1QtOlQtOlQt+vCSyt9MZVMSnlC5UfmbHKoWHaoWHaoWfXgpCZPKlIRNKpPKE0mYVG5UnlB5IgmTypSETSrfdKhadKhadKha9OEllW9SeUPlJglvqExJuFG5ScKkMiVhUpmSMKlMSbhReeNQtehQtehQtSj+wRclYVK5ScKNyhtJ+CaVKQk3Km8kYVKZkjCpfNOhatGhatGhatGHl5KwSeUmCZPKN6lMSZhUpiTcqGxSmZIwqdwkYVJ541C16FC16FC16MNLKk8kYVK5ScJNEm5UnlCZkvCEyhNJeEJlSsKkMiXhRmXToWrRoWrRoWpR/IMXknCjMiXhCZUpCZtUnkjCjcoTSZhUvikJNypvHKoWHaoWHaoWfVim8oTKTRJuVKYkTCpTEqYkTCo3Km8kYVKZkrBJZVL5pkPVokPVokPVog8vqdwk4SYJNypTEt5QeSIJk8qUhCdUblR+KQmTyhuHqkWHqkWHqkUffkxlSsKkMiVhUpmS8E0qNypTEiaVJ5JwozIl4UblRmXToWrRoWrRoWpR/IMXkvCEyi8lYVK5ScITKjdJeENlSsKNyhNJmFTeOFQtOlQtOlQt+rBMZUrCE0m4UZmScKNyk4RvUpmSMKncJGFSmZLwRBImlU2HqkWHqkWHqkUfvkzlCZWbJEwqUxKeUJmSMKlMSZiS8ITKTRImlU0q33SoWnSoWnSoWvThx5JwozIlYVJ5Iwk3KlMSblSmJEwqN0m4ScITSZhUpiTcqLxxqFp0qFp0qFoU/+AvloRNKk8kYVKZkvCEyhNJmFSmJEwqUxImlTcOVYsOVYsOVYs+vJSEX1KZVN5Iwjep3CThJgmTyk0SbpIwqWw6VC06VC06VC36sExlUxJukjCpTEmYVCaVmyQ8kYRJ5Q2VTSrfdKhadKhadKha9OHLkvCEyiaVN1RukjCpTEl4IgmbVH7pULXoULXoULXow/+5JEwqUxImlUnlDZWbJGxKwqSy6VC16FC16FC16MN/TBJuVCaVG5UpCZPKjcpNEiaVSWVKwqQyJeGfdKhadKhadKha9OHLVL5J5Y0kfFMSblSeUJmScJOEXzpULTpULTpULfqwLAm/lIRJ5SYJv6QyJWFKwo3KJpVvOlQtOlQtOlQtin9QteRQtehQtehQtehQtehQtehQtehQtehQtehQtehQtehQtehQtehQtehQtehQteh/5kdEBxAZvSkAAAAASUVORK5CYII=', '97cfa981963b1fc56d84416b2599a889', '2025-01-08 14:49:44', '2025-01-08 14:52:26'),
(18, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'sold', '2025-01-08 14:49:45', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAYAAAB1PADUAAAAAklEQVR4AewaftIAAASsSURBVO3BQY4cSRIEQbVA/f/Lujz6KYBEejV7uCYS/6BqyaFq0aFq0aFq0aFq0aFq0aFq0aFq0aFq0aFq0aFq0aFq0aFq0aFq0aFq0aFq0YeXkvCTVG6SMKlMSZhUpiQ8oTIl4UZlSsKkMiXhJ6m8cahadKhadKha9GGZyqYkbFKZkvBGEiaVb1LZlIRNh6pFh6pFh6pFH74sCU+oPJGEJ5LwhMqUhEllSsKk8k1JeELlmw5Viw5Viw5Viz7845IwqUxJmFSmJDyhcpOESeVfcqhadKhadKha9OEfp3KjcqMyJWFKwhMqUxImlf+yQ9WiQ9WiQ9WiD1+m8pskYVJ5QmWTyhsqv8mhatGhatGhatGHZUn4m1SmJEwqUxImlSkJk8qUhEllSsKkMiVhUrlJwm92qFp0qFp0qFr04SWV30zlRuWbVKYkPKHyX3KoWnSoWnSoWvThpSRMKlMSNqlMKm8kYVKZVL5J5SYJm1S+6VC16FC16FC16MNLKlMSblS+KQlPqExJeEJlSsKNyhMqN0mYVKYk3CRhUnnjULXoULXoULXow0tJmFSeSMITKk+o3CThjSRMKjdJeELlDZUpCZPKpkPVokPVokPVog9floQblSeSMKlMKptUpiRMKk+o3CThJgmbkjCpvHGoWnSoWnSoWvThJZUnVKYkPKGySeUmCZuS8IbKTRJuVL7pULXoULXoULUo/sELSZhUpiTcqExJmFQ2JWFSeSIJT6hsSsITKlMSblTeOFQtOlQtOlQt+rAsCZPKTRJuknCjcpOETSpPJOEJlSkJm1S+6VC16FC16FC16MNfpvJGEr4pCZPKlIQnVJ5QmZJwo/I3HaoWHaoWHaoWfXhJZUrCTRImlZskTCqbkjCpTCo3Kk8k4UblCZUpCTcq33SoWnSoWnSoWvThpSRMKptUpiRMKjdJmFSmJExJeEJlSsKNypSEKQk3KlMSblRukjCpvHGoWnSoWnSoWvThy5IwqTyRhJskPJGEb1LZpHKj8kQSJpVNh6pFh6pFh6pFH35YEp5QmZLwhspNEiaVKQk3SZhUpiRMKlMSpiQ8ofI3HaoWHaoWHaoWxT94IQmTyhtJ2KQyJeFGZUrCjcobSfhNVN44VC06VC06VC368JLKJpUnkjCpTEl4Q2VKwpSEJ1RuVJ5IwqTyRBI2HaoWHaoWHaoWfXgpCT9JZVKZkvA3qWxKwqTyRBJuVDYdqhYdqhYdqhZ9WKayKQk3SfimJNyofJPKE0mYVKYkfNOhatGhatGhatGHL0vCEypvqGxSuUnCpDIlYVK5ScIbKlMSJpUpCZPKG4eqRYeqRYeqRR/+cUl4QmVKwo3KlISbJEwqN0mYVJ5QmZIwqWw6VC06VC06VC368H9GZUrClIRJZUrCEypTEqYkPJGE3+xQtehQtehQtejDl6l8k8qNyo3KTRJukjCpTEm4UZmSMKlMSXhCZUrCNx2qFh2qFh2qFn1YloSflIRJZUrCpHKThBuVn5SEJ1SmJEwq33SoWnSoWnSoWhT/oGrJoWrRoWrRoWrRoWrRoWrRoWrRoWrRoWrRoWrRoWrRoWrRoWrRoWrRoWrRoWrR/wA4Gxs2P6iiNAAAAABJRU5ErkJggg==', '85f8542cef5d3549057ff95755c7480e', '2025-01-08 14:49:45', '2025-01-08 14:52:26'),
(19, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'sold', '2025-01-08 14:49:45', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAYAAAB1PADUAAAAAklEQVR4AewaftIAAATdSURBVO3BQY4jRxAEwfAC//9l1xzzVECjk6NdKczwR6qWnFQtOqladFK16KRq0UnVopOqRSdVi06qFp1ULTqpWnRSteikatFJ1aKTqkUnVYs+eQnIb1JzA2RSMwGZ1ExAnlDzBJBJzQ2Q36TmjZOqRSdVi06qFn2yTM0mIE+o+U1AJjUTkEnNG2o2Adl0UrXopGrRSdWiT74MyBNqngAyqZmATGqeUDMBmdS8AWRS8wSQJ9R800nVopOqRSdViz75jwEyqZmATGomNROQJ4BMam7U/JecVC06qVp0UrXok/8ZNU+omYBMQCY1E5An1PzNTqoWnVQtOqla9MmXqfmTALlRc6PmCTU3QN5Q8yc5qVp0UrXopGrRJ8uA/JvUTEAmNROQGyCTmgnIpGYCMql5A8if7KRq0UnVopOqRZ+8pOZvAuTfBOQJNX+Tk6pFJ1WLTqoWffISkEnNBGSTmknNBGRSMwGZ1NyoeQLIjZoJyA2QTWq+6aRq0UnVopOqRZ+8pGYCMqm5ATKpuQFyo2YCMqm5AfKEmieATGqeUDMBmdTcALlR88ZJ1aKTqkUnVYs+eQnINwGZ1DyhZgKyCcik5kbNE2reADKp+aaTqkUnVYtOqhbhj7wA5JvUTEAmNZuATGomIJOaGyA3aiYgb6i5AXKj5o2TqkUnVYtOqhZ98svU3ACZgExq3gAyqZnUTECeAHKjZgJyo2YCMqmZgNyo+aaTqkUnVYtOqhbhj/yLgNyoeQLIjZo3gNyouQEyqbkBMqmZgExqboDcqHnjpGrRSdWik6pF+CMvAJnUvAHkDTU3QG7UvAFkUvN/clK16KRq0UnVok+WAZnU3AC5UTMBmdRMQG7UTEBugExqJiCTmieAPKFmAjKpuQEyqdl0UrXopGrRSdWiT74MyKTmCSA3QL5JzY2aCcik5kbNG2omIP+mk6pFJ1WLTqoW4Y+8AORGzRNAJjU3QCY1E5AbNROQJ9TcAPlNap4AMql546Rq0UnVopOqRZ8sUzMBmdRMQG6ATGqeUHMD5A0gk5pJzQ2QGzVPAJnUTEAmNZtOqhadVC06qVr0yS8DMqmZgExqJiBvAHlCzQRkUnMD5Ak1E5BJzQRkUnOj5ptOqhadVC06qVqEP/ICkEnNG0CeUHMDZFIzAZnUTEDeUHMD5Dep+aaTqkUnVYtOqhbhj/zFgNyomYDcqNkE5Ak1TwCZ1NwAuVHzxknVopOqRSdViz55CchvUjOpuQEyqZmAPAFkUvNNQCY1N0AmNZOabzqpWnRSteikatEny9RsAnID5EbNBGRScwNkUvOEmhsgN2o2AZnUbDqpWnRSteikatEnXwbkCTV/EjUTkEnNBORGzQ2QN9RMQH7TSdWik6pFJ1WLPvmPUTMBuQEyqZmATGomIJOaGyCTmgnIpGYCMqmZgExqJiATkEnNGydVi06qFp1ULfrkf07NE0AmNTdAJjUTkEnNBGRSMwGZ1ExAbtRsOqladFK16KRq0Sdfpuab1Dyh5gbIjZo3gDyhZgLyhJoJyDedVC06qVp0UrUIf+QFIL9JzQRkUjMBuVFzA2STmieAbFLzTSdVi06qFp1ULcIfqVpyUrXopGrRSdWik6pFJ1WLTqoWnVQtOqladFK16KRq0UnVopOqRSdVi06qFp1ULfoHdVlQHOAqrAAAAAAASUVORK5CYII=', 'e0fb011f52b466c797d27d0d47da02b1', '2025-01-08 14:49:45', '2025-01-08 14:52:26'),
(20, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'sold', '2025-01-08 14:49:45', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAYAAAB1PADUAAAAAklEQVR4AewaftIAAATRSURBVO3BQY4jRxAEwfAC//9l1xxTlwIanRxpF2GGP1K15KRq0UnVopOqRSdVi06qFp1ULTqpWnRSteikatFJ1aKTqkUnVYtOqhadVC06qVr0yUtAfpOaJ4BMam6APKHmCSCTmhsgv0nNGydVi06qFp1ULfpkmZpNQJ4AMqmZgExq3gAyqZmATGomIJOaGzWbgGw6qVp0UrXopGrRJ18G5Ak1TwC5AXID5EbNBGRSc6NmArIJyBNqvumkatFJ1aKTqkWf/OXUTEAmNTdAngByo2YC8jc5qVp0UrXopGrRJ385IJOaCcikZlIzAZmATGpugExq/iYnVYtOqhadVC365MvU/E3UvKFmk5r/k5OqRSdVi06qFn2yDMh/Sc0E5A0gk5oJyKRmAjKpmYBMam6A/J+dVC06qVp0UrXok5fU/EmATGp+E5BJzY2aP8lJ1aKTqkUnVYvwR14AMqmZgGxS8waQSc0bQJ5Q8wSQTWq+6aRq0UnVopOqRZ8sA/KEmgnIpOYGyKRmAjKpuQHyhJongHyTmieATGreOKladFK16KRqEf7IC0B+k5ongExqJiCb1DwB5EbNG0Bu1Gw6qVp0UrXopGoR/sgiIDdqJiA3am6ATGreADKpmYBMam6A3KiZgGxS85tOqhadVC06qVr0yUtAngByo2YCMql5AsiNmknNBOQJIDdqnlDzBpAbNZtOqhadVC06qVqEP/JFQJ5QcwPkCTUTkBs1N0Bu1NwAuVEzAXlCzQ2QGzVvnFQtOqladFK1CH/kPwRkUjMBeULNDZAbNW8AmdTcALlRcwPkRs1vOqladFK16KRq0Se/DMgNkEnNDZAbIJOaCcgNkEnNBGRSMwGZ1ExqngDyBpBJzaaTqkUnVYtOqhbhjywCMql5A8gbaiYgN2reADKpmYDcqNkE5Ak1b5xULTqpWnRSteiTl4C8AWRSM6mZgExqboDcqJmAPKFmUjMBuVEzAdmk5gbIppOqRSdVi06qFn2yTM0EZFIzqbkBMqm5AXKj5puATGreUHMDZFJzA2RSs+mkatFJ1aKTqkWf/DIgT6iZgExqngAyqblRMwG5UTMBuVEzqXlCzRNqJiCTmjdOqhadVC06qVr0yZepeQPIJjUTkEnNBGRSMwF5Qs0E5DepmdRsOqladFK16KRqEf7IHwzIpOYGyKRmE5BJzQ2QSc0TQG7U3ACZ1LxxUrXopGrRSdWiT14C8pvUTGomIDdq3gByo2YC8gaQSc0bQCY1m06qFp1ULTqpWvTJMjWbgNwAmdRsAjKpeULNBOQJNX+Sk6pFJ1WLTqoWffJlQJ5Q801AbtRMaiYgk5oJyKRmUjMBmYC8oWYC8ptOqhadVC06qVr0yV8GyKRmUnMD5EbNBGRSMwG5UTMBmdRMQCY1N2omIBOQSc0bJ1WLTqoWnVQt+qT+Rc0NkG9SMwGZ1ExA3lCz6aRq0UnVopOqRZ98mZpvUjMBmYDcqJmAPKHmRs0EZAIyqZnUTECeUDMB+aaTqkUnVYtOqhZ9sgzIbwJyo2YCMgG5UXMD5Ak1TwCZ1ExAJjUTkEnNN51ULTqpWnRStQh/pGrJSdWik6pFJ1WLTqoWnVQtOqladFK16KRq0UnVopOqRSdVi06qFp1ULTqpWnRStegfaHBBK7H+ijoAAAAASUVORK5CYII=', '78a2ad5ca8dfb1a75b9cb71446f9a9c8', '2025-01-08 14:49:45', '2025-01-08 14:52:26'),
(21, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'sold', '2025-01-08 14:49:45', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAYAAAB1PADUAAAAAklEQVR4AewaftIAAATmSURBVO3BQY4bSRAEwfAC//9l3znmqYBGJ2clKMzwR6qWnFQtOqladFK16KRq0UnVopOqRSdVi06qFp1ULTqpWnRSteikatFJ1aKTqkUnVYs+eQnIb1IzAZnU3ADZpGYCMqm5ATKpmYD8JjVvnFQtOqladFK16JNlajYBeQLIpOZGzQRkUnMD5Akgb6jZBGTTSdWik6pFJ1WLPvkyIE+oeULNJjW/Sc0bQJ5Q800nVYtOqhadVC365C8HZFIzAXkDyI2aJ9RMQCY1f7OTqkUnVYtOqhZ98pdTMwGZ1NwAmdTcqJmATGr+ZSdVi06qFp1ULfrky9T8JjVPqJmATGomIH8SNX+Sk6pFJ1WLTqoWfbIMyG8CMqmZgExqJiCTmgnIpGYCcgNkUvMGkD/ZSdWik6pFJ1WL8Ef+YkAmNROQGzVPALlR8y87qVp0UrXopGrRJy8BmdRMQG7UTECeUHOj5gkgk5obNTdAJjVPAJnU3ACZ1ExAbtS8cVK16KRq0UnVok9eUvNNap4AcqPmCSBvqJmATGreADKpuVEzAdl0UrXopGrRSdWiT5YBuVEzAZnUTEAmNTdqboA8oeYGyBNqJiA3at4AMqmZ1Gw6qVp0UrXopGoR/sgLQCY1TwC5UXMDZFIzAZnUTEAmNU8AeUPN/wnIpOaNk6pFJ1WLTqoWffKSmk1qJiBvqJmAPAHkRs0NkEnNBORGzRtAJjWTmk0nVYtOqhadVC3CH/kiIG+o2QRkUnMDZFIzAZnUvAHkRs0NkDfUvHFSteikatFJ1aJPlgGZ1DwBZAIyqbkBcqNmAnKjZgLyfwIyqXlCzQRk00nVopOqRSdVi/BHvgjIjZoJyKRmAjKpuQEyqXkCyKRmAnKj5puA3KiZgNyoeeOkatFJ1aKTqkWfvATkCTUTkEnNBOQJIE8AmdTcAJnUTEBugExqJiCTmgnIjZobNd90UrXopGrRSdWiT15ScwNkAvKEmhsgk5on1DyhZgIyqZmATGomIJOaJ9RMQCY1v+mkatFJ1aKTqkX4Iy8AmdQ8AeQJNROQGzUTkE1qngAyqXkCyBNqftNJ1aKTqkUnVYs+eUnNDZAbNROQSc2NmgnIjZobIDdq/iRqJiATkEnNBGRS88ZJ1aKTqkUnVYs+WQbkRs2NmgnIpGYCMqmZgNyo+SYgk5oJyBtA/iQnVYtOqhadVC36ZJmaTWo2qZmATGpugExqNql5AsiNmt90UrXopGrRSdWiT14C8pvU3AC5AfIEkBsgTwB5Asik5kbNE2o2nVQtOqladFK16JNlajYBeULNBGRScwPkRs0E5Ak1E5AbNU8AmdRMQCY1m06qFp1ULTqpWvTJlwF5Qs0TaiYgk5oJyI2aGyA3aiYgTwDZBGRSMwGZ1LxxUrXopGrRSdWiT/5yQCY1E5BJzQRkAjKpmdRMQG7U3Kh5AsgmNZtOqhadVC06qVr0yT8GyBNANgHZpOYGyA2QSc0bJ1WLTqoWnVQt+uTL1HyTmgnIpGYCMqmZgExqJiA3QJ5QMwGZ1LyhZgIyqdl0UrXopGrRSdWiT5YB+U1AJjUTkEnNG2qeADKpmYBMat4AMqn5TSdVi06qFp1ULcIfqVpyUrXopGrRSdWik6pFJ1WLTqoWnVQtOqladFK16KRq0UnVopOqRSdVi06qFp1ULfoPWiVRLRz2whcAAAAASUVORK5CYII=', '2b40faf76aac65d622995d625be1b94d', '2025-01-08 14:49:45', '2025-01-08 14:52:26'),
(22, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'sold', '2025-01-08 14:49:45', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAYAAAB1PADUAAAAAklEQVR4AewaftIAAATDSURBVO3BQY4kRxIEQdNA/f/LunN0XgJIpFf3kGsi+EeqlpxULTqpWnRSteikatFJ1aKTqkUnVYtOqhadVC06qVp0UrXopGrRSdWik6pFJ1WLPnkJyE9S8wSQGzUTkCfUPAFkUnMD5CepeeOkatFJ1aKTqkWfLFOzCcgTQH4SkEnNBGRS84aaTUA2nVQtOqladFK16JMvA/KEmieAPKFmAnKjZgIyqXkDyKTmCSBPqPmmk6pFJ1WLTqoWfVL/oGYC8gSQJ9T8l5xULTqpWnRSteiT/zg1N2pu1ExAJiCTmhsgN2r+zU6qFp1ULTqpWvTJl6n5TUBu1Dyh5gkgk5pNav4mJ1WLTqoWnVQt+mQZkN+kZgIyqZmATGomIJOaCcik5gkgk5obIH+zk6pFJ1WLTqoWffKSmr8JkL+JmjfU/JucVC06qVp0UrXok5eATGomIJvUTGpugLyh5gkgk5obNTdANqn5ppOqRSdVi06qFn3yy9RMQCY1E5BJzRNAJjUTkCfU3AB5Qs2NmgnIjZobIJOaN06qFp1ULTqpWvTJS2pu1ExAngAyqfmbAHlCzQ2QJ9Q8AWRSs+mkatFJ1aKTqkX4RxYBmdR8E5BvUjMBmdQ8AWRSMwGZ1NwAmdTcALlR88ZJ1aKTqkUnVYs+WabmCSCb1NwAmdTcAHkCyI2aTWomIDdqvumkatFJ1aKTqkWf/DI1E5BJzQ2QGyBvqJmATEAmNTdAbtRMQJ5QMwG5ATKpeeOkatFJ1aKTqkX4R14AMqm5AfKGmieATGomIJOaN4BMap4AMqm5AXKjZgIyqdl0UrXopGrRSdWiT36Ymhsgk5o31LwBZFIzAZnUTEBu1ExqboD8zU6qFp1ULTqpWoR/5AUgN2omIJvUTEAmNROQGzVvALlR85OATGq+6aRq0UnVopOqRZ98GZBJzQTkRs0bQCY1N0CeUHOjZgLyTWomNROQGzVvnFQtOqladFK16JNlap5QcwPkCTU/CcikZgIyqZmATGpugNwAuVHzTSdVi06qFp1ULfrky4BMaiYgN2omIJOab1LzhpobNROQSc0baiYgk5pNJ1WLTqoWnVQt+uTL1LwBZFIzAZnUTECeUDMBeUPNDZAbIE+omYDcAJnUvHFSteikatFJ1aJPXlLzhpqfpGYCcqPmDSCTmhs1TwCZgExqboBsOqladFK16KRq0ScvAflJaiY1E5BJzY2aJ4BMap4A8gSQSc0bQCY1m06qFp1ULTqpWvTJMjWbgNwAuQHyhJoJyKTmCTUTkCfUPKHmN51ULTqpWnRSteiTLwPyhJpNaiYgT6iZgExqJiCTmknNBGQC8gaQ33RSteikatFJ1aJP/uOAPAHkRs0EZFIzAXlDzQRkUvMEkAnIpOaNk6pFJ1WLTqoWffJ/Ts0EZFIzAbkBcqPmCSCTmgnIpGYCcqNm00nVopOqRSdViz75MjXfpOYJIBOQN9TcAJmA3KiZ1DwBZFIzAfmmk6pFJ1WLTqoWfbIMyE8CMqmZgExqJiCTmgnIDZAn1LwB5EbNBGRS800nVYtOqhadVC3CP1K15KRq0UnVopOqRSdVi06qFp1ULTqpWnRSteikatFJ1aKTqkUnVYtOqhadVC06qVr0PzIQLjIlVQMGAAAAAElFTkSuQmCC', '8d649ce2d5db81d53abbdd01c69ab1b3', '2025-01-08 14:49:45', '2025-01-08 14:57:28'),
(23, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'sold', '2025-01-08 14:49:45', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAYAAAB1PADUAAAAAklEQVR4AewaftIAAATfSURBVO3BQY4bSRAEwfAC//9l3znmqYBGJ2clIczwR6qWnFQtOqladFK16KRq0UnVopOqRSdVi06qFp1ULTqpWnRSteikatFJ1aKTqkUnVYs+eQnIb1JzA+RGzRtAbtRMQJ5QMwH5TWreOKladFK16KRq0SfL1GwC8oSaCcgmNTdAbtS8oWYTkE0nVYtOqhadVC365MuAPKHmCSCTmknNG0AmNROQSc0EZAJyo+YJIE+o+aaTqkUnVYtOqhZ98o8BMqmZgNyomdQ8AWRSMwGZ1PxLTqoWnVQtOqla9Mk/Rs0E5EbNBOQJNROQCcgNkEnN3+ykatFJ1aKTqkWffJma3wTkCSBvAJnUTEAmNZvU/ElOqhadVC06qVr0yTIg/yc1E5BJzQRkUjMBmdRMQN4AMqm5AfInO6ladFK16KRq0ScvqfmXAJnUTEAmNROQTWr+JidVi06qFp1ULfrkJSCTmgnIJjWTmgnIpOYJNROQJ9TcAJnU3ADZpOabTqoWnVQtOqlahD/yRUAmNTdAJjU3QCY1N0AmNU8AuVEzAZnUTEBu1ExAJjVvAJnUvHFSteikatFJ1SL8kReA3Ki5ATKpmYDcqJmATGpugExq3gAyqZmATGomIJOaTUAmNZtOqhadVC06qVr0yZcBeUPNBORGzQ2QJ4BMaiYgk5oJyKRmAnID5G9yUrXopGrRSdUi/JFFQJ5QcwNkUjMBmdRMQG7UvAHkRs0bQCY1bwC5UfPGSdWik6pFJ1WLPvmfAZnUTGpu1GwC8oSaGyCTmgnIjZoJyBNqbtRsOqladFK16KRqEf7IIiCTmgnIpGYC8oaaN4C8oeYGyKTm/wRkUvPGSdWik6pFJ1WLPnkJyKRmAvKGmhsgE5BNaiYgk5oJyI2aGyA3am6ATGomIN90UrXopGrRSdUi/JEXgLyh5gbIpOYGyBNqboDcqHkCyKTmDSBvqNl0UrXopGrRSdUi/JEXgNyomYA8oWYC8oSaTUBu1ExAvknNn+SkatFJ1aKTqkWfLFMzAXlCzQTkCTUTkEnNBGRSc6PmBsik5gkgk5obIJOaGyCTmk0nVYtOqhadVC365MvUPAFkUnMDZAIyqXkDyKRmAnID5EbNDZAngExqJjUTkEnNGydVi06qFp1ULfrkD6NmAnKjZgIyAZnUPKHmRs0bQDapmYD8ppOqRSdVi06qFn3ykppvUnMDZFJzA2RSMwF5Qs0E5EbNjZongNyomYB800nVopOqRSdViz55CchvUjOpuQEyqZmAbFJzA+QJIJOaJ4BMar7ppGrRSdWik6pFnyxTswnIDZAngDyh5gbIpGYC8oaaJ4BMan7TSdWik6pFJ1WLPvkyIE+oeUPNBOQJNROQJ4DcqJmATEDeUDMBuVGz6aRq0UnVopOqRZ/8Y4C8AWRSMwG5UTMBeULNBGRS84SaCcg3nVQtOqladFK16JN/nJoJyI2aCcikZpOaCcikZgJyo2YC8ptOqhadVC06qVr0yZep+SY1T6i5AXIDZFKzSc2NmhsgN2q+6aRq0UnVopOqRZ8sA/KbgExqngByo+YGyKTmBsgTap5QcwNkUrPppGrRSdWik6pF+CNVS06qFp1ULTqpWnRSteikatFJ1aKTqkUnVYtOqhadVC06qVp0UrXopGrRSdWik6pF/wE2sUM7vgc+mwAAAABJRU5ErkJggg==', '68922b811e2e3ac1ba14bf714c2cf107', '2025-01-08 14:49:45', '2025-01-08 14:57:30'),
(24, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'sold', '2025-01-08 14:49:45', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAYAAAB1PADUAAAAAklEQVR4AewaftIAAAThSURBVO3BQY4bSRAEwfAC//9l3znmqYBGJ2clIczwR6qWnFQtOqladFK16KRq0UnVopOqRSdVi06qFp1ULTqpWnRSteikatFJ1aKTqkUnVYs+eQnIb1LzBpBJzQTkCTXfBOQ3qXnjpGrRSdWik6pFnyxTswnIE0Bu1ExA3gAyqbkBcqPmRs0mIJtOqhadVC06qVr0yZcBeULNE0AmNZvUTEAmNROQSc2kZhOQJ9R800nVopOqRSdViz75xwG5UXMD5Ak1E5BJzQRkUvM3O6ladFK16KRq0Sf/GCCTmgnIBGRSM6mZgExA3lDzLzmpWnRSteikatEnX6bmT6JmAvKEmjeA3Kh5Qs2f5KRq0UnVopOqRZ8sA/J/UjMBmdQ8AWRSMwGZ1ExAJjUTkCeA/MlOqhadVC06qVr0yUtq/iRA/k9AJjU3am7U/E1OqhadVC06qVqEP/ICkEnNBGSTmhsgT6h5A8ikZgJyo+YGyCY133RSteikatFJ1aJPlgGZ1DwBZFIzAXlCzRNAnlBzo2aTmgnIpOYJIJOaN06qFp1ULTqpWoQ/8gKQSc0EZJOaN4BMaiYgb6iZgDyh5gbIJjWbTqoWnVQtOqla9Mn/TM1vUjMBuVEzAZnUTEBu1NwAmdRMaiYgN2omIBOQSc0bJ1WLTqoWnVQt+mQZkEnNBGQCMqmZgNyomYA8oeYGyBtqboBMam6ATGpugNyo2XRSteikatFJ1aJPlql5A8ikZgLyhJo31ExAJiCTmgnIjZoJyI2aCciNmgnIBGRS88ZJ1aKTqkUnVYs+WQZkUvOEmgnIpOYNIDdqbtS8oeYJNROQGzU3ar7ppGrRSdWik6pF+COLgDyhZgIyqZmA3KjZBGRSMwF5Qs0TQCY1E5AbNROQSc2mk6pFJ1WLTqoW4Y98EZBJzQRkUjMBuVEzAblRMwGZ1PwmIDdqJiCTmhsgk5pvOqladFK16KRqEf7IC0Bu1ExAbtTcALlRMwH5JjUTkEnNDZBJzRNAbtTcAJnUvHFSteikatFJ1SL8kReATGomIJvUTEDeUDMBeULNDZBJzQ2QSc0mIJOaTSdVi06qFp1ULfrky9RMQJ5QMwGZ1ExAngByo2YCcgPkBsik5gkgT6iZ1HzTSdWik6pFJ1WLPvkyIDdqJiATkBsgN2omIJOaGyBvqJmATEBugDyhZgJyo2bTSdWik6pFJ1WL8Ef+YkBu1ExAbtQ8AWRSMwF5Qs0TQCY1TwCZ1LxxUrXopGrRSdWiT14C8pvUTGomIBOQb1LzhJoJyA2QSc0NkEnNBGRSs+mkatFJ1aKTqkWfLFOzCcgNkBs1E5AngNyomYDcAHlCzTcBmdS8cVK16KRq0UnVok++DMgTat5Qs0nNBGQCMqm5AXID5A01E5BJzQRk00nVopOqRSdViz75xwCZ1ExqJiA3QG7U3ACZ1ExAbtS8oWYCMqnZdFK16KRq0UnVok/+MWq+Sc0EZFLzhpobIE+o+U0nVYtOqhadVC365MvUfJOaCciNmjeA3ACZ1DwB5G92UrXopGrRSdWiT5YB+U1A3lAzAZnUTEBu1ExANqmZgExqJiCTmm86qVp0UrXopGoR/kjVkpOqRSdVi06qFp1ULTqpWnRSteikatFJ1aKTqkUnVYtOqhadVC06qVp0UrXopGrRf/aDSjS5oQS4AAAAAElFTkSuQmCC', '14b3ddaaaf114c746873bdecd8680ed8', '2025-01-08 14:49:45', '2025-01-08 14:57:32'),
(25, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'reserved', '2025-01-08 14:49:45', NULL, NULL, '2025-01-08 14:49:45', '2025-01-08 14:49:45'),
(26, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'sold', '2025-01-08 14:49:45', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAYAAAB1PADUAAAAAklEQVR4AewaftIAAAT1SURBVO3BQQ4kR5LAQDJQ//8yt4++lwQSFdUaCW5mf7DWJYe1LjqsddFhrYsOa110WOuiw1oXHda66LDWRYe1LjqsddFhrYsOa110WOuiw1oXHda66MOXVP6miicqU8UbKm9UPFF5o2JS+ZsqvnFY66LDWhcd1rrow2UVN6m8UTGpTBU3qUwVTyq+UXGTyk2HtS46rHXRYa2LPvyYyhsVb6hMFW+oPKmYVKaKJxWTylTxDZU3Kn7psNZFh7UuOqx10Yf1/1RMKm+oTBVTxX/ZYa2LDmtddFjrog//MSpTxaTyRsWkMqlMFZPKGxX/Zoe1LjqsddFhrYs+/FjF31QxqUwV36j4RsWk8o2K/yWHtS46rHXRYa2LPlym8m+iMlVMKlPFpDJV/JLK/7LDWhcd1rrosNZFH75U8W9W8UsVTyqeVPybHNa66LDWRYe1LrI/+ILKVDGp3FTxROUbFW+ovFExqUwVk8pNFb90WOuiw1oXHda66MNlKk8qJpWp4g2VqWJSmSomlUnljYo3VKaKNyomlaniDZWp4huHtS46rHXRYa2L7A9+SGWqeENlqphUnlRMKlPFpPKNikllqphUnlRMKjdV3HRY66LDWhcd1rrow2Uqb6hMFVPFTRWTypOKSWWqeFIxqTypmFTeqPgnHda66LDWRYe1Lvrwl6lMFU9UnlRMKk9UpoonKm+oPKmYVCaVqWJSmSomlTcqbjqsddFhrYsOa11kf/BDKk8qvqEyVTxReVLxROWNikllqniiMlVMKlPFE5UnFd84rHXRYa2LDmtd9OHHKiaVN1RuqphU3qh4Q2WqeKLyRGWqmFSeVPzSYa2LDmtddFjrog//MJWpYqp4ojKpTBWTyhsqU8WkMlU8UZkqnlQ8UXlS8Tcd1rrosNZFh7Uu+nCZypOKN1SeVDxReVLxpOJJxaQyVfxSxROVJxU3Hda66LDWRYe1LvrwJZUnFU9UnlS8ofINlTcqpopJ5Y2KSeUbFZPKpDJVfOOw1kWHtS46rHXRh8sqJpWp4g2VJxVTxRsqN6k8qZhUnlQ8UZkqnlT80mGtiw5rXXRY66IP/2Mq3lCZKiaVqWKqmFSmiknlScWk8obKk4qpYlKZKiaVJxXfOKx10WGtiw5rXfThxyqeVEwqb1RMKm+oTBWTyhOVv0nlScWkMlX80mGtiw5rXXRY6yL7g38xlaliUnmj4m9SmSreUJkq3lCZKr5xWOuiw1oXHda66MOXVP6miqliUpkqJpVvqEwVb6i8oTJVvKHypOKmw1oXHda66LDWRR8uq7hJ5YnKVDGpPKl4ojJVvKHyjYpvVEwqv3RY66LDWhcd1rrow4+pvFHxDZWpYlKZVKaKqWJSmSomlaniicqk8g2Vf9JhrYsOa110WOuiD/8xFU8qnqg8qZhUpopJ5UnFGypTxaQyVUwqk8pU8Y3DWhcd1rrosNZFH/5jVN6omComlUllqphUpoo3VJ5UTCpTxaTypOKmw1oXHda66LDWRR9+rOKXKiaVN1TeqHhSMalMFZPKVHFTxaTyS4e1LjqsddFhrYs+XKbyN6lMFU9UpoonKpPKVDGpTBWTylQxqUwVk8oTlScVv3RY66LDWhcd1rrI/mCtSw5rXXRY66LDWhcd1rrosNZFh7UuOqx10WGtiw5rXXRY66LDWhcd1rrosNZFh7UuOqx10f8B0t5TQG1KkpcAAAAASUVORK5CYII=', '6aa33db648c5386daeb71baa18b4fbb0', '2025-01-08 14:49:45', '2025-01-08 15:01:30'),
(27, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'reserved', '2025-01-08 14:49:45', NULL, NULL, '2025-01-08 14:49:45', '2025-01-08 14:49:45'),
(28, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'reserved', '2025-01-08 14:49:46', NULL, NULL, '2025-01-08 14:49:46', '2025-01-08 14:49:46'),
(29, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'reserved', '2025-01-08 14:49:46', NULL, NULL, '2025-01-08 14:49:46', '2025-01-08 14:49:46'),
(30, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'reserved', '2025-01-08 14:49:46', NULL, NULL, '2025-01-08 14:49:46', '2025-01-08 14:49:46'),
(31, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'reserved', '2025-01-08 14:49:46', NULL, NULL, '2025-01-08 14:49:46', '2025-01-08 14:49:46'),
(32, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'reserved', '2025-01-08 14:49:46', NULL, NULL, '2025-01-08 14:49:46', '2025-01-08 14:49:46'),
(33, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'reserved', '2025-01-08 14:49:47', NULL, NULL, '2025-01-08 14:49:47', '2025-01-08 14:49:47'),
(34, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'reserved', '2025-01-08 14:49:47', NULL, NULL, '2025-01-08 14:49:47', '2025-01-08 14:49:47'),
(35, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'reserved', '2025-01-08 14:49:47', NULL, NULL, '2025-01-08 14:49:47', '2025-01-08 14:49:47'),
(36, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'reserved', '2025-01-08 14:49:47', NULL, NULL, '2025-01-08 14:49:47', '2025-01-08 14:49:47'),
(37, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'reserved', '2025-01-08 14:49:47', NULL, NULL, '2025-01-08 14:49:47', '2025-01-08 14:49:47'),
(38, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'reserved', '2025-01-08 14:49:47', NULL, NULL, '2025-01-08 14:49:47', '2025-01-08 14:49:47'),
(39, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'reserved', '2025-01-08 14:49:47', NULL, NULL, '2025-01-08 14:49:47', '2025-01-08 14:49:47'),
(40, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'reserved', '2025-01-08 14:49:47', NULL, NULL, '2025-01-08 14:49:47', '2025-01-08 14:49:47'),
(41, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'reserved', '2025-01-08 14:49:48', NULL, NULL, '2025-01-08 14:49:48', '2025-01-08 14:49:48'),
(42, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'reserved', '2025-01-08 14:49:48', NULL, NULL, '2025-01-08 14:49:48', '2025-01-08 14:49:48'),
(43, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'reserved', '2025-01-08 14:49:48', NULL, NULL, '2025-01-08 14:49:48', '2025-01-08 14:49:48'),
(44, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'reserved', '2025-01-08 14:49:48', NULL, NULL, '2025-01-08 14:49:48', '2025-01-08 14:49:48'),
(45, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'reserved', '2025-01-08 14:49:48', NULL, NULL, '2025-01-08 14:49:48', '2025-01-08 14:49:48'),
(46, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'reserved', '2025-01-08 14:49:48', NULL, NULL, '2025-01-08 14:49:48', '2025-01-08 14:49:48'),
(47, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'reserved', '2025-01-08 14:49:48', NULL, NULL, '2025-01-08 14:49:48', '2025-01-08 14:49:48'),
(48, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'reserved', '2025-01-08 14:49:48', NULL, NULL, '2025-01-08 14:49:48', '2025-01-08 14:49:48'),
(49, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'reserved', '2025-01-08 14:49:48', NULL, NULL, '2025-01-08 14:49:48', '2025-01-08 14:49:48'),
(50, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'reserved', '2025-01-08 14:49:48', NULL, NULL, '2025-01-08 14:49:48', '2025-01-08 14:49:48'),
(51, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'reserved', '2025-01-08 14:49:48', NULL, NULL, '2025-01-08 14:49:48', '2025-01-08 14:49:48'),
(52, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'reserved', '2025-01-08 14:49:49', NULL, NULL, '2025-01-08 14:49:49', '2025-01-08 14:49:49'),
(53, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'reserved', '2025-01-08 14:49:49', NULL, NULL, '2025-01-08 14:49:49', '2025-01-08 14:49:49'),
(54, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'reserved', '2025-01-08 14:49:49', NULL, NULL, '2025-01-08 14:49:49', '2025-01-08 14:49:49'),
(55, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'reserved', '2025-01-08 14:49:49', NULL, NULL, '2025-01-08 14:49:49', '2025-01-08 14:49:49'),
(56, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'reserved', '2025-01-08 14:49:49', NULL, NULL, '2025-01-08 14:49:49', '2025-01-08 14:49:49'),
(57, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'reserved', '2025-01-08 14:49:49', NULL, NULL, '2025-01-08 14:49:49', '2025-01-08 14:49:49'),
(58, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'reserved', '2025-01-08 14:49:49', NULL, NULL, '2025-01-08 14:49:49', '2025-01-08 14:49:49'),
(59, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'reserved', '2025-01-08 14:49:49', NULL, NULL, '2025-01-08 14:49:49', '2025-01-08 14:49:49'),
(60, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'reserved', '2025-01-08 14:49:49', NULL, NULL, '2025-01-08 14:49:49', '2025-01-08 14:49:49'),
(61, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'reserved', '2025-01-08 14:49:50', NULL, NULL, '2025-01-08 14:49:50', '2025-01-08 14:49:50'),
(62, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'reserved', '2025-01-08 14:49:50', NULL, NULL, '2025-01-08 14:49:50', '2025-01-08 14:49:50'),
(63, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'reserved', '2025-01-08 14:49:50', NULL, NULL, '2025-01-08 14:49:50', '2025-01-08 14:49:50'),
(64, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'reserved', '2025-01-08 14:49:50', NULL, NULL, '2025-01-08 14:49:50', '2025-01-08 14:49:50');
INSERT INTO `ticket_solds` (`id`, `buyer_id`, `ticket_id`, `section`, `seat`, `color`, `price`, `status`, `reserved_at`, `qr_code`, `qr_code_token`, `createdAt`, `updatedAt`) VALUES
(65, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'reserved', '2025-01-08 14:49:50', NULL, NULL, '2025-01-08 14:49:50', '2025-01-08 14:49:50'),
(66, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'reserved', '2025-01-08 14:49:50', NULL, NULL, '2025-01-08 14:49:50', '2025-01-08 14:49:50'),
(67, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'reserved', '2025-01-08 14:49:50', NULL, NULL, '2025-01-08 14:49:50', '2025-01-08 14:49:50'),
(68, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'reserved', '2025-01-08 14:49:50', NULL, NULL, '2025-01-08 14:49:50', '2025-01-08 14:49:50'),
(69, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'reserved', '2025-01-08 14:49:50', NULL, NULL, '2025-01-08 14:49:50', '2025-01-08 14:49:50'),
(70, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'reserved', '2025-01-08 14:49:50', NULL, NULL, '2025-01-08 14:49:50', '2025-01-08 14:49:50'),
(71, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'reserved', '2025-01-08 14:49:50', NULL, NULL, '2025-01-08 14:49:50', '2025-01-08 14:49:50'),
(72, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'reserved', '2025-01-08 14:49:50', NULL, NULL, '2025-01-08 14:49:50', '2025-01-08 14:49:50'),
(73, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'reserved', '2025-01-08 14:49:50', NULL, NULL, '2025-01-08 14:49:50', '2025-01-08 14:49:50'),
(74, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'reserved', '2025-01-08 14:49:51', NULL, NULL, '2025-01-08 14:49:51', '2025-01-08 14:49:51'),
(75, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'reserved', '2025-01-08 14:49:51', NULL, NULL, '2025-01-08 14:49:51', '2025-01-08 14:49:51'),
(76, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'reserved', '2025-01-08 14:49:51', NULL, NULL, '2025-01-08 14:49:51', '2025-01-08 14:49:51'),
(77, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'reserved', '2025-01-08 14:49:51', NULL, NULL, '2025-01-08 14:49:51', '2025-01-08 14:49:51'),
(78, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'reserved', '2025-01-08 14:49:51', NULL, NULL, '2025-01-08 14:49:51', '2025-01-08 14:49:51'),
(79, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'reserved', '2025-01-08 14:49:51', NULL, NULL, '2025-01-08 14:49:51', '2025-01-08 14:49:51'),
(80, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'reserved', '2025-01-08 14:49:51', NULL, NULL, '2025-01-08 14:49:51', '2025-01-08 14:49:51'),
(81, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'reserved', '2025-01-08 14:49:51', NULL, NULL, '2025-01-08 14:49:51', '2025-01-08 14:49:51'),
(82, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'reserved', '2025-01-08 14:49:51', NULL, NULL, '2025-01-08 14:49:51', '2025-01-08 14:49:51'),
(83, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'reserved', '2025-01-08 14:49:51', NULL, NULL, '2025-01-08 14:49:51', '2025-01-08 14:49:51'),
(84, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'reserved', '2025-01-08 14:49:51', NULL, NULL, '2025-01-08 14:49:51', '2025-01-08 14:49:51'),
(85, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'reserved', '2025-01-08 14:49:51', NULL, NULL, '2025-01-08 14:49:51', '2025-01-08 14:49:51'),
(86, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'reserved', '2025-01-08 14:49:51', NULL, NULL, '2025-01-08 14:49:51', '2025-01-08 14:49:51'),
(87, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'reserved', '2025-01-08 14:49:51', NULL, NULL, '2025-01-08 14:49:51', '2025-01-08 14:49:51'),
(88, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'reserved', '2025-01-08 14:49:52', NULL, NULL, '2025-01-08 14:49:52', '2025-01-08 14:49:52'),
(89, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'reserved', '2025-01-08 14:49:52', NULL, NULL, '2025-01-08 14:49:52', '2025-01-08 14:49:52'),
(90, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'reserved', '2025-01-08 14:49:52', NULL, NULL, '2025-01-08 14:49:52', '2025-01-08 14:49:52'),
(91, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'reserved', '2025-01-08 14:49:52', NULL, NULL, '2025-01-08 14:49:52', '2025-01-08 14:49:52'),
(92, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'reserved', '2025-01-08 14:49:52', NULL, NULL, '2025-01-08 14:49:52', '2025-01-08 14:49:52'),
(93, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'reserved', '2025-01-08 14:49:52', NULL, NULL, '2025-01-08 14:49:52', '2025-01-08 14:49:52'),
(94, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'reserved', '2025-01-08 14:49:52', NULL, NULL, '2025-01-08 14:49:52', '2025-01-08 14:49:52'),
(95, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'reserved', '2025-01-08 14:49:52', NULL, NULL, '2025-01-08 14:49:52', '2025-01-08 14:49:52'),
(96, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'reserved', '2025-01-08 14:49:52', NULL, NULL, '2025-01-08 14:49:52', '2025-01-08 14:49:52'),
(97, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'reserved', '2025-01-08 14:49:52', NULL, NULL, '2025-01-08 14:49:52', '2025-01-08 14:49:52'),
(98, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'reserved', '2025-01-08 14:49:52', NULL, NULL, '2025-01-08 14:49:52', '2025-01-08 14:49:52'),
(99, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'reserved', '2025-01-08 14:49:52', NULL, NULL, '2025-01-08 14:49:52', '2025-01-08 14:49:52'),
(100, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'reserved', '2025-01-08 14:49:52', NULL, NULL, '2025-01-08 14:49:52', '2025-01-08 14:49:52'),
(101, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'reserved', '2025-01-08 14:49:52', NULL, NULL, '2025-01-08 14:49:52', '2025-01-08 14:49:52'),
(102, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'reserved', '2025-01-08 14:49:52', NULL, NULL, '2025-01-08 14:49:52', '2025-01-08 14:49:52'),
(103, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'reserved', '2025-01-08 14:49:52', NULL, NULL, '2025-01-08 14:49:52', '2025-01-08 14:49:52'),
(104, 1, 5, 'Zone-A', NULL, 'blue', 50.00, 'reserved', '2025-01-08 14:49:52', NULL, NULL, '2025-01-08 14:49:52', '2025-01-08 14:49:52');

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
  `hobbies` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`hobbies`)),
  `gender` enum('Male','Female') DEFAULT 'Male',
  `isVerified` tinyint(1) DEFAULT 0,
  `isApproved` tinyint(1) DEFAULT 0,
  `token` varchar(255) DEFAULT NULL,
  `TokenExpires` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `permissions`, `name`, `email`, `password`, `phone_number`, `birthdate`, `role`, `hobbies`, `gender`, `isVerified`, `isApproved`, `token`, `TokenExpires`, `createdAt`, `updatedAt`) VALUES
(1, '[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19]', 'Fadel hmd7', 'fadel.ahammoud@gmail.com', '$2a$10$e8PhFs7UN6MRI32rGofVy.pVlnMspmID9FcQMwzeIwT05WoQPxRhi', '716969256', '1996-01-20', 'Admin', '[]', 'Male', 1, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6IkFkbWluIiwiaWF0IjoxNzM2MjQ2ODMyLCJleHAiOjE3MzY4NTE2MzJ9.RUbP5PDyo8Dv-G0_sNBzqqqL_f31pJkSRWT3uvujTok', '2025-01-14 10:47:12', '2025-01-07 10:40:03', '2025-01-09 13:50:14'),
(2, '[5]', 'John Doe', 'irada@innoalchemy.business', '$2a$10$sfuWADRQexfSRKcCMjy.0OWgK6h4YiBbSJBaqV/3x4zSV06GB6NBW', '1234567890', '1990-01-01', 'Operator', '[]', 'Male', 1, 1, NULL, NULL, '2025-01-09 13:43:42', '2025-01-09 13:50:20');

-- --------------------------------------------------------

--
-- Table structure for table `views`
--

CREATE TABLE `views` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `blog_id` int(11) DEFAULT NULL,
  `event_id` int(11) DEFAULT NULL,
  `ads_id` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `advertisements`
--
ALTER TABLE `advertisements`
  ADD PRIMARY KEY (`id`),
  ADD KEY `admin_id` (`admin_id`);

--
-- Indexes for table `blogreports`
--
ALTER TABLE `blogreports`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `BlogReports_blog_id_report_id_unique` (`blog_id`,`report_id`),
  ADD KEY `report_id` (`report_id`);

--
-- Indexes for table `blogs`
--
ALTER TABLE `blogs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `blogtags`
--
ALTER TABLE `blogtags`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `BlogTags_blog_id_tag_id_unique` (`blog_id`,`tag_id`),
  ADD KEY `tag_id` (`tag_id`);

--
-- Indexes for table `carts`
--
ALTER TABLE `carts`
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
  ADD KEY `categories` (`categories`);

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
  ADD KEY `event_id` (`event_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `eventreports`
--
ALTER TABLE `eventreports`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `EventReports_event_id_report_id_unique` (`event_id`,`report_id`),
  ADD KEY `report_id` (`report_id`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `organizer_id` (`organizer_id`);

--
-- Indexes for table `eventtags`
--
ALTER TABLE `eventtags`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `EventTags_event_id_tag_id_unique` (`event_id`,`tag_id`),
  ADD KEY `tag_id` (`tag_id`);

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
  ADD KEY `hobbies` (`hobbies`);

--
-- Indexes for table `likes`
--
ALTER TABLE `likes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `blog_id` (`blog_id`);

--
-- Indexes for table `news`
--
ALTER TABLE `news`
  ADD PRIMARY KEY (`id`),
  ADD KEY `admin_id` (`admin_id`);

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
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

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
  ADD KEY `permissions` (`permissions`);

--
-- Indexes for table `productreports`
--
ALTER TABLE `productreports`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ProductReports_product_id_report_id_unique` (`product_id`,`report_id`),
  ADD KEY `report_id` (`report_id`);

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
  ADD KEY `user_id` (`user_id`),
  ADD KEY `blog_id` (`blog_id`),
  ADD KEY `event_id` (`event_id`);

--
-- Indexes for table `producttags`
--
ALTER TABLE `producttags`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ProductTags_product_id_tag_id_unique` (`product_id`,`tag_id`),
  ADD KEY `tag_id` (`tag_id`);

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
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Indexes for table `ratings`
--
ALTER TABLE `ratings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `stocks`
--
ALTER TABLE `stocks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `name_2` (`name`),
  ADD UNIQUE KEY `name_3` (`name`),
  ADD UNIQUE KEY `name_4` (`name`),
  ADD UNIQUE KEY `name_5` (`name`),
  ADD UNIQUE KEY `name_6` (`name`);

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
  ADD UNIQUE KEY `phone_number` (`phone_number`),
  ADD UNIQUE KEY `phone_number_2` (`phone_number`),
  ADD UNIQUE KEY `phone_number_3` (`phone_number`),
  ADD UNIQUE KEY `phone_number_4` (`phone_number`),
  ADD UNIQUE KEY `phone_number_5` (`phone_number`),
  ADD UNIQUE KEY `phone_number_6` (`phone_number`),
  ADD UNIQUE KEY `phone_number_7` (`phone_number`),
  ADD UNIQUE KEY `phone_number_8` (`phone_number`),
  ADD UNIQUE KEY `phone_number_9` (`phone_number`);

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
-- AUTO_INCREMENT for table `advertisements`
--
ALTER TABLE `advertisements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `blogreports`
--
ALTER TABLE `blogreports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `blogs`
--
ALTER TABLE `blogs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `blogtags`
--
ALTER TABLE `blogtags`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `carts`
--
ALTER TABLE `carts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `coupons`
--
ALTER TABLE `coupons`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `eventreports`
--
ALTER TABLE `eventreports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `eventtags`
--
ALTER TABLE `eventtags`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `hobbies`
--
ALTER TABLE `hobbies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `likes`
--
ALTER TABLE `likes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `news`
--
ALTER TABLE `news`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `productreports`
--
ALTER TABLE `productreports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `producttags`
--
ALTER TABLE `producttags`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `product_purchases`
--
ALTER TABLE `product_purchases`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `profile_details`
--
ALTER TABLE `profile_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ratings`
--
ALTER TABLE `ratings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `reports`
--
ALTER TABLE `reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `stocks`
--
ALTER TABLE `stocks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `tags`
--
ALTER TABLE `tags`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tickets`
--
ALTER TABLE `tickets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `ticket_solds`
--
ALTER TABLE `ticket_solds`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=105;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `views`
--
ALTER TABLE `views`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `advertisements`
--
ALTER TABLE `advertisements`
  ADD CONSTRAINT `advertisements_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `advertisements_ibfk_2` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `advertisements_ibfk_3` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `advertisements_ibfk_4` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `advertisements_ibfk_5` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `advertisements_ibfk_6` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `blogreports`
--
ALTER TABLE `blogreports`
  ADD CONSTRAINT `blogreports_ibfk_1` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `blogreports_ibfk_10` FOREIGN KEY (`report_id`) REFERENCES `reports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `blogreports_ibfk_11` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `blogreports_ibfk_12` FOREIGN KEY (`report_id`) REFERENCES `reports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `blogreports_ibfk_2` FOREIGN KEY (`report_id`) REFERENCES `reports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `blogreports_ibfk_3` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `blogreports_ibfk_4` FOREIGN KEY (`report_id`) REFERENCES `reports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `blogreports_ibfk_5` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `blogreports_ibfk_6` FOREIGN KEY (`report_id`) REFERENCES `reports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `blogreports_ibfk_7` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `blogreports_ibfk_8` FOREIGN KEY (`report_id`) REFERENCES `reports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `blogreports_ibfk_9` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `blogs`
--
ALTER TABLE `blogs`
  ADD CONSTRAINT `blogs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `blogs_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `blogs_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `blogs_ibfk_4` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `blogs_ibfk_5` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `blogs_ibfk_6` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `blogs_ibfk_7` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `blogs_ibfk_8` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `blogtags`
--
ALTER TABLE `blogtags`
  ADD CONSTRAINT `blogtags_ibfk_1` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `blogtags_ibfk_10` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `blogtags_ibfk_11` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `blogtags_ibfk_12` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `blogtags_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `blogtags_ibfk_3` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `blogtags_ibfk_4` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `blogtags_ibfk_5` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `blogtags_ibfk_6` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `blogtags_ibfk_7` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `blogtags_ibfk_8` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `blogtags_ibfk_9` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `carts`
--
ALTER TABLE `carts`
  ADD CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`categories`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `categories_ibfk_2` FOREIGN KEY (`categories`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `categories_ibfk_3` FOREIGN KEY (`categories`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `categories_ibfk_4` FOREIGN KEY (`categories`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `categories_ibfk_5` FOREIGN KEY (`categories`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `categories_ibfk_6` FOREIGN KEY (`categories`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `categories_ibfk_7` FOREIGN KEY (`categories`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `categories_ibfk_8` FOREIGN KEY (`categories`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

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
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comments_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
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
  ADD CONSTRAINT `coupons_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `coupons_ibfk_4` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `coupons_ibfk_5` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `coupons_ibfk_6` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `coupons_ibfk_7` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `coupons_ibfk_8` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `coupons_ibfk_9` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `eventreports`
--
ALTER TABLE `eventreports`
  ADD CONSTRAINT `eventreports_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `eventreports_ibfk_10` FOREIGN KEY (`report_id`) REFERENCES `reports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `eventreports_ibfk_11` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `eventreports_ibfk_12` FOREIGN KEY (`report_id`) REFERENCES `reports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `eventreports_ibfk_2` FOREIGN KEY (`report_id`) REFERENCES `reports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `eventreports_ibfk_3` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `eventreports_ibfk_4` FOREIGN KEY (`report_id`) REFERENCES `reports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `eventreports_ibfk_5` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `eventreports_ibfk_6` FOREIGN KEY (`report_id`) REFERENCES `reports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `eventreports_ibfk_7` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `eventreports_ibfk_8` FOREIGN KEY (`report_id`) REFERENCES `reports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `eventreports_ibfk_9` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `events_ibfk_1` FOREIGN KEY (`organizer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `events_ibfk_2` FOREIGN KEY (`organizer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `events_ibfk_3` FOREIGN KEY (`organizer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `events_ibfk_4` FOREIGN KEY (`organizer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `events_ibfk_5` FOREIGN KEY (`organizer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `events_ibfk_6` FOREIGN KEY (`organizer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `events_ibfk_7` FOREIGN KEY (`organizer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `events_ibfk_8` FOREIGN KEY (`organizer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `events_ibfk_9` FOREIGN KEY (`organizer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `eventtags`
--
ALTER TABLE `eventtags`
  ADD CONSTRAINT `eventtags_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `eventtags_ibfk_10` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `eventtags_ibfk_11` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `eventtags_ibfk_12` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `eventtags_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `eventtags_ibfk_3` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `eventtags_ibfk_4` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `eventtags_ibfk_5` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `eventtags_ibfk_6` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `eventtags_ibfk_7` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `eventtags_ibfk_8` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `eventtags_ibfk_9` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

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
  ADD CONSTRAINT `hobbies_ibfk_7` FOREIGN KEY (`hobbies`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `hobbies_ibfk_8` FOREIGN KEY (`hobbies`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

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
  ADD CONSTRAINT `likes_ibfk_2` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `likes_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `likes_ibfk_4` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `likes_ibfk_5` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `likes_ibfk_6` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `likes_ibfk_7` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `likes_ibfk_8` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `likes_ibfk_9` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `news`
--
ALTER TABLE `news`
  ADD CONSTRAINT `news_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `news_ibfk_2` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `news_ibfk_3` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `news_ibfk_4` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `news_ibfk_5` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `news_ibfk_6` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `news_ibfk_7` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

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
  ADD CONSTRAINT `notifications_ibfk_17` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_18` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_19` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_20` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_21` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_22` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_23` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_24` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_25` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_26` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_27` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_28` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_3` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_4` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_5` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_6` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_7` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_8` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_9` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD CONSTRAINT `password_reset_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `password_reset_tokens_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `password_reset_tokens_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `password_reset_tokens_ibfk_4` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `password_reset_tokens_ibfk_5` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `password_reset_tokens_ibfk_6` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `permissions`
--
ALTER TABLE `permissions`
  ADD CONSTRAINT `permissions_ibfk_1` FOREIGN KEY (`permissions`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `permissions_ibfk_2` FOREIGN KEY (`permissions`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `permissions_ibfk_3` FOREIGN KEY (`permissions`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `permissions_ibfk_4` FOREIGN KEY (`permissions`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `permissions_ibfk_5` FOREIGN KEY (`permissions`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `permissions_ibfk_6` FOREIGN KEY (`permissions`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `permissions_ibfk_7` FOREIGN KEY (`permissions`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `permissions_ibfk_8` FOREIGN KEY (`permissions`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `productreports`
--
ALTER TABLE `productreports`
  ADD CONSTRAINT `productreports_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `productreports_ibfk_10` FOREIGN KEY (`report_id`) REFERENCES `reports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `productreports_ibfk_11` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `productreports_ibfk_12` FOREIGN KEY (`report_id`) REFERENCES `reports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `productreports_ibfk_2` FOREIGN KEY (`report_id`) REFERENCES `reports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `productreports_ibfk_3` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `productreports_ibfk_4` FOREIGN KEY (`report_id`) REFERENCES `reports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `productreports_ibfk_5` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `productreports_ibfk_6` FOREIGN KEY (`report_id`) REFERENCES `reports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `productreports_ibfk_7` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `productreports_ibfk_8` FOREIGN KEY (`report_id`) REFERENCES `reports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `productreports_ibfk_9` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `products_ibfk_10` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `products_ibfk_11` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `products_ibfk_12` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `products_ibfk_13` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `products_ibfk_14` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `products_ibfk_15` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `products_ibfk_16` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `products_ibfk_17` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `products_ibfk_18` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `products_ibfk_19` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `products_ibfk_2` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `products_ibfk_20` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `products_ibfk_21` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `products_ibfk_22` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `products_ibfk_23` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `products_ibfk_24` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `products_ibfk_3` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `products_ibfk_4` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `products_ibfk_5` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `products_ibfk_6` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `products_ibfk_7` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `products_ibfk_8` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `products_ibfk_9` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `producttags`
--
ALTER TABLE `producttags`
  ADD CONSTRAINT `producttags_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `producttags_ibfk_10` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `producttags_ibfk_11` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `producttags_ibfk_12` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `producttags_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `producttags_ibfk_3` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `producttags_ibfk_4` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `producttags_ibfk_5` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `producttags_ibfk_6` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `producttags_ibfk_7` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `producttags_ibfk_8` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `producttags_ibfk_9` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

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
  ADD CONSTRAINT `profile_details_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `profile_details_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `profile_details_ibfk_4` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `profile_details_ibfk_5` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `profile_details_ibfk_6` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `profile_details_ibfk_7` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `profile_details_ibfk_8` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `ratings`
--
ALTER TABLE `ratings`
  ADD CONSTRAINT `ratings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ratings_ibfk_10` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ratings_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ratings_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ratings_ibfk_4` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ratings_ibfk_5` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ratings_ibfk_6` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ratings_ibfk_7` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ratings_ibfk_8` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ratings_ibfk_9` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `stocks`
--
ALTER TABLE `stocks`
  ADD CONSTRAINT `stocks_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `stocks_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `stocks_ibfk_3` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `stocks_ibfk_4` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `stocks_ibfk_5` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `stocks_ibfk_6` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tickets`
--
ALTER TABLE `tickets`
  ADD CONSTRAINT `tickets_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tickets_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tickets_ibfk_3` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tickets_ibfk_4` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tickets_ibfk_5` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tickets_ibfk_6` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tickets_ibfk_7` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tickets_ibfk_8` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `ticket_solds`
--
ALTER TABLE `ticket_solds`
  ADD CONSTRAINT `ticket_solds_ibfk_1` FOREIGN KEY (`buyer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ticket_solds_ibfk_10` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ticket_solds_ibfk_11` FOREIGN KEY (`buyer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ticket_solds_ibfk_12` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ticket_solds_ibfk_13` FOREIGN KEY (`buyer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ticket_solds_ibfk_14` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ticket_solds_ibfk_2` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ticket_solds_ibfk_3` FOREIGN KEY (`buyer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ticket_solds_ibfk_4` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ticket_solds_ibfk_5` FOREIGN KEY (`buyer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ticket_solds_ibfk_6` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ticket_solds_ibfk_7` FOREIGN KEY (`buyer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ticket_solds_ibfk_8` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ticket_solds_ibfk_9` FOREIGN KEY (`buyer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `views`
--
ALTER TABLE `views`
  ADD CONSTRAINT `views_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `views_ibfk_10` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `views_ibfk_11` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `views_ibfk_12` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `views_ibfk_13` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `views_ibfk_14` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `views_ibfk_15` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `views_ibfk_2` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
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
