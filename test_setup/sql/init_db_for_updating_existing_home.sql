LOCK TABLES `AB_CARS_CARsProject` WRITE;
INSERT INTO `AB_CARS_CARsProject` (`uuid`, `created_at`, `updated_at`, `translations`) VALUES ("cb46b6b4-dc25-4915-80f7-c1febf26da4a", "2021-09-20 06:25:36", "2021-09-20 06:25:36", "[{\"language_code\":\"en\",\"Name\":\"CARS Project 1\"}]");
UNLOCK TABLES;
LOCK TABLES `AB_CARS_Staff` WRITE;
INSERT INTO `AB_CARS_Staff` (`uuid`, `created_at`, `updated_at`, `translations`, `Phone`, `CARs Project512`, `Staff User`) VALUES ("e746f80b-3fbe-4aeb-9fdf-2707740eeaca", "2021-09-20 07:08:59", "2021-09-20 07:08:59", "[{\"language_code\":\"en\",\"Position\":\"Director\",\"First Name\":\"John\",\"Last Name\":\"Lennon\"}]", "0899999999", "cb46b6b4-dc25-4915-80f7-c1febf26da4a", "admin");
UNLOCK TABLES;
LOCK TABLES `AB_CARS_Address` WRITE;
INSERT INTO `AB_CARS_Address` (`uuid`, `created_at`, `updated_at`, `translations`, `Type`, `Postal Code`, `Address No`, `Moo`) VALUES ("cb46b6b4-dc25-4915-80f7-c1febf26da4a", "2021-09-20 06:33:44", "2021-09-20 06:33:44", "[{\"language_code\":\"en\",\"District\":\"Mueang Chiang Mai\",\"City\":\"Suthep\",\"Province\":\"Chiang Mai\"}]", "1507575935373", "50000", "123/4", '1');
UNLOCK TABLES;
LOCK TABLES `AB_CARS_ChildrenHome` WRITE;
INSERT INTO `AB_CARS_ChildrenHome` (`uuid`, `created_at`, `updated_at`, `translations`, `Home Name`, `Address`, `CARs Project500`) VALUES ("696cfe80-8a3e-477f-a566-3c14dac1cc2d", "2021-09-20 07:01:30", "2021-09-20 07:01:30", "[{\"language_code\":\"en\",\"Director\":\"John Lennon\",\"Social Worker\":\"Chris Martin\",\"Phone Number\":\"\"}]", "Home 1", "cb46b6b4-dc25-4915-80f7-c1febf26da4a", "cb46b6b4-dc25-4915-80f7-c1febf26da4a");
UNLOCK TABLES;
LOCK TABLES `AB_CARS_ContactInfo` WRITE;
INSERT INTO `AB_CARS_ContactInfo` (`uuid`, `created_at`, `updated_at`, `Home Phone`, `Line ID`, `Facebook ID`, `Mobile Phone`, `Email`) VALUES ("c58fc0e3-d3a7-4616-a701-ded0536f8b77", "2021-09-20 09:23:22", "2021-09-20 09:23:22", "053123456", "taylorswift", "1234567890123456", "0801234567", "taylor_swift@email.com");
UNLOCK TABLES;
LOCK TABLES `AB_CARS_Relatives` WRITE;
INSERT INTO `AB_CARS_Relatives` (`uuid`, `created_at`, `updated_at`, `translations`, `Relation Type`) VALUES ("c58fc0e3-d3a7-4616-a701-ded0536f8b77", "2021-09-20 09:23:22", "2021-09-20 09:23:22", "[{\"language_code\":\"en\",\"First Name\":\"Taylor\",\"Last Name\":\"Swift\",\"Location\":\"\",\"Notes\":\"\"}]", "1565164147815");
UNLOCK TABLES;
LOCK TABLES `AB_JOINMN_Staff_CARs Project_CARsProject` WRITE;
INSERT INTO `AB_JOINMN_Staff_CARs Project_CARsProject` (`id`, `CARs Project`, `Staff`) VALUES (1, "cb46b6b4-dc25-4915-80f7-c1febf26da4a", "e746f80b-3fbe-4aeb-9fdf-2707740eeaca");
UNLOCK TABLES;
LOCK TABLES `AB_JOINMN_Staff_Children Home_Home` WRITE;
INSERT INTO `AB_JOINMN_Staff_Children Home_Home` (`id`, `Children Home`, `Staff`) VALUES (1, "696cfe80-8a3e-477f-a566-3c14dac1cc2d", "e746f80b-3fbe-4aeb-9fdf-2707740eeaca");
UNLOCK TABLES;