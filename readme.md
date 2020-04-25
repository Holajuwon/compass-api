[![Build Status](https://travis-ci.org/Holajuwon/compass-api.svg?branch=develop)](https://travis-ci.org/Holajuwon/compass-api)

# SETUP

## To get started with this Project

### First clone to your local repo using:

#### For ssh

```bash
$ git clone git@github.com:Holajuwon/compass-api.git
```

#### For HTTPS

```bash
$ git clone https://github.com/Holajuwon/compass-api.git
```

### Then switch directories into the cloned repo

```bash
$ cd compass-api
```

### Then install all dependencies

```bash
$ npm install
```

### Then setup the database and schema

- You must have postgres cli installed

```bash
$ psql -c 'create database my_db;' -U postgres
$ psql "dbname=my_db" -a -f init.sql
```

### Then setup the environmental variables in a .env file

```env
.env file
DB_USER = postgres
DB_HOST = localhost
DB_DATABASE = my_db
DB_PASSWORD =
DB_PORT = 5432
```

### To start the local server use;

```bash
$ npm start
```

### Then you can make a call to the endpoints on

```
http://localhost:3000/
```

Check out a list to a [documentation](https://documenter.getpostman.com/view/9053858/Szf9W7DT?version=latest) of all routes [here](https://documenter.getpostman.com/view/9053858/Szf9W7DT?version=latest).

Link to [hosted](https://compassed-api.herokuapp.com/api/post) api [here](https://compassed-api.herokuapp.com/api/post).

# TEST

### This project makes use of [Jest](https://jestjs.io/) for testing

To run tests

```
$ npm test
```
