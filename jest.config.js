module.exports = {
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.js"],
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.js", "!src/server.js"],
  coverageDirectory: "coverage",
  //   setupFilesAfterEnv: ["<rootDir>/src/tests/setup.js"],
  coveragePathIgnorePatterns: ["/node_modules/"],
  moduleDirectories: ["node_modules", "src"],
  moduleFileExtensions: ["js", "json"],
};
