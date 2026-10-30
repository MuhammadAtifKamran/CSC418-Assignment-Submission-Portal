# CSC418 Assignment Submission Portal

A web-based assignment submission portal developed for the CSC418 DevOps for Cloud Computing Lab Midterm Examination.

## Student Information

- **Name:** Muhammad Atif Kamran
- **Registration Number:** FA23-BSE-039
- **Course Number:** CSC418
- **Course Name:** DevOps for Cloud Computing
- **Project:** Assignment Submission Portal with Automated Testing

## Project Overview

The portal allows students to enter and submit the following information:

- Student name
- Registration number
- Assignment title
- Submission URL

The application validates all required fields and verifies that the submission URL uses the HTTP or HTTPS protocol. Valid submissions are stored in browser local storage and displayed in the saved submissions table.

## Current Features

- Student assignment submission form
- Required-field validation
- Registration number format validation
- Submission URL validation
- Browser local storage
- Saved submissions table
- Submission deletion
- Clear-all functionality
- Responsive web interface

## Technology Stack

- Node.js
- HTML5
- CSS3
- JavaScript
- Git
- GitHub

The following DevOps components are included during later implementation stages:

- Jest automated testing
- GitHub Actions continuous integration
- Local HTTP report receiver
- JSON test reporting
- Conditional GitHub Pages deployment
- Automated email report

## Project Structure

```text
CSC418-Lab-Midterm
├── .github
│   └── workflows
├── data
├── public
│   ├── app.js
│   ├── index.html
│   ├── styles.css
│   └── validation.js
├── receiver
├── tests
├── .gitignore
├── package.json
├── README.md
└── server.js
```

## Prerequisites

Before running the application, install:

- Node.js
- Git
- A modern web browser such as Microsoft Edge or Google Chrome

## Run the Application

Open a terminal in the project root and run:

```bash
npm start
```

The application will run at:

```text
http://localhost:3000
```

Open the displayed local address in a web browser.

To stop the server, press:

```text
Ctrl+C
```

## Install Dependencies

After cloning the repository, install the project dependencies:

```bash
npm ci
```

## Execute Automated Tests

Run the complete Jest test suite:

```bash
npm test
```

The automated tests verify the following required scenarios:

1. Complete details and a valid submission URL are accepted, saved and displayed.
2. A submission with a missing registration number is rejected with a validation message.
3. A submission with an invalid URL is rejected and is not saved.

## Continuous Integration

The GitHub Actions workflow is stored at:

```text
.github/workflows/ci.yml
```

The workflow automatically executes the Jest test suite after every push and for pull requests. If any test fails, the automated test job fails.

## Start the Local Report Receiver

The local HTTP receiver must be running before a self-hosted CI job starts.

Start the receiver from the project root:

```bash
npm run receiver
```

The receiver listens at:

```text
http://127.0.0.1:4000
```

Health-check endpoint:

```text
http://127.0.0.1:4000/health
```

Test-report endpoint:

```text
POST http://127.0.0.1:4000/reports
```

A completed report is automatically saved locally as:

```text
test-report.json
```

The receiver must remain running during passing and failing workflow demonstrations.

## Self-Hosted Runner

The CI job uses a Windows self-hosted GitHub Actions runner with the following labels:

```text
self-hosted
Windows
X64
csc418
```

Start the configured runner from its installation directory:

```powershell
.\run.cmd
```

Keep the runner and local report receiver running during CI execution.

## Test Report Contents

The generated JSON report includes:

- Repository name
- Branch
- Commit SHA
- Pipeline run identifier
- Pipeline run number
- Execution timestamp
- Individual test names
- Individual pass or fail results
- Failure messages where applicable
- Total, passed and failed counts
- Overall test status

## Required Test Scenarios

The automated test suite will verify at least these scenarios:

1. Complete details and a valid submission URL are accepted and saved.
2. A submission with a missing registration number is rejected.
3. A submission with an invalid URL is rejected and not saved.

## CI/CD Workflow

GitHub Actions will run the automated tests after every push to the repository. A failing test will cause the test stage to fail.

The completed test report will contain:

- Repository name
- Branch
- Commit SHA
- Pipeline run identifier
- Execution timestamp
- Individual test names and results
- Failure messages where applicable
- Total, passed and failed test counts
- Overall test status

## Security

Passwords, access tokens, email credentials and other secrets must not be committed to this repository.

Sensitive configuration will be stored using:

- Local environment variables
- A local `.env` file excluded by `.gitignore`
- GitHub Actions Secrets

## Author

**Muhammad Atif Kamran**  
**FA23-BSE-039**
`