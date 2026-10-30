"use strict";

const fs = require("node:fs");
const path = require("node:path");
const nodemailer = require("nodemailer");

const reportPath = path.join(
    __dirname,
    "..",
    "artifacts",
    "test-report-payload.json"
);

function getRequiredValue(name) {
    const value = process.env[name];

    if (!value) {
        throw new Error(
            `Missing required environment variable: ${name}`
        );
    }

    return value;
}

function escapeHtml(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
}

async function sendEmail() {
    if (!fs.existsSync(reportPath)) {
        throw new Error(
            "The structured test report was not found."
        );
    }

    const smtpUser =
        getRequiredValue("SMTP_USER");

    const smtpPassword =
        getRequiredValue("SMTP_APP_PASSWORD");

    const recipient =
        getRequiredValue("EMAIL_RECIPIENT");

    const report = JSON.parse(
        fs.readFileSync(reportPath, "utf8")
    );

    const status =
        String(
            report.summary.overallStatus
        ).toUpperCase();

    const shortCommit =
        String(report.commitSha).slice(0, 7);

    const runUrl =
        `${process.env.GITHUB_SERVER_URL}/` +
        `${process.env.GITHUB_REPOSITORY}/actions/runs/` +
        `${process.env.GITHUB_RUN_ID}`;

    const individualResults = report.tests
        .map((test, index) => {
            const failure = test.failureMessage
                ? `<pre style="color:#b91c1c;white-space:pre-wrap;">` +
                  `${escapeHtml(test.failureMessage)}</pre>`
                : "";

            return `
                <li style="margin-bottom:14px;">
                    <strong>${escapeHtml(test.name)}</strong><br>
                    Result:
                    <strong>${escapeHtml(test.result)}</strong>
                    ${failure}
                </li>
            `;
        })
        .join("");

    const html = `
        <div style="font-family:Arial,sans-serif;max-width:760px;">
            <h1>CSC418 Automated Test Report</h1>

            <h2>Overall Result: ${escapeHtml(status)}</h2>

            <p>
                <strong>Repository:</strong>
                ${escapeHtml(report.repository)}
            </p>

            <p>
                <strong>Branch:</strong>
                ${escapeHtml(report.branch)}
            </p>

            <p>
                <strong>Commit SHA:</strong>
                ${escapeHtml(report.commitSha)}
            </p>

            <p>
                <strong>Pipeline Run ID:</strong>
                ${escapeHtml(report.pipelineRunId)}
            </p>

            <p>
                <strong>Execution Time:</strong>
                ${escapeHtml(report.executionTimestamp)}
            </p>

            <h2>Test Counts</h2>

            <ul>
                <li>Total: ${report.summary.total}</li>
                <li>Passed: ${report.summary.passed}</li>
                <li>Failed: ${report.summary.failed}</li>
            </ul>

            <h2>Individual Test Results</h2>

            <ol>
                ${individualResults}
            </ol>

            <p>
                <a href="${runUrl}">
                    Open GitHub Actions Run
                </a>
            </p>

            <p>
                The complete JSON test report is attached.
            </p>
        </div>
    `;

    const transporter =
        nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: smtpUser,
                pass: smtpPassword
            }
        });

    await transporter.verify();

    console.log(
        "Gmail SMTP connection verified successfully."
    );

    const result = await transporter.sendMail({
        from:
            `"CSC418 Automated Tests" <${smtpUser}>`,

        to: recipient,

        subject:
            `CSC418 Test Report | ${status} | ` +
            `Commit ${shortCommit}`,

        html,

        attachments: [
            {
                filename: "test-report.json",
                path: reportPath,
                contentType: "application/json"
            }
        ]
    });

    console.log(
        "Email test report sent successfully."
    );

    console.log(`Recipient: ${recipient}`);
    console.log(`Message ID: ${result.messageId}`);
    console.log(`Overall status: ${status}`);

    console.log(
        `Tests: ${report.summary.passed} passed, ` +
        `${report.summary.failed} failed, ` +
        `${report.summary.total} total`
    );
}

sendEmail().catch((error) => {
    console.error(
        `Unable to send email report: ${error.message}`
    );

    process.exit(1);
});
