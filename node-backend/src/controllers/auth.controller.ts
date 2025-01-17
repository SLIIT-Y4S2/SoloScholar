import { Request, Response } from "express";
import { createSession, invalidateSession } from "../services/session.service";
import { validatePassword } from "../services/user.service";
import { signJwt } from "../utils/jwt.utils";
import { logger } from "../utils/logger.utils";
import { DEPLOYMENT_ENV } from "../constants/app.constants";

async function createUserSessionHandler(req: Request, res: Response) {
  // Validate the user's password
  try {
    const user = await validatePassword(req.body);

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // create a session
    const session = await createSession(
      user.id,
      req.get("user-agent") || "no-user-agent"
    );

    // create token
    const jwtToken = signJwt(
      { ...user, session: session.id },
      { expiresIn: "30d" }
    );
    res.cookie(
      "jwt",
      jwtToken,
      DEPLOYMENT_ENV === "prod"
        ? {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/",
            maxAge: 30 * 24 * 60 * 60 * 1000,
          }
        : {
            httpOnly: true,
            // secure: true,
            secure: false,
            sameSite: "strict",
            // sameSite: "none",
            domain: "localhost",
            path: "/",
            maxAge: 30 * 24 * 60 * 60 * 1000,
          }
    );

    return res.send(user);
  } catch (error) {
    return res.status(400).json({
      message: "Something went wrong",
      error: (error as Error).message,
    });
  }
}

// find all sessions of a user
// async function getUserSessionsHandler(req: Request, res: Response) {
//   const userId = res.locals.user._id;

//   const sessions = await findSessions( userId });

//   return res.send(sessions);
// }

// async function deleteSessionHandler(req: Request, res: Response) {
//   const sessionId = res.locals.user.session;

//   await updateSession({ _id: sessionId }, { valid: false });

//   return res.send({
//     accessToken: null,
//     refreshToken: null,
//   });
// }

async function invalidateUserSessionHandler(req: Request, res: Response) {
  try {
    const sessionId = res.locals.user.session;

    await invalidateSession(sessionId);

    res.clearCookie("jwt");

    return res.send({
      message: "Session invalidated",
    });
  } catch (error) {
    logger.error((error as Error).message);
    return res.status(400).json({
      message: "Something went wrong",
      error: (error as Error).message,
    });
  }
}

export default {
  createUserSessionHandler,
  // getUserSessionsHandler,
  // deleteSessionHandler,
  invalidateUserSessionHandler,
};
