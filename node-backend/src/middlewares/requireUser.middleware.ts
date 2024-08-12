import { get } from "lodash";
import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../utils/jwt.utils";
import { findSession } from "../services/session.service";

const requireUser = async (req: Request, res: Response, next: NextFunction) => {
  // const accessToken = get(req, "headers.authorization", "").replace(
  //   /^Bearer\s/,
  //   ""
  // );

  const accessToken = req.cookies.jwt;

  if (!accessToken) {
    return res.status(401).json({
      message: "Unauthorized: Access token is required",
    });
  }

  const { decoded, expired } = verifyJwt(accessToken);

  if (expired) {
    return res.status(401).json({
      message: "Unauthorized: Access token expired",
    });
  }

  if (!decoded) {
    return res.status(401).json({
      message: "Unauthorized: Invalid access token",
    });
  }

  const session = await findSession(get(decoded, "session") || "");

  if (!session || !session.is_valid) {
    res.clearCookie("jwt");
    return res.status(401).json({
      message: "Unauthorized: Invalid session",
    });
  }

  res.locals.user = decoded;

  return next();
};

export default requireUser;
