import supertest from "supertest";
import { server } from "../utils/server.util";
import prisma from "./helpers/prisma";

describe("Lab Routes", () => {
  let userCookie: string;
  let testLab: any;
  let testQuestion: any;
  const supertestServer = supertest(server);

  beforeAll(async () => {
    // Login to get cookie
    const response = await supertestServer.post("/api/v1/auth/login").send({
      email: "kamal@test.com",
      password: "password",
    });

    if (response.status !== 200) {
      throw new Error("Unable to login user");
    }

    userCookie = response.headers["set-cookie"];
  });

  describe("GET /api/v1/lab", () => {
    describe("given valid query parameters", () => {
      it("should return 200 and labs for valid module and lesson", async () => {
        const response = await supertestServer
          .get("/api/v1/lab")
          .query({
            moduleName: "database systems",
            lessonTitle: "transactions and concurrency control",
          })
          .set("Cookie", userCookie);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.data.labs)).toBe(true);
        expect(response.body.data.labs.length).toBeGreaterThan(0);

        testLab = response.body.data.labs[0];
      });

      it("should return 400 for missing query parameters", async () => {
        const response = await supertestServer
          .get("/api/v1/lab")
          .set("Cookie", userCookie);

        expect(response.status).toBe(400);
      });
    });

    describe("without authentication", () => {
      it("should return 401 when no cookie is provided", async () => {
        const response = await supertestServer.get("/api/v1/lab").query({
          moduleName: "database systems",
          lessonTitle: "transactions and concurrency control",
        });

        expect(response.status).toBe(401);
      });
    });
  });
});
