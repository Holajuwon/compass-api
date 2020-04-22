const express = require("express");
const app = express();
const winston = require("winston");

require("./config/logging")();
require("./config/routes")(app);

const port = process.env.PORT || 5000;
const server = app.listen(port, () =>
  winston.info(`Server running on port ${port} 🔥`)
);

module.exports = server;
