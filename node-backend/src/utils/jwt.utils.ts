import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../constants/app.constants";

export function signJwt(object: Object, options?: jwt.SignOptions | undefined) {
  return jwt.sign(object, JWT_SECRET, {
    ...(options && options),
  });
}

export function verifyJwt(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (e: any) {
    console.error(e);
    return {
      valid: false,
      expired: e.message === "jwt expired",
      decoded: null,
    };
  }
}
