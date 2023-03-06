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
INSERT INTO `AB_CARS_ChildrenHome` (`uuid`, `created_at`, `updated_at`, `translations`, `Home Name`, `Address`, `CARs Project500`) VALUES ("696cfe80-8a3e-477f-a566-3c14dac1cc2d", "2021-09-20 07:01:30", "2021-09-20 07:01:30", "[{\"language_code\":\"en\",\"Director\":\"John Lennon\",\"Social Worker\":\"Chris Martin\",\"Phone Number\":\"0812345678\"}]", "Home 1", "cb46b6b4-dc25-4915-80f7-c1febf26da4a", "cb46b6b4-dc25-4915-80f7-c1febf26da4a");
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

LOCK TABLES `AB_CARS_Children` WRITE;
INSERT INTO `AB_CARS_Children` (`uuid`, `created_at`, `updated_at`, `properties`, `translations`, `Gender`, `No`, `Religion`, `Birthday`, `ID Number`, `ID Issue Date`, `Profile Photo`, `Fingerprintss`, `Type Received`, `ID Expire Date`, `First Name`, `Last Name`, `Home`, `Address`, `CARs Project20`) 
VALUES ("0e41a300-4698-40c8-9c5f-f96ea2ceadf6", "2021-10-01 09:44:00", "2021-10-01 09:44:00", NULL, "[{\"language_code\":\"en\",\"Nickname\":\"Sato\",\"Race\":\"Human\",\"Nationality\":\"Japanese\",\"Time Received for\":\"05/04/1975 17:00 PM\"}]", "1507525545560", '1', "1507525546158", "1975-04-05", NULL, NULL, NULL, NULL, "1555919727844", NULL, "Satoshi", "Nakamoto", "696cfe80-8a3e-477f-a566-3c14dac1cc2d", NULL, "cb46b6b4-dc25-4915-80f7-c1febf26da4a"),
 ("0e41a300-4698-40c8-9c5f-f96ea2ceadf4", "2021-10-01 09:44:00", "2021-10-01 09:44:00", NULL, "[{\"language_code\":\"en\",\"Nickname\":\"Ant\",\"Race\":\"Human\",\"Nationality\":\"Welsh\",\"Time Received for\":\"31/12/1937 18:00 PM\"}]", "1507525545560", '2', "1507525546012", "1937-12-31", NULL, NULL, NULL, NULL, "1555919727884", NULL, "Anthony", "Hopkins", "696cfe80-8a3e-477f-a566-3c14dac1cc2d", NULL, "cb46b6b4-dc25-4915-80f7-c1febf26da4a"),
 ("0e41a300-4698-40c8-9c5f-f96ea2ceadf2", "2021-10-01 09:44:00", "2021-10-01 09:44:00", NULL, "[{\"language_code\":\"en\",\"Nickname\":\"Brit\",\"Race\":\"Human\",\"Nationality\":\"American\",\"Time Received for\":\"02/12/1981 19:00 PM\"}]", "1507525545633", '3', "1507525546012", "1981-12-02", NULL, NULL, NULL, NULL, "1555919727884", NULL, "Britney", "Spears", "696cfe80-8a3e-477f-a566-3c14dac1cc2d", NULL, "cb46b6b4-dc25-4915-80f7-c1febf26da4a");
UNLOCK TABLES;

LOCK TABLES `AB_CARS_AssetsLog` WRITE;
INSERT INTO `AB_CARS_AssetsLog` (`uuid`, `created_at`, `updated_at`, `properties`, `Date`, `translations`, `Photo`, `Children`)
VALUES ('cc0567e9-844e-4527-899e-fbfd7eef39ec', '2022-06-21 07:17:48', '2022-06-21 07:17:48', NULL, '2022-06-21', '[{\"language_code\":\"en\",\"Asset Description\":\"no item reported\"}]', NULL, '0e41a300-4698-40c8-9c5f-f96ea2ceadf6');
UNLOCK TABLES;

LOCK TABLES `AB_CARS_AdmissionInfo` WRITE;
INSERT INTO `AB_CARS_AdmissionInfo` (`uuid`, `created_at`, `updated_at`, `Reg Date`, `translations`, `Child`, `Recipient Staff`, `Initial Assets`)
VALUES ('48e72e6d-4baa-4a5a-9e22-330994b677ba', '2022-06-21 07:18:40', '2022-06-21 07:18:40', '2022-06-21', '[{\"language_code\":\"en\",\"Submitter Name\":\"\",\"Reason Received\":\"from sql data\"}]', 
'0e41a300-4698-40c8-9c5f-f96ea2ceadf6', 'e746f80b-3fbe-4aeb-9fdf-2707740eeaca', 'cc0567e9-844e-4527-899e-fbfd7eef39ec');
UNLOCK TABLES;
