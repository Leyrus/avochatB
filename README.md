# Description

Nest [docs](https://github.com/nestjs/nest)

## Installation
1. Поднять базу данных postgres, при необходимости установить.<br>
Для этого нужно выполнить все скрпипты из init.sql в консоли psql.
```bash
# Войти в консоль psql
# windows:
psql -U postgres
# linux:
sudo -u postgres psql
```
2. Добавить файл .env и ormconfig.json в корень приложения.<br>
Примеры есть в config-examples/
3. Установить зависимости
```bash
yarn install
```

## Running the app

```bash
# development
yarn start

# watch mode
yarn start:dev

# production mode
yarn start:prod
```

## Test

```bash
# unit tests
yarn test

# e2e tests
yarn test:e2e

# test coverage
yarn test:cov
``

