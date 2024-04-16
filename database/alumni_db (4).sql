-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 10, 2024 at 02:06 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `alumni_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `alumni`
--

CREATE TABLE `alumni` (
  `alumni_id` int(11) NOT NULL,
  `alumni_name` varchar(100) DEFAULT NULL,
  `alumni_surname` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(60) DEFAULT NULL,
  `mobileNo` varchar(12) NOT NULL,
  `role` varchar(20) NOT NULL,
  `verified` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `alumni`
--

INSERT INTO `alumni` (`alumni_id`, `alumni_name`, `alumni_surname`, `email`, `password`, `mobileNo`, `role`, `verified`) VALUES
(1, 'Dipono', 'Manasoe', 'joel.manasoe@gmail.com', '123zxc', '0123456789', 'alumni', 0),
(2, 'Gift', 'Mukwevho', 'mukwevho@gmail.com', '123zxc', '0147852369', 'alumni', 0),
(3, 'James', 'Scott', 'admin@email.com', '123zxc', '0125478963', 'director', 0),
(7, 'Dipono', 'Manasoe', 'lebute97@gmail.com', 'Z123zxc@', '0123456789', 'alumni', 1);

-- --------------------------------------------------------

--
-- Table structure for table `alumni_event`
--

CREATE TABLE `alumni_event` (
  `alumni_event_id` int(11) NOT NULL,
  `isAttend` tinyint(1) DEFAULT NULL,
  `isDonated` tinyint(1) DEFAULT NULL,
  `event_id` int(11) DEFAULT NULL,
  `alumni_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `alumni_event`
--

INSERT INTO `alumni_event` (`alumni_event_id`, `isAttend`, `isDonated`, `event_id`, `alumni_id`) VALUES
(1, 1, 1, 1, 1),
(3, 1, 1, 3, 2);

-- --------------------------------------------------------

--
-- Table structure for table `director`
--

