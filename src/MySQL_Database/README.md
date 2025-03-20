## Overview
This folder contains the database schema, table definitions, and data dumps for the **March Madness Betting** application. The database is designed to manage users, games, bets, and bracket selections.

## Database Schema
The database consists of the following tables:

### **1. `users` Table**
Stores user account information.

### **2. `games` Table**
Stores details about the scheduled games, such as the teams and game start times.

### **3. `bets` Table**
Stores user bets on games, including the bet amount, type, odds, and status.

### **4. `bracket` Table**
Stores users' bracket selections in JSON format, with a reference to each user.

### DATABASE TABLES DO NOT UPDATE. MUST REMOVE AND REBUILD DOCKER CONTAINER

## Commands

To Remove Container:
1. docker volume ls
2. docker volume rm project_03_mysql_data

To update db dump:

docker cp path/to/your/database_dump.sql MySQLDatabase:/tmp/database_dump.sql
docker exec -it MySQLDatabase mysql -u root -p 
** Enter Password ** : team3
USE march_madness_betting;
source /tmp/database_dump.sql;