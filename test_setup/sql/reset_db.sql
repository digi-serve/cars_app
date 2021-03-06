SET FOREIGN_KEY_CHECKS = 0;
LOCK TABLES `AB_CARS_AcademicYear` WRITE;
TRUNCATE TABLE `AB_CARS_AcademicYear`;
UNLOCK TABLES;
LOCK TABLES `AB_CARS_Address` WRITE;
TRUNCATE TABLE `AB_CARS_Address`;
UNLOCK TABLES;
LOCK TABLES `AB_CARS_AdmissionInfo` WRITE;
TRUNCATE TABLE `AB_CARS_AdmissionInfo`;
UNLOCK TABLES;
LOCK TABLES `AB_CARS_AssetsLog` WRITE;
TRUNCATE TABLE `AB_CARS_AssetsLog`;
UNLOCK TABLES;
LOCK TABLES `AB_CARS_BasicHealthInfo` WRITE;
TRUNCATE TABLE `AB_CARS_BasicHealthInfo`;
UNLOCK TABLES;
LOCK TABLES `AB_CARS_BehaviorLog` WRITE;
TRUNCATE TABLE `AB_CARS_BehaviorLog`;
UNLOCK TABLES;
LOCK TABLES `AB_CARS_CARsProject` WRITE;
TRUNCATE TABLE `AB_CARS_CARsProject`;
UNLOCK TABLES;
LOCK TABLES `AB_CARS_CareerInfo` WRITE;
TRUNCATE TABLE `AB_CARS_CareerInfo`;
UNLOCK TABLES;
LOCK TABLES `AB_CARS_ChildDocuments` WRITE;
TRUNCATE TABLE `AB_CARS_ChildDocuments`;
UNLOCK TABLES;
LOCK TABLES `AB_CARS_Children` WRITE;
TRUNCATE TABLE `AB_CARS_Children`;
UNLOCK TABLES;
LOCK TABLES `AB_CARS_ChildrenHome` WRITE;
TRUNCATE TABLE `AB_CARS_ChildrenHome`;
UNLOCK TABLES;
LOCK TABLES `AB_CARS_ContactInfo` WRITE;
TRUNCATE TABLE `AB_CARS_ContactInfo`;
UNLOCK TABLES;
LOCK TABLES `AB_CARS_ContactingAgencies` WRITE;
TRUNCATE TABLE `AB_CARS_ContactingAgencies`;
UNLOCK TABLES;
LOCK TABLES `AB_CARS_DevelopmentLog` WRITE;
TRUNCATE TABLE `AB_CARS_DevelopmentLog`;
UNLOCK TABLES;
LOCK TABLES `AB_CARS_EducationInfo` WRITE;
TRUNCATE TABLE `AB_CARS_EducationInfo`;
UNLOCK TABLES;
LOCK TABLES `AB_CARS_ExitPlacementInfo` WRITE;
TRUNCATE TABLE `AB_CARS_ExitPlacementInfo`;
UNLOCK TABLES;
LOCK TABLES `AB_CARS_Fact` WRITE;
TRUNCATE TABLE `AB_CARS_Fact`;
UNLOCK TABLES;
LOCK TABLES `AB_CARS_FamilyAssessment` WRITE;
TRUNCATE TABLE `AB_CARS_FamilyAssessment`;
UNLOCK TABLES;
LOCK TABLES `AB_CARS_FamilyMembers` WRITE;
TRUNCATE TABLE `AB_CARS_FamilyMembers`;
UNLOCK TABLES;
LOCK TABLES `AB_CARS_File` WRITE;
TRUNCATE TABLE `AB_CARS_File`;
UNLOCK TABLES;
LOCK TABLES `AB_CARS_GeneralCourses` WRITE;
TRUNCATE TABLE `AB_CARS_GeneralCourses`;
UNLOCK TABLES;
LOCK TABLES `AB_CARS_GrowthLogs` WRITE;
TRUNCATE TABLE `AB_CARS_GrowthLogs`;
UNLOCK TABLES;
LOCK TABLES `AB_CARS_HomeVisitObserv` WRITE;
TRUNCATE TABLE `AB_CARS_HomeVisitObserv`;
UNLOCK TABLES;
LOCK TABLES `AB_CARS_LifePlan` WRITE;
TRUNCATE TABLE `AB_CARS_LifePlan`;
UNLOCK TABLES;
LOCK TABLES `AB_CARS_LifePlanActions` WRITE;
TRUNCATE TABLE `AB_CARS_LifePlanActions`;
UNLOCK TABLES;
LOCK TABLES `AB_CARS_MedicalRecord` WRITE;
TRUNCATE TABLE `AB_CARS_MedicalRecord`;
UNLOCK TABLES;
LOCK TABLES `AB_CARS_Notes` WRITE;
TRUNCATE TABLE `AB_CARS_Notes`;
UNLOCK TABLES;
LOCK TABLES `AB_CARS_NotesCategories` WRITE;
TRUNCATE TABLE `AB_CARS_NotesCategories`;
UNLOCK TABLES;
LOCK TABLES `AB_CARS_ParticipationLog` WRITE;
TRUNCATE TABLE `AB_CARS_ParticipationLog`;
UNLOCK TABLES;
LOCK TABLES `AB_CARS_PhysicalDetails` WRITE;
TRUNCATE TABLE `AB_CARS_PhysicalDetails`;
UNLOCK TABLES;
LOCK TABLES `AB_CARS_PrelimHealthExam` WRITE;
TRUNCATE TABLE `AB_CARS_PrelimHealthExam`;
UNLOCK TABLES;
LOCK TABLES `AB_CARS_PsychCheck` WRITE;
TRUNCATE TABLE `AB_CARS_PsychCheck`;
UNLOCK TABLES;
LOCK TABLES `AB_CARS_PsychTests` WRITE;
TRUNCATE TABLE `AB_CARS_PsychTests`;
UNLOCK TABLES;
LOCK TABLES `AB_CARS_PsychTool` WRITE;
TRUNCATE TABLE `AB_CARS_PsychTool`;
UNLOCK TABLES;
LOCK TABLES `AB_CARS_Relatives` WRITE;
TRUNCATE TABLE `AB_CARS_Relatives`;
UNLOCK TABLES;
LOCK TABLES `AB_CARS_SchoolRecords` WRITE;
TRUNCATE TABLE `AB_CARS_SchoolRecords`;
UNLOCK TABLES;
LOCK TABLES `AB_CARS_SocialWelfare` WRITE;
TRUNCATE TABLE `AB_CARS_SocialWelfare`;
UNLOCK TABLES;
LOCK TABLES `AB_CARS_Staff` WRITE;
TRUNCATE TABLE `AB_CARS_Staff`;
UNLOCK TABLES;
LOCK TABLES `AB_CARS_Vaccinations` WRITE;
TRUNCATE TABLE `AB_CARS_Vaccinations`;
UNLOCK TABLES;
LOCK TABLES `AB_CARS_VisitorLog` WRITE;
TRUNCATE TABLE `AB_CARS_VisitorLog`;
UNLOCK TABLES;
LOCK TABLES `AB_JOINMN_Assets Log_Staff_StaffWitness` WRITE;
TRUNCATE TABLE `AB_JOINMN_Assets Log_Staff_StaffWitness`;
UNLOCK TABLES;
LOCK TABLES `AB_JOINMN_Children_General Courses_SchoolBehavior` WRITE;
TRUNCATE TABLE `AB_JOINMN_Children_General Courses_SchoolBehavior`;
UNLOCK TABLES;
LOCK TABLES `AB_JOINMN_Children_Relatives_Relatives` WRITE;
TRUNCATE TABLE `AB_JOINMN_Children_Relatives_Relatives`;
UNLOCK TABLES;
LOCK TABLES `AB_JOINMN_Home Visit Obse_Family Members_FamilyMembers` WRITE;
TRUNCATE TABLE `AB_JOINMN_Home Visit Obse_Family Members_FamilyMembers`;
UNLOCK TABLES;
LOCK TABLES `AB_JOINMN_Medical Record_Vaccinations_Vaccinations` WRITE;
TRUNCATE TABLE `AB_JOINMN_Medical Record_Vaccinations_Vaccinations`;
UNLOCK TABLES;
LOCK TABLES `AB_JOINMN_Notes_Notes Categorie_Categories` WRITE;
TRUNCATE TABLE `AB_JOINMN_Notes_Notes Categorie_Categories`;
UNLOCK TABLES;
LOCK TABLES `AB_JOINMN_Relatives_Address_OldAddress` WRITE;
TRUNCATE TABLE `AB_JOINMN_Relatives_Address_OldAddress`;
UNLOCK TABLES;
LOCK TABLES `AB_JOINMN_Staff_CARs Project_CARsProject` WRITE;
TRUNCATE TABLE `AB_JOINMN_Staff_CARs Project_CARsProject`;
UNLOCK TABLES;
LOCK TABLES `AB_JOINMN_Staff_Children Home_Home` WRITE;
TRUNCATE TABLE `AB_JOINMN_Staff_Children Home_Home`;
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS = 1;