import supertest from "supertest";
import { server } from "../utils/server.util";
import prisma from "./helpers/prisma";

describe("Tutorial Routes", () => {
  let userCookie: string;
  let testTutorial: any;
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

  describe("GET /api/v1/tutorial", () => {
    describe("given valid query parameters", () => {
      it("should return 200 and tutorials for valid module and lesson", async () => {
        const response = await supertestServer
          .get("/api/v1/tutorial")
          .query({
            moduleName: "database systems",
            lessonTitle: "transactions and concurrency control",
          })
          .set("Cookie", userCookie);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.data.tutorials)).toBe(true);
        expect(response.body.data.tutorials.length).toBeGreaterThan(0);

        testTutorial = response.body.data.tutorials[0];
      });

      it("should return 400 for missing query parameters", async () => {
        const response = await supertestServer
          .get("/api/v1/tutorial")
          .set("Cookie", userCookie);

        expect(response.status).toBe(400);
      });
    });

    describe("without authentication", () => {
      it("should return 401 when no cookie is provided", async () => {
        const response = await supertestServer.get("/api/v1/tutorial").query({
          moduleName: "database systems",
          lessonTitle: "transactions and concurrency control",
        });

        expect(response.status).toBe(401);
      });
    });
  });

  describe("GET /api/v1/tutorial/:tutorialId", () => {
    it("should return 200 and tutorial details for valid ID", async () => {
      const response = await supertestServer
        .get(`/api/v1/tutorial/${testTutorial.id}`)
        .set("Cookie", userCookie);

      expect(response.status).toBe(200);
      expect(response.body.data).toMatchObject({
        id: testTutorial.id,
      });

      testQuestion = response.body.data.questions[0];
    });

    it("should return 500 for non-existent tutorial", async () => {
      const response = await supertestServer
        .get(`/api/v1/tutorial/non-existent-id`)
        .set("Cookie", userCookie);

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Tutorial not found");
    });
  });

  describe("POST /api/v1/tutorial/:tutorialId/answer", () => {
    it("should save tutorial answer successfully", async () => {
      const answerData = {
        answer: "Test answer",
        next: 2,
        questionId: testQuestion.id,
      };

      const response = await supertestServer
        .post(`/api/v1/tutorial/${testTutorial.id}/answer`)
        .set("Cookie", userCookie)
        .send(answerData);

      expect(response.status).toBe(200);
    });

    it("should return 400 for invalid answer data", async () => {
      const response = await supertestServer
        .post(`/api/v1/tutorial/${testTutorial.id}/answer`)
        .set("Cookie", userCookie)
        .send({});

      expect(response.status).toBe(400);
    });
  });

  describe("POST /api/v1/tutorial/:tutorialId/submission", () => {
    it("should submit tutorial successfully", async () => {
      const answerData = {
        answer: "Test answer",
        questionId: testQuestion.id,
      };
      const response = await supertestServer
        .post(`/api/v1/tutorial/${testTutorial.id}/submission`)
        .set("Cookie", userCookie)
        .send(answerData);

      expect(response.status).toBe(200);

      // Verify submission was recorded
      const updatedTutorial = await prisma.tutorial.findUnique({
        where: { id: testTutorial.id },
      });
      expect(updatedTutorial?.status == "submitted").toBe(true);
    });

    it("should return 404 for non-existent tutorial", async () => {
      const response = await supertestServer
        .post(`/api/v1/tutorial/non-existent-id/submission`)
        .set("Cookie", userCookie);

      expect(response.status).toBe(500);
    });
  });

  describe("POST /api/v1/tutorial/:tutorialId/complete", () => {
    it("should return 500 for non-existent tutorial", async () => {
      const response = await supertestServer
        .post(`/api/v1/tutorial/non-existent-id/complete`)
        .set("Cookie", userCookie);

      expect(response.status).toBe(500);
    });
  });

  describe("PATCH /api/v1/tutorial/:tutorialId/:questionId/hint", () => {
    it("should mark hint as viewed successfully", async () => {
      const response = await supertestServer
        .patch(`/api/v1/tutorial/${testTutorial.id}/${testQuestion.id}/hint`)
        .set("Cookie", userCookie);

      expect(response.status).toBe(200);

      // Verify hint viewed status
      const updatedQuestion = await prisma.tutorial_question.findUnique({
        where: { id: testQuestion.id },
      });
      expect(updatedQuestion?.is_hint_viewed).toBe(true);
    });

    it("should return 404 for non-existent question", async () => {
      const response = await supertestServer
        .patch(`/api/v1/tutorial/${testTutorial.id}/non-existent-id/hint`)
        .set("Cookie", userCookie);

      expect(response.status).toBe(404);
    });
  });
});
