import supertest from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import server from "../utils/server.util";
import mongoose from "mongoose";
import path from "path";

let dummyDocument = {};

describe("document", () => {
    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri());

        jest.mock("@azure/storage-blob");

    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    describe("GET /api/v1/ref-docs", () => {
        describe("given there are no documents", () => {
            it("should return a 200 status code", async () => {
                const response = await supertest(server)
                    .get("/api/v1/ref-docs");

                expect(response.status).toBe(200);
                expect(response.body).toEqual({ message: "No documents found" });
            });
        });
    });

    describe(" POST /api/v1/ref-docs", () => {
        describe("given no file is uploaded", () => {
            it("should return a 400 status code", async () => {
                await supertest(server)
                    .post("/api/v1/ref-docs")
                    .expect(400);
            });
        });

        describe("given a document that is not a pdf is uploaded", () => {
            console.log(path.join(__dirname, "__test_docs__", "dummy.txt"));
            it("should return a 415 status code", async () => {
                await supertest(server)
                    .post("/api/v1/ref-docs")
                    .attach("pdf_doc", path.join(__dirname, "__test_docs__", "dummy.txt"))
                    .expect(415);
            });
        });

        describe("given a pdf document is uploaded", () => {
            it("should return a 201 status code", async () => {
                const response = await supertest(server)
                    .post("/api/v1/ref-docs")
                    .attach("pdf_doc", path.join(__dirname, "__test_docs__", "dummy.pdf"));

                dummyDocument = response.body;
                expect(response.status).toBe(201);
            });
        });
    });

    describe("GET /api/v1/ref-docs", () => {
        describe("given there are documents", () => {
            it("should return a 200 status code", async () => {
                const response = await supertest(server)
                    .get("/api/v1/ref-docs");

                expect(response.status).toBe(200);
                expect(response.body.count).toEqual(1);
            });
        });
    });



});
