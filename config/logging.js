const winston = require("winston");
require("express-async-errors");
const { format, transports } = require("winston");
const { combine, colorize, simple } = format;

module.exports = () => {
  // uncaught promise rejection
  process.on("unhandledRejection", (ex) => {
    throw ex;
  });

  const loggerTransports = [
    new transports.Console({
      handleExceptions: true,
      format: combine(colorize(), simple()),
    }),
  ];

  if (process.env.NODE_ENV !== "test") {
    loggerTransports.unshift(
      new transports.File({
        handleExceptions: true,
        filename: "logfile.log",
      })
    );
  }

  winston.configure({
    transports: loggerTransports,
  });
};
