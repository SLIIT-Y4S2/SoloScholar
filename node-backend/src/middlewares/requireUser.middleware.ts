import { get } from "lodash";
import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../utils/jwt.utils";

const requireUser = async (req: Request, res: Response, next: NextFunction) => {
  // const accessToken = get(req, "headers.authorization", "").replace(
  //   /^Bearer\s/,
  //   ""
  // );

  const accessToken = req.cookies.jwt;

  if (!accessToken) {
    return res.status(403).send("Access token required");
  }

  const { decoded, expired } = verifyJwt(accessToken);

  if (expired) {
    return res.status(401).send("Token expired");
  }

  if (!decoded) {
    return res.status(403).send("Invalid token");
  }

  res.locals.user = decoded;
  return next();
};

export default requireUser;
