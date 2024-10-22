import { PORT } from "./constants/app.constants";
import { io, server } from "./utils/server.util";
import { logger } from "./utils/logger.utils";
import prisma from "./utils/prisma-client.util";
import { setupDiscussionWebSocket } from "./websockets/discussion.websocket";

// Set up WebSocket handlers
setupDiscussionWebSocket(io);

server.listen(PORT, async () => {
  try {
    await prisma.$connect();
    logger.info(`Connected to database. Server is running on port ${PORT}`);
  } catch (error) {
    console.log(error);
  }
});
