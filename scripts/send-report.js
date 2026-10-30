"use strict";

const fs = require("node:fs");
const path = require("node:path");

const REPORT_FILE = path.resolve(
    __dirname,
    "..",
    "artifacts",
    "test-report-payload.json"
);

const RECEIVER_URL =
    process.env.REPORT_RECEIVER_URL ||
    "http://127.0.0.1:4000/reports";

async function sendReport() {
    if (!fs.existsSync(REPORT_FILE)) {
        throw new Error(
            `Report payload was not found: ${REPORT_FILE}`
        );
    }

    const report = JSON.parse(
        fs.readFileSync(REPORT_FILE, "utf8")
    );

    console.log(
        `Sending test report to ${RECEIVER_URL}`
    );

    const response = await fetch(RECEIVER_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(report)
    });

    const responseText = await response.text();

    if (!response.ok) {
        throw new Error(
            `Receiver returned HTTP ${response.status}: ` +
            responseText
        );
    }

    console.log(
        "Test report delivered successfully."
    );

    console.log(responseText);
}

sendReport().catch((error) => {
    console.error(
        `Unable to deliver test report: ${error.message}`
    );

    process.exit(1);
});
