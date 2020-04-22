const winston = require("winston");
require("express-async-errors");
const { format, transports } = require("winston");
const { combine, colorize, simple } = format;

module.exports = () => {
  // uncaught promise rejection
  process.on("unhandledRejection", (ex) => {
    throw ex;
  });

  // configure winston logger to files
  winston.configure({
    transports: [
      new transports.File({
        handleExceptions: true,
        filename: "logfile.log",
      }),
      new transports.Console({
        handleExceptions: true,
        format: combine(colorize(), simple()),
      }),
    ],
  });
};
