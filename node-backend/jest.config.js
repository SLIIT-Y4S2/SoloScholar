/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/*.test.ts"],

  verbose: true,
  forceExit: true,
  setupFilesAfterEnv: ["<rootDir>/src/__test__/helpers/setup.ts"],
};
