import { resolve } from "path";
import winston from "winston";
import LokiTransport from "winston-loki";
// require("dotenv").config(resolve(__dirname, "./env"));

/**
 * This function initializes and returns a logger.
 * Log messages are logged to the console and transported to Grafana Loki.
 * @returns winston.Logger
 */
const initLogger = () => {
  if (process.env.NODE_ENV === "production") {
    return winston.createLogger({
      format: winston.format.json(),
      transports: [
        new winston.transports.Console(),
        new LokiTransport({
          host: `${process.env.GRAFANA_LOKI_HOST}`,
          labels: { service_name: "product-service" },
          basicAuth: `${process.env.GRAFANA_LOKI_USERID}:${process.env.GRAFANA_LOKI_API_TOKEN}`,
          json: true,
          format: winston.format.json(),
          replaceTimestamp: true,
          onConnectionError: (err) => console.error(err),
        }),
      ],
    });
  } else {
    return winston.createLogger({
      format: winston.format.json(),
      transports: [new winston.transports.Console()],
    });
  }
};

export const logger: winston.Logger = initLogger();
