import mongoose from "mongoose";
import { PORT, MONGO_URI } from "./constants/app.constants";
import server from "./utils/server.util";
import { logger } from "./utils/logger.utils";
import prisma from "./utils/prisma-client.util";
import { dashboardUtil } from "./utils/dashboard.util";
import jsDoc from "./metadata-schema-details/raw_schema_details.json";

const app = server;

app.listen(PORT, async () => {
  try {
    // await mongoose.connect(MONGO_URI);
    await prisma.$connect();
    logger.info(
      `Connected to database. Server available at http://localhost:${PORT}`
    );
    // const abc = await dashboardUtil.getTableMetadata(jsDoc);
    // console.log(abc);
  } catch (error) {
    console.log(error);
  }
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
