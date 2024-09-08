import mongoose from "mongoose";
import { PORT, MONGO_URI, WS_PORT } from "./constants/app.constants";
import { io, server, wsServer } from "./utils/server.util";
import { logger } from "./utils/logger.utils";
import prisma from "./utils/prisma-client.util";
import { setupDiscussionWebSocket } from "./websockets/discussion.websocket";

const app = server;

app.listen(PORT, async () => {
  try {
    // await mongoose.connect(MONGO_URI);
    await prisma.$connect();
    logger.info(
      `Connected to database. Server available at http://localhost:${PORT}`
    );
  } catch (error) {
    console.log(error);
  }
});

// Set up WebSocket handlers
setupDiscussionWebSocket(io);

// Start WebSocket server
wsServer.listen(WS_PORT, () => {
  logger.info(`WebSocket server is running on port ${WS_PORT}`);
});

// TODO: Uncomment this block after removing the mongoose connection
// app.listen(PORT, async () => {
//   try {
//     await prisma.$connect();
//     logger.info(
//       `Connected to sql database. Server available at http://localhost:${PORT}`
//     );
//   } catch (error) {
//     logger.error(`Error connecting to database: ${(error as Error).message}`);
//   }
// });
