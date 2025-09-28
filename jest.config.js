module.exports = {
  testMatch: ['<rootDir>/src/tests/**/*.test.js', '<rootDir>/src/tests/**/*.spec.js'],
  reporters: [
    "default",
    ["jest-html-reporter", {
      pageTitle: "Test Report",
      outputPath: "report/test-report.html"
    }]
  ],
};
