-- Database initialization script for Vessel Hire Application
-- This script runs when the MS SQL Server container starts for the first time

USE master;
GO

-- Create the database if it doesn't exist
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'vesselhire_db')
BEGIN
    CREATE DATABASE vesselhire_db;
END
GO

-- Use the database
USE vesselhire_db;
GO

-- Create a custom user for the application (optional)
-- IF NOT EXISTS (SELECT name FROM sys.server_principals WHERE name = 'vesselhire_user')
-- BEGIN
--     CREATE LOGIN vesselhire_user WITH PASSWORD = 'VesselHire@Pass123';
--     CREATE USER vesselhire_user FOR LOGIN vesselhire_user;
--     ALTER ROLE db_owner ADD MEMBER vesselhire_user;
-- END
-- GO

-- Enable SQL Server authentication
EXEC xp_instance_regwrite N'HKEY_LOCAL_MACHINE', 
     N'Software\Microsoft\MSSQLServer\MSSQLServer', 
     N'LoginMode', REG_DWORD, 2;
GO

-- Set database recovery model to simple for development
ALTER DATABASE vesselhire_db SET RECOVERY SIMPLE;
GO

PRINT 'Database initialization completed successfully!';
GO

