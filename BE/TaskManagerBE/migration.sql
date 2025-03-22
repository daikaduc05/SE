CREATE TABLE IF NOT EXISTS `__EFMigrationsHistory` (
    `MigrationId` varchar(150) NOT NULL,
    `ProductVersion` varchar(32) NOT NULL,
    PRIMARY KEY (`MigrationId`)
);

START TRANSACTION;
CREATE TABLE `Projects` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `Name` longtext NOT NULL,
    PRIMARY KEY (`Id`)
);

CREATE TABLE `Role` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `Name` longtext NOT NULL,
    PRIMARY KEY (`Id`)
);

CREATE TABLE `Users` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `Username` longtext NOT NULL,
    `Email` longtext NOT NULL,
    `Password` longtext NOT NULL,
    `Noti_Settings` tinyint(1) NOT NULL,
    `Is_Banned` tinyint(1) NOT NULL,
    PRIMARY KEY (`Id`)
);

CREATE TABLE `Notifications` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `Project_Id` int NOT NULL,
    `Title` longtext NOT NULL,
    `Context` longtext NOT NULL,
    `Created_By` longtext NOT NULL,
    `Created_At` datetime(6) NOT NULL,
    PRIMARY KEY (`Id`),
    CONSTRAINT `FK_Notifications_Projects_Project_Id` FOREIGN KEY (`Project_Id`) REFERENCES `Projects` (`Id`) ON DELETE CASCADE
);

CREATE TABLE `Tasks` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `Project_Id` int NOT NULL,
    `State` longtext NOT NULL,
    `Priority` longtext NOT NULL,
    `Task_Name` longtext NOT NULL,
    `Created_By` longtext NOT NULL,
    `ProjectId` int NOT NULL,
    PRIMARY KEY (`Id`),
    CONSTRAINT `FK_Tasks_Projects_ProjectId` FOREIGN KEY (`ProjectId`) REFERENCES `Projects` (`Id`) ON DELETE CASCADE
);

CREATE TABLE `RoleUserProjects` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `User_Id` int NOT NULL,
    `Role_Id` int NOT NULL,
    `Project_Id` int NOT NULL,
    PRIMARY KEY (`Id`),
    CONSTRAINT `FK_RoleUserProjects_Projects_Project_Id` FOREIGN KEY (`Project_Id`) REFERENCES `Projects` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_RoleUserProjects_Role_Role_Id` FOREIGN KEY (`Role_Id`) REFERENCES `Role` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_RoleUserProjects_Users_User_Id` FOREIGN KEY (`User_Id`) REFERENCES `Users` (`Id`) ON DELETE CASCADE
);

CREATE TABLE `UserNotification` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `User_Id` int NOT NULL,
    `Noti_Id` int NOT NULL,
    `Is_Read` tinyint(1) NOT NULL,
    PRIMARY KEY (`Id`),
    CONSTRAINT `FK_UserNotification_Notifications_Noti_Id` FOREIGN KEY (`Noti_Id`) REFERENCES `Notifications` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_UserNotification_Users_User_Id` FOREIGN KEY (`User_Id`) REFERENCES `Users` (`Id`) ON DELETE CASCADE
);

CREATE TABLE `TaskUsers` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `User_Id` int NOT NULL,
    `Task_Id` int NOT NULL,
    `TaskId` int NOT NULL,
    PRIMARY KEY (`Id`),
    CONSTRAINT `FK_TaskUsers_Tasks_TaskId` FOREIGN KEY (`TaskId`) REFERENCES `Tasks` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_TaskUsers_Users_User_Id` FOREIGN KEY (`User_Id`) REFERENCES `Users` (`Id`) ON DELETE CASCADE
);

CREATE INDEX `IX_Notifications_Project_Id` ON `Notifications` (`Project_Id`);

CREATE INDEX `IX_RoleUserProjects_Project_Id` ON `RoleUserProjects` (`Project_Id`);

CREATE INDEX `IX_RoleUserProjects_Role_Id` ON `RoleUserProjects` (`Role_Id`);

CREATE INDEX `IX_RoleUserProjects_User_Id` ON `RoleUserProjects` (`User_Id`);

CREATE INDEX `IX_Tasks_ProjectId` ON `Tasks` (`ProjectId`);

CREATE INDEX `IX_TaskUsers_TaskId` ON `TaskUsers` (`TaskId`);

CREATE INDEX `IX_TaskUsers_User_Id` ON `TaskUsers` (`User_Id`);

CREATE INDEX `IX_UserNotification_Noti_Id` ON `UserNotification` (`Noti_Id`);

CREATE INDEX `IX_UserNotification_User_Id` ON `UserNotification` (`User_Id`);

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20250322174531_InitialCreate', '9.0.3');

COMMIT;

