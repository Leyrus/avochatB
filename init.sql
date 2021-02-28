/*
1) Пользователи

CREATE USER avochat_main_owner WITH
     CREATEDB
     CREATEROLE
     INHERIT
     NOREPLICATION
     PASSWORD '121355qQ';

CREATE USER avochat_main_reader WITH
     NOREPLICATION
     PASSWORD '121355qQ';

2) База
CREATE DATABASE avochat
OWNER = avochat_main_owner;

3) Перейти в БД
\c avochat

4) БД схема (создаем схему в коннекшене открытом для созданной базы)
CREATE SCHEMA main AUTHORIZATION  avochat_main_owner;

5) Доступ пользователей к данным
CREATE ROLE avochat_group;
GRANT avochat_group TO avochat_main_owner;
GRANT avochat_group TO avochat_main_reader;

GRANT USAGE ON SCHEMA main TO avochat_main_reader;

ALTER DEFAULT PRIVILEGES FOR ROLE avochat_main_owner IN SCHEMA main
GRANT INSERT, SELECT, UPDATE, DELETE ON TABLES TO avochat_main_reader;
*/
