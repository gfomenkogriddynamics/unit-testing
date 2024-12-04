module.exports = {
    collectCoverage: true,
    collectCoverageFrom: [
        "unitTestingTask.js", // Adjust based on your project structure
    ],
    coverageDirectory: "coverage", // Directory to save coverage reports
    coverageReporters: ["text", "lcov", "html"], // Formats for reports
};
