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
import { Server } from 'socket.io';
import http from 'http';

const server = express();

// middlewares
// helmet
server.use(helmet());

// cors
server.use(cors({ origin: "http://localhost:3000", credentials: true }));

// logger
server.use(morgan("common"));

// cookie parser
server.use(cookieParser());

// multer
const uploads = multer();
server.use(uploads.single("pdf_doc"));

// body parser
server.use(express.json());

// routes
server.use("/api/v1/ref-docs", documentRouter);
server.use("/api/v1/auth", authRouter);
server.use("/api/v1/tutorial", requireUser, tutorialsRouter);
server.use("/api/v1/labs", requireUser, labRouter);
server.use("/api/v1/discussions", requireUser, discussionRouter);
server.use("/api/v1/dashboard", requireInstructor, dashboardRouter);
server.use("/api/v1/module", moduleRouter);
server.get("/api/v1/protected", requireUser, (req: Request, res: Response) => {
  res.json({ message: "Hello from protected route", user: res.locals.user });
});

server.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(req.path);
  res.status(500).json({ message: err.message });
});

// WebSocket server setup
const wsServer = http.createServer();
const io = new Server(wsServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

export { server, io, wsServer };
