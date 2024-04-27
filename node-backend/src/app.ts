import mongoose from "mongoose";
import { PORT, MONGO_URI } from "./constants/app.constants";
import server from "./utils/server.util";
import { logger } from "./utils/logger";

const app = server;

app.listen(PORT, async () => {
  try {
    await mongoose.connect(MONGO_URI);
    logger.info(
      `Connected to database. Server available at http://localhost:${PORT}`
    );
  } catch (error) {
    console.log(error);
  }
});
