  <p align="center">Apex labs repository</p>

## Description

APEX-LABS v0.0.1
To run the app you need to:

0. Install NodeJS (at least v18.0.0)
1. Clone repository;
2. Install docker & docker-compose (at least v24.0.0 for docker & v1.29.0 for docker-compose);
3. Install node_modules dependencies via yarn (yarn version at least v1.22.19);
4. Create docker-containers with .env & docker-compose.yaml, do not forget to create container with docker-compose.yaml in "second" directory (don`t forget to change .env credentials);
5. Create quque called "apex" in RabbitMQ Management (log:pass - apex:apex)
6. Run first and second app with yarn start:dev, double check connection to the docker-container;
7. Enjoy!;

## Installation

```bash
$ sudo docker compose up
```

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start:dev