module.exports = {
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.js"],
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.js", "!src/server.js"],
  coverageDirectory: "coverage",
  setupFilesAfterEnv: ["<rootDir>/src/tests/setup.js"],
  coveragePathIgnorePatterns: ["/node_modules/"],
  moduleDirectories: ["node_modules", "src"], // Add 'src' for absolute imports
  moduleFileExtensions: ["js", "json"], // Ensure Jest handles JS files properly
};
