import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import multer from "multer";
import cookieParser from "cookie-parser";
import documentRouter from "../routes/document.routes";
import authRouter from "../routes/auth.routes";
import requireUser from "../middlewares/requireUser.middleware";
import cors from "cors";
import helmet from "helmet";
import tutorialsRouter from "../routes/tutorials.routes";
import labRouter from "../routes/lab.routes";
import dashboardRouter from "../routes/dashboard.routes";
import moduleRouter from "../routes/module.routes";
import discussionRouter from "../routes/discussion.routes";
import requireInstructor from "../middlewares/requireInstructor.middleware";
import { Server } from "socket.io";
import http from "http";
import dashboardAnalyticsRouter from "../routes/dashboardAnalytics.routes";
import lectureRouter from "../routes/lecture.routes";
import {
  DEPLOYMENT_ENV,
  PROD_CLIENT_DOMAIN,
  PROD_CLIENT_DOMAIN_2,
} from "../constants/app.constants";

const app = express();

// middlewares
// helmet
app.use(helmet());

// cors
app.use(
  cors({
    origin:
      DEPLOYMENT_ENV == "prod"
        ? [`https://${PROD_CLIENT_DOMAIN}`, `https://${PROD_CLIENT_DOMAIN_2}`]
        : "http://localhost:3000",
    credentials: true,
  })
);

// logger
app.use(morgan("common"));

// cookie parser
app.use(cookieParser());

// multer
const uploads = multer();
app.use(uploads.single("pdf_doc"));

// body parser
app.use(express.json());

// routes
app.use("/api/v1/ref-docs", documentRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/lecture", requireUser, lectureRouter);
app.use("/api/v1/tutorial", requireUser, tutorialsRouter);
app.use("/api/v1/labs", requireUser, labRouter);
app.use("/api/v1/discussions", requireUser, discussionRouter);
app.use("/api/v1/dashboard", requireInstructor, dashboardRouter);
app.use(
  "/api/v1/dashboard-analytics",
  requireInstructor,
  dashboardAnalyticsRouter
);
app.use("/api/v1/module", moduleRouter);
app.get("/api/v1/protected", requireUser, (req: Request, res: Response) => {
  res.json({ message: "Hello from protected route", user: res.locals.user });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(req.path);
  res.status(500).json({ message: err.message });
});

// WebSocket server setup
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin:
      DEPLOYMENT_ENV == "prod"
        ? [`https://${PROD_CLIENT_DOMAIN}`, `https://${PROD_CLIENT_DOMAIN_2}`]
        : "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

export { server, io };
