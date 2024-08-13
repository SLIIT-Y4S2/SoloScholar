import { get, includes } from "lodash";
import { verifyJwt, signJwt } from "../utils/jwt.utils";
import prisma from "../utils/prisma-client.util";
import { SessionType } from "../types/auth.types";

export async function createSession(personId: string, user_agent: string) {
  const session = await prisma.session.create({
    data: {
      person: {
        connect: {
          id: personId,
        },
      },
      user_agent,
    },
  });
  return session;
}

export async function findSessions(personId: string) {
  return prisma.session.findFirst({
    where: {
      person: {
        id: personId,
      },
    },
    include: {
      person: true,
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
      is_valid: false,
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
