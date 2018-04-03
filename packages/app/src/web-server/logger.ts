import winston from "winston";
const { createLogger, format, transports } = winston;

export const logger = createLogger({
  level: "debug",
  format: format.combine(
    format.timestamp(),
    format.simple(),
  ),
  transports: [
    new transports.Console(),
  ],
});
