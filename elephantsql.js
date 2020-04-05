var { Pool } = require("pg");
require("dotenv").config();

const isProduction = process.env.NODE_ENV === "production";
const conObj = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
};

const pool = new Pool({
  conObj: isProduction ? process.env.DATABASE_URL : connectionString,
  ssl: isProduction,
});

module.exports = pool;
