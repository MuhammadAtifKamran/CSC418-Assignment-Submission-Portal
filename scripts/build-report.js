"use strict";

const fs = require("node:fs");
const path = require("node:path");

const ARTIFACTS_DIRECTORY = path.resolve(
    __dirname,
    "..",
    "artifacts"
);

const JEST_RESULTS_FILE = path.join(
    ARTIFACTS_DIRECTORY,
    "jest-results.json"
);

const REPORT_PAYLOAD_FILE = path.join(
    ARTIFACTS_DIRECTORY,
    "test-report-payload.json"
);

function readJsonFile(filePath) {
    if (!fs.existsSync(filePath)) {
        throw new Error(
            `Required Jest result file was not found: ${filePath}`
        );
    }

    return JSON.parse(
        fs.readFileSync(filePath, "utf8")
    );
}

function cleanFailureMessage(messages) {
    if (
        !Array.isArray(messages) ||
        messages.length === 0
    ) {
        return null;
    }

    return messages
        .join("\n")
        .replace(/\u001b\[[0-9;]*m/g, "")
        .trim();
}

function getRepositoryName() {
    const githubRepository =
        process.env.GITHUB_REPOSITORY;

    if (githubRepository) {
        return githubRepository;
    }

    return "MuhammadAtifKamran/CSC418-Assignment-Submission-Portal";
}

function getBranchName() {
    return (
        process.env.GITHUB_REF_NAME ||
        process.env.GITHUB_HEAD_REF ||
        "local"
    );
}

function getCommitSha() {
    return process.env.GITHUB_SHA || "local-run";
}

function getPipelineRunId() {
    return process.env.GITHUB_RUN_ID || "local-run";
}

function buildReport(jestResults) {
    const tests = [];

    for (
        const testSuite of jestResults.testResults || []
    ) {
        for (
            const assertion of
            testSuite.assertionResults || []
        ) {
            tests.push({
                name:
                    assertion.fullName ||
                    assertion.title ||
                    "Unnamed test",
                result:
                    assertion.status === "passed"
                        ? "passed"
                        : assertion.status === "failed"
                            ? "failed"
                            : assertion.status,
                failureMessage:
                    assertion.status === "failed"
                        ? cleanFailureMessage(
                            assertion.failureMessages
                        )
                        : null
            });
        }
    }

    const passed = tests.filter(
        (test) => test.result === "passed"
    ).length;

    const failed = tests.filter(
        (test) => test.result === "failed"
    ).length;

    const total = tests.length;

    return {
        repository: getRepositoryName(),
        branch: getBranchName(),
        commitSha: getCommitSha(),
        pipelineRunId: getPipelineRunId(),
        pipelineRunNumber:
            process.env.GITHUB_RUN_NUMBER || "local-run",
        executionTimestamp:
            new Date().toISOString(),
        tests,
        summary: {
            total,
            passed,
            failed,
            overallStatus:
                failed === 0 && total > 0
                    ? "passed"
                    : "failed"
        }
    };
}

function main() {
    fs.mkdirSync(
        ARTIFACTS_DIRECTORY,
        { recursive: true }
    );

    const jestResults =
        readJsonFile(JEST_RESULTS_FILE);

    const report = buildReport(jestResults);

    fs.writeFileSync(
        REPORT_PAYLOAD_FILE,
        JSON.stringify(report, null, 2),
        "utf8"
    );

    console.log(
        `Structured report created at ${REPORT_PAYLOAD_FILE}`
    );

    console.log(
        `Overall status: ${report.summary.overallStatus}`
    );

    console.log(
        `Tests: ${report.summary.passed} passed, ` +
        `${report.summary.failed} failed, ` +
        `${report.summary.total} total`
    );
}

try {
    main();
} catch (error) {
    console.error(
        `Unable to build test report: ${error.message}`
    );

    process.exit(1);
}
