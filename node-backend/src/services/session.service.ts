import { get, includes } from "lodash";
import { verifyJwt, signJwt } from "../utils/jwt.utils";
import prisma from "../utils/prisma-client.util";
import { SessionType } from "../types/auth.types";

export async function createSession(userId: string, userAgent: string) {
  const session = await prisma.session.create({
    data: {
      user: {
        connect: {
          id: userId,
        },
      },
      userAgent,
    },
  });
  return session;
}

export async function findSessions(userId: string) {
  return prisma.session.findFirst({
    where: {
      user: {
        id: userId,
      },
    },
    include: {
      user: true,
    },
  });
}

export async function findSession(id: string) {
  return prisma.session.findFirst({
    where: {
      id,
    },
  });
}

export async function invalidateSession(
  sessionId: string
): Promise<SessionType | null> {
  const session = await prisma.session.update({
    where: {
      id: sessionId,
    },
    data: {
      valid: false,
    },
  });
  return session;
}

// export async function reIssueAccessToken({
//   refreshToken,
// }: {
//   refreshToken: string;
// }) {
//   const { decoded } = verifyJwt(refreshToken);

//   if (!decoded || !get(decoded, "session")) return false;

//   const session = await SessionModel.findById(get(decoded, "session"));

//   if (!session || !session.valid) return false;

//   const user = await findUser(session.user);

//   if (!user) return false;

//   const accessToken = signJwt(
//     { ...user, session: session._id },
//     { expiresIn: "1y" } // 15 minutes
//   );

//   return accessToken;
// }
