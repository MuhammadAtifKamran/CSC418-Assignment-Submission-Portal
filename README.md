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

## Execute Automated Tests

The automated test suite and its command will be added during the automated-testing stage of the project.

The final test command will be documented here after the Jest test configuration is completed.

## Start the Local Report Receiver

The local HTTP report receiver and its start command will be added during the report-receiver stage.

The final receiver command, port and JSON report location will be documented here after receiver implementation.

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