CREATE TABLE `director` (
  `dir_id` int(11) NOT NULL,
  `dir_name` varchar(100) DEFAULT NULL,
  `dir_surname` varchar(100) DEFAULT NULL,
  `dir_email` varchar(200) NOT NULL,
  `dir_password` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `director`
--

INSERT INTO `director` (`dir_id`, `dir_name`, `dir_surname`, `dir_email`, `dir_password`) VALUES
(1, 'James', 'Scott', 'scott@email.com', '123zxc');

-- --------------------------------------------------------

--
-- Table structure for table `employment`
--

CREATE TABLE `employment` (
  `employment_id` int(11) NOT NULL,
  `company_name` varchar(200) DEFAULT NULL,
  `company_role` varchar(200) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `userprofile_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employment`
--

INSERT INTO `employment` (`employment_id`, `company_name`, `company_role`, `start_date`, `end_date`, `userprofile_id`) VALUES
(1, 'ICEP', 'Intern Dev', '2020-02-25', '2020-12-15', 3);

-- --------------------------------------------------------

--
-- Table structure for table `event_poster`
--

CREATE TABLE `event_poster` (
  `event_id` int(11) NOT NULL,
  `eventName` varchar(200) DEFAULT NULL,
  `organization` varchar(200) DEFAULT NULL,
  `image` varchar(100) DEFAULT NULL,
  `donationFee` double DEFAULT NULL,
  `description` varchar(500) DEFAULT NULL,
  `venue` varchar(255) DEFAULT NULL,
  `startdate` datetime DEFAULT NULL,
  `endDate` datetime DEFAULT NULL,
  `dir_id` int(11) DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `event_poster`
--

INSERT INTO `event_poster` (`event_id`, `eventName`, `organization`, `image`, `donationFee`, `description`, `venue`, `startdate`, `endDate`, `dir_id`, `is_deleted`) VALUES
(1, 'Amazon', 'TUT', 'Screenshot (34).png', 0, 'AWS holds events, both online and in-person, bringing the cloud computing community together to connect, collaborate, and learn from AWS experts', 'online, cape town', '2024-03-23 14:00:00', '2024-03-22 17:00:00', NULL, 0),
(3, 'TVH', 'ICEP', '20220105_144850.jpg', 200, 'an event, typically lasting several days, where people come together to collaborate in order to solve a problem or identify new opportunities.', '976 Arcadia St, Arcadia, Pretoria, 0007, B1-121', '2024-03-20 14:00:00', '2024-03-22 14:00:00', NULL, 0),
(4, 'Group Therapy Intervention', 'TUT', 'SDS Lets Talk_Poster 2024.jpg', 0, 'Let\'s talk. Feeling, Struggling, Experience and Recovery', 'Pretoria campus: Building 6, Room 361 (Hlanganani)', '2024-04-16 09:00:00', '2024-04-16 14:00:00', NULL, 0),
(5, 'SAED: First-Year Open Days', 'TUT', 'SAED_Open Days.jpg', 0, 'Fun outdoor activities', 'Soshanguve', '2024-04-19 10:30:00', '2024-04-19 15:00:00', NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `interest`
--

CREATE TABLE `interest` (
  `interest_id` int(11) NOT NULL,
  `interest_name` varchar(100) DEFAULT NULL,
  `userprofile_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `interest`
--

INSERT INTO `interest` (`interest_id`, `interest_name`, `userprofile_id`) VALUES
(4, 'code', 3),
(5, 'music', 3),
(6, 'movie', 3),
(7, 'Reading Books', 4),
(8, 'Coding', 4);

-- --------------------------------------------------------

--
-- Table structure for table `otp`
--

CREATE TABLE `otp` (
  `otp_id` int(11) NOT NULL,
  `otp_number` varchar(7) DEFAULT NULL,
  `date_expire` datetime DEFAULT NULL,
  `is_expired` tinyint(1) DEFAULT NULL,
  `alumni_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `otp`
--

INSERT INTO `otp` (`otp_id`, `otp_number`, `date_expire`, `is_expired`, `alumni_id`) VALUES
(8, '637393', '2024-04-10 03:07:44', 1, 7);

-- --------------------------------------------------------

--
-- Table structure for table `qualification`
--

CREATE TABLE `qualification` (
  `qualification_id` int(11) NOT NULL,
  `institution_name` varchar(150) NOT NULL,
  `qualification_type` varchar(200) NOT NULL,
  `qualification_name` varchar(200) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `userprofile_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `qualification`
--

INSERT INTO `qualification` (`qualification_id`, `institution_name`, `qualification_type`, `qualification_name`, `start_date`, `end_date`, `userprofile_id`) VALUES
(1, '', 'National Diploma', 'Foundation PhaseTeaching 1', '2017-02-25', '2019-12-15', 3);

-- --------------------------------------------------------

--
-- Table structure for table `userprofile`
--

CREATE TABLE `userprofile` (
  `userprofile_id` int(11) NOT NULL,
  `location` varchar(100) DEFAULT NULL,
  `bio` varchar(255) DEFAULT NULL,
  `profile_pic` varchar(100) DEFAULT NULL,
  `alumni_id` int(11) DEFAULT NULL,
  `complete_profile` tinyint(1) NOT NULL,
  `company` varchar(150) NOT NULL,
  `position` varchar(150) NOT NULL,
  `employ_type` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `userprofile`
--

INSERT INTO `userprofile` (`userprofile_id`, `location`, `bio`, `profile_pic`, `alumni_id`, `complete_profile`, `company`, `position`, `employ_type`) VALUES
(3, 'Sosha', 'done my diploma 2017', 'community4.jpg', 3, 0, '', '', ''),
(4, 'pretoria', 'matric', 'IMG-20230620-WA0020.jpg', 1, 0, '', '', '');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `alumni`
--
ALTER TABLE `alumni`
  ADD PRIMARY KEY (`alumni_id`);

--
-- Indexes for table `alumni_event`
--
ALTER TABLE `alumni_event`
  ADD PRIMARY KEY (`alumni_event_id`),
  ADD KEY `event_id` (`event_id`),
  ADD KEY `alumni_id` (`alumni_id`);

--
-- Indexes for table `director`
--
ALTER TABLE `director`
  ADD PRIMARY KEY (`dir_id`);

--
-- Indexes for table `employment`
--
ALTER TABLE `employment`
  ADD PRIMARY KEY (`employment_id`),
  ADD KEY `userprofile_id` (`userprofile_id`);

--
-- Indexes for table `event_poster`
--
ALTER TABLE `event_poster`
  ADD PRIMARY KEY (`event_id`),
  ADD KEY `dir_id` (`dir_id`);

--
-- Indexes for table `interest`
--
ALTER TABLE `interest`
  ADD PRIMARY KEY (`interest_id`),
  ADD KEY `userprofile_id` (`userprofile_id`);

--
-- Indexes for table `otp`
--
ALTER TABLE `otp`
  ADD PRIMARY KEY (`otp_id`),
  ADD KEY `alumni_id` (`alumni_id`);

--
-- Indexes for table `qualification`
--
ALTER TABLE `qualification`
  ADD PRIMARY KEY (`qualification_id`),
  ADD KEY `userprofile_id` (`userprofile_id`);

--
-- Indexes for table `userprofile`
--
ALTER TABLE `userprofile`
  ADD PRIMARY KEY (`userprofile_id`),
  ADD KEY `alumni_id` (`alumni_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `alumni`
--
ALTER TABLE `alumni`
  MODIFY `alumni_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `alumni_event`
--
ALTER TABLE `alumni_event`
  MODIFY `alumni_event_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `director`
--
ALTER TABLE `director`
  MODIFY `dir_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `employment`
--
ALTER TABLE `employment`
  MODIFY `employment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `event_poster`
--
ALTER TABLE `event_poster`
  MODIFY `event_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `interest`
--
ALTER TABLE `interest`
  MODIFY `interest_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `otp`
--
ALTER TABLE `otp`
  MODIFY `otp_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `qualification`
--
ALTER TABLE `qualification`
  MODIFY `qualification_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `userprofile`
--
ALTER TABLE `userprofile`
  MODIFY `userprofile_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `alumni_event`
--
ALTER TABLE `alumni_event`
  ADD CONSTRAINT `alumni_event_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `event_poster` (`event_id`),
  ADD CONSTRAINT `alumni_event_ibfk_2` FOREIGN KEY (`alumni_id`) REFERENCES `alumni` (`alumni_id`);

--
-- Constraints for table `employment`
--
ALTER TABLE `employment`
  ADD CONSTRAINT `employment_ibfk_1` FOREIGN KEY (`userprofile_id`) REFERENCES `userprofile` (`userprofile_id`);

--
-- Constraints for table `event_poster`
--
ALTER TABLE `event_poster`
  ADD CONSTRAINT `event_poster_ibfk_1` FOREIGN KEY (`dir_id`) REFERENCES `director` (`dir_id`);

--
-- Constraints for table `interest`
--
ALTER TABLE `interest`
  ADD CONSTRAINT `interest_ibfk_1` FOREIGN KEY (`userprofile_id`) REFERENCES `userprofile` (`userprofile_id`);

--
-- Constraints for table `otp`
--
ALTER TABLE `otp`
  ADD CONSTRAINT `otp_ibfk_1` FOREIGN KEY (`alumni_id`) REFERENCES `alumni` (`alumni_id`);

--
-- Constraints for table `qualification`
--
ALTER TABLE `qualification`
  ADD CONSTRAINT `qualification_ibfk_1` FOREIGN KEY (`userprofile_id`) REFERENCES `userprofile` (`userprofile_id`);

--
-- Constraints for table `userprofile`
--
ALTER TABLE `userprofile`
  ADD CONSTRAINT `userprofile_ibfk_1` FOREIGN KEY (`alumni_id`) REFERENCES `alumni` (`alumni_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
