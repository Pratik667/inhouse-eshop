const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} */
module.exports = {
  testEnvironment: "node",

  transform: {
    ...tsJestTransformCfg,
  },

  testMatch: ["**/*.test.ts"],

  moduleFileExtensions: ["ts", "js", "json"],

  clearMocks: true,

  verbose: true,

  coverageDirectory: "coverage",

  collectCoverageFrom: ["src/**/*.{ts,tsx}"],

  setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
};