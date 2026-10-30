"use strict";

const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const HOST = "127.0.0.1";
const PORT = Number(process.env.RECEIVER_PORT || 4000);

const REPORT_FILE = path.resolve(
    __dirname,
    "..",
    "test-report.json"
);

const TEMP_REPORT_FILE = path.resolve(
    __dirname,
    "..",
    "test-report.tmp.json"
);

function sendJson(response, statusCode, body) {
    response.writeHead(statusCode, {
        "Content-Type": "application/json; charset=utf-8"
    });

    response.end(JSON.stringify(body, null, 2));
}

function isValidReport(report) {
    return (
        report &&
        typeof report === "object" &&
        report.repository &&
        report.branch &&
        report.commitSha &&
        report.pipelineRunId &&
        report.executionTimestamp &&
        Array.isArray(report.tests) &&
        report.summary &&
        typeof report.summary.total === "number" &&
        typeof report.summary.passed === "number" &&
        typeof report.summary.failed === "number" &&
        report.summary.overallStatus
    );
}

const server = http.createServer((request, response) => {
    if (
        request.method === "GET" &&
        request.url === "/health"
    ) {
        sendJson(response, 200, {
            status: "running",
            receiver: "CSC418 Local Test Report Receiver",
            reportFile: REPORT_FILE
        });

        return;
    }

    if (
        request.method !== "POST" ||
        request.url !== "/reports"
    ) {
        sendJson(response, 404, {
            error: "Route not found.",
            availableRoutes: {
                health: "GET /health",
                report: "POST /reports"
            }
        });

        return;
    }

    let requestBody = "";
    let requestTooLarge = false;

    request.on("data", (chunk) => {
        requestBody += chunk;

        if (requestBody.length > 10_000_000) {
            requestTooLarge = true;
            request.destroy();
        }
    });

    request.on("end", () => {
        if (requestTooLarge) {
            sendJson(response, 413, {
                error: "Report payload is too large."
            });

            return;
        }

        try {
            const report = JSON.parse(requestBody);

            if (!isValidReport(report)) {
                sendJson(response, 400, {
                    error: "The received test report is incomplete."
                });

                return;
            }

            const formattedReport =
                JSON.stringify(report, null, 2);

            fs.writeFileSync(
                TEMP_REPORT_FILE,
                formattedReport,
                "utf8"
            );

            fs.renameSync(
                TEMP_REPORT_FILE,
                REPORT_FILE
            );

            console.log("");
            console.log("Test report received successfully.");
            console.log(`Repository: ${report.repository}`);
            console.log(`Branch: ${report.branch}`);
            console.log(`Commit: ${report.commitSha}`);
            console.log(
                `Pipeline run: ${report.pipelineRunId}`
            );
            console.log(
                `Overall status: ${report.summary.overallStatus}`
            );
            console.log(
                `Tests: ${report.summary.passed} passed, ` +
                `${report.summary.failed} failed, ` +
                `${report.summary.total} total`
            );
            console.log(`Saved at: ${REPORT_FILE}`);
            console.log("");

            sendJson(response, 200, {
                message: "Test report received and saved.",
                savedFile: REPORT_FILE,
                overallStatus:
                    report.summary.overallStatus
            });
        } catch (error) {
            console.error(
                "Unable to process the test report:",
                error.message
            );

            sendJson(response, 400, {
                error: "Invalid JSON report.",
                details: error.message
            });
        }
    });

    request.on("error", (error) => {
        console.error(
            "Receiver request error:",
            error.message
        );
    });
});

server.listen(PORT, HOST, () => {
    console.log(
        "CSC418 Local Test Report Receiver is running."
    );

    console.log(
        `Health check: http://${HOST}:${PORT}/health`
    );

    console.log(
        `Report endpoint: http://${HOST}:${PORT}/reports`
    );

    console.log(
        `Reports will be saved to: ${REPORT_FILE}`
    );

    console.log(
        "Keep this terminal open during GitHub Actions runs."
    );
});

function shutdownReceiver() {
    console.log("\nStopping local report receiver...");

    server.close(() => {
        process.exit(0);
    });
}

process.on("SIGINT", shutdownReceiver);
process.on("SIGTERM", shutdownReceiver);
