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

CREATE TABLE `Roles` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `Name` longtext NOT NULL,
    PRIMARY KEY (`Id`)
);

CREATE TABLE `Users` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `Username` longtext NOT NULL,
    `Email` longtext NOT NULL,
    `Password` longtext NOT NULL,
    `NotificationSettings` tinyint(1) NOT NULL,
    `IsBanned` tinyint(1) NOT NULL,
    PRIMARY KEY (`Id`)
);

CREATE TABLE `Notifications` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `ProjectId` int NOT NULL,
    `Title` longtext NOT NULL,
    `Context` longtext NOT NULL,
    `CreatedById` int NOT NULL,
    `CreatedAt` datetime(6) NOT NULL,
    PRIMARY KEY (`Id`),
    CONSTRAINT `FK_Notifications_Projects_ProjectId` FOREIGN KEY (`ProjectId`) REFERENCES `Projects` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_Notifications_Users_CreatedById` FOREIGN KEY (`CreatedById`) REFERENCES `Users` (`Id`) ON DELETE CASCADE
);

CREATE TABLE `RoleUserProjects` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `UserId` int NOT NULL,
    `RoleId` int NOT NULL,
    `ProjectId` int NOT NULL,
    PRIMARY KEY (`Id`),
    CONSTRAINT `FK_RoleUserProjects_Projects_ProjectId` FOREIGN KEY (`ProjectId`) REFERENCES `Projects` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_RoleUserProjects_Roles_RoleId` FOREIGN KEY (`RoleId`) REFERENCES `Roles` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_RoleUserProjects_Users_UserId` FOREIGN KEY (`UserId`) REFERENCES `Users` (`Id`) ON DELETE CASCADE
);

CREATE TABLE `Tasks` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `ProjectId` int NOT NULL,
    `State` longtext NOT NULL,
    `Priority` longtext NOT NULL,
    `TaskName` longtext NOT NULL,
    `CreatedById` int NOT NULL,
    PRIMARY KEY (`Id`),
    CONSTRAINT `FK_Tasks_Projects_ProjectId` FOREIGN KEY (`ProjectId`) REFERENCES `Projects` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_Tasks_Users_CreatedById` FOREIGN KEY (`CreatedById`) REFERENCES `Users` (`Id`) ON DELETE CASCADE
);

CREATE TABLE `UserNotifications` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `UserId` int NOT NULL,
    `NotificationId` int NOT NULL,
    `IsRead` tinyint(1) NOT NULL,
    PRIMARY KEY (`Id`),
    CONSTRAINT `FK_UserNotifications_Notifications_NotificationId` FOREIGN KEY (`NotificationId`) REFERENCES `Notifications` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_UserNotifications_Users_UserId` FOREIGN KEY (`UserId`) REFERENCES `Users` (`Id`) ON DELETE CASCADE
);

CREATE TABLE `TaskUsers` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `UserId` int NOT NULL,
    `TaskId` int NOT NULL,
    PRIMARY KEY (`Id`),
    CONSTRAINT `FK_TaskUsers_Tasks_TaskId` FOREIGN KEY (`TaskId`) REFERENCES `Tasks` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_TaskUsers_Users_UserId` FOREIGN KEY (`UserId`) REFERENCES `Users` (`Id`) ON DELETE CASCADE
);

CREATE INDEX `IX_Notifications_CreatedById` ON `Notifications` (`CreatedById`);

CREATE INDEX `IX_Notifications_ProjectId` ON `Notifications` (`ProjectId`);

CREATE INDEX `IX_RoleUserProjects_ProjectId` ON `RoleUserProjects` (`ProjectId`);

CREATE INDEX `IX_RoleUserProjects_RoleId` ON `RoleUserProjects` (`RoleId`);

CREATE INDEX `IX_RoleUserProjects_UserId` ON `RoleUserProjects` (`UserId`);

CREATE INDEX `IX_Tasks_CreatedById` ON `Tasks` (`CreatedById`);

CREATE INDEX `IX_Tasks_ProjectId` ON `Tasks` (`ProjectId`);

CREATE INDEX `IX_TaskUsers_TaskId` ON `TaskUsers` (`TaskId`);

CREATE INDEX `IX_TaskUsers_UserId` ON `TaskUsers` (`UserId`);

CREATE INDEX `IX_UserNotifications_NotificationId` ON `UserNotifications` (`NotificationId`);

CREATE INDEX `IX_UserNotifications_UserId` ON `UserNotifications` (`UserId`);

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20250323130536_InitialMigration', '9.0.3');

COMMIT;

