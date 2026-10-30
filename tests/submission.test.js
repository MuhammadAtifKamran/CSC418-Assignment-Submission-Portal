"use strict";

function createPortalDocument() {
    document.body.innerHTML = `
        <div
            id="statusMessage"
            class="status-message"
            role="alert"
        ></div>

        <form id="submissionForm" novalidate>
            <input
                type="text"
                id="studentName"
                name="studentName"
            >
            <small id="studentNameError"></small>

            <input
                type="text"
                id="registrationNumber"
                name="registrationNumber"
            >
            <small id="registrationNumberError"></small>

            <input
                type="text"
                id="assignmentTitle"
                name="assignmentTitle"
            >
            <small id="assignmentTitleError"></small>

            <input
                type="url"
                id="submissionUrl"
                name="submissionUrl"
            >
            <small id="submissionUrlError"></small>

            <button type="submit">
                Submit Assignment
            </button>

            <button
                type="reset"
                id="resetButton"
            >
                Reset Form
            </button>
        </form>

        <span id="submissionCount">
            0 submissions
        </span>

        <button
            type="button"
            id="clearAllButton"
        >
            Clear All
        </button>

        <div id="emptyState">
            No submissions saved
        </div>

        <div id="tableContainer" hidden>
            <table>
                <tbody id="submissionTableBody"></tbody>
            </table>
        </div>
    `;
}

function setFormValues({
    studentName = "",
    registrationNumber = "",
    assignmentTitle = "",
    submissionUrl = ""
}) {
    document.getElementById("studentName").value =
        studentName;

    document.getElementById("registrationNumber").value =
        registrationNumber;

    document.getElementById("assignmentTitle").value =
        assignmentTitle;

    document.getElementById("submissionUrl").value =
        submissionUrl;
}

function submitForm() {
    const form =
        document.getElementById("submissionForm");

    form.dispatchEvent(
        new Event("submit", {
            bubbles: true,
            cancelable: true
        })
    );
}

function getSavedSubmissions() {
    const storedValue = localStorage.getItem(
        "csc418_assignment_submissions"
    );

    return storedValue
        ? JSON.parse(storedValue)
        : [];
}

describe(
    "CSC418 Assignment Submission Portal",
    () => {
        beforeEach(() => {
            jest.resetModules();
            localStorage.clear();
            createPortalDocument();

            window.confirm = jest.fn(() => true);

            require("../public/validation.js");
            require("../public/app.js");
        });

        afterEach(() => {
            localStorage.clear();
            document.body.innerHTML = "";
        });

        test(
            "complete details and a valid submission URL are saved and displayed",
            () => {
                setFormValues({
                    studentName:
                        "Muhammad Atif Kamran",
                    registrationNumber:
                        "FA23-BSE-039",
                    assignmentTitle:
                        "CSC418 DevOps Lab Midterm",
                    submissionUrl:
                        "https://github.com/MuhammadAtifKamran/CSC418-Assignment-Submission-Portal"
                });

                submitForm();

                const savedSubmissions =
                    getSavedSubmissions();

                const tableBody =
                    document.getElementById(
                        "submissionTableBody"
                    );

                const statusMessage =
                    document.getElementById(
                        "statusMessage"
                    );

                expect(savedSubmissions).toHaveLength(1);

                expect(
                    savedSubmissions[0]
                        .registrationNumber
                ).toBe("FA23-BSE-039");

                expect(
                    savedSubmissions[0]
                        .submissionUrl
                ).toBe(
                    "https://github.com/MuhammadAtifKamran/CSC418-Assignment-Submission-Portal"
                );

                expect(tableBody.rows).toHaveLength(1);

                expect(tableBody.textContent).toContain(
                    "Muhammad Atif Kamran"
                );

                expect(tableBody.textContent).toContain(
                    "FA23-BSE-039"
                );

                expect(tableBody.textContent).toContain(
                    "CSC418 DevOps Lab Midterm"
                );

                expect(statusMessage.textContent).toBe(
                    "Assignment submitted and saved successfully."
                );
            }
        );

        test(
            "missing registration number is rejected with a validation message",
            () => {
                setFormValues({
                    studentName:
                        "Muhammad Atif Kamran",
                    registrationNumber: "",
                    assignmentTitle:
                        "CSC418 DevOps Lab Midterm",
                    submissionUrl:
                        "https://github.com/MuhammadAtifKamran/CSC418-Assignment-Submission-Portal"
                });

                submitForm();

                const savedSubmissions =
                    getSavedSubmissions();

                const registrationError =
                    document.getElementById(
                        "registrationNumberError"
                    );

                const tableBody =
                    document.getElementById(
                        "submissionTableBody"
                    );

                expect(savedSubmissions).toHaveLength(0);

                expect(
                    registrationError.textContent
                ).toBe(
                    "Registration number is required."
                );

                expect(tableBody.rows).toHaveLength(0);
            }
        );

        test(
            "invalid submission URL is rejected and is not saved",
            () => {
                setFormValues({
                    studentName:
                        "Muhammad Atif Kamran",
                    registrationNumber:
                        "FA23-BSE-039",
                    assignmentTitle:
                        "CSC418 DevOps Lab Midterm",
                    submissionUrl:
                        "not-a-valid-link"
                });

                submitForm();

                const savedSubmissions =
                    getSavedSubmissions();

                const submissionUrlError =
                    document.getElementById(
                        "submissionUrlError"
                    );

                const tableBody =
                    document.getElementById(
                        "submissionTableBody"
                    );

                expect(savedSubmissions).toHaveLength(0);

                expect(
                    submissionUrlError.textContent
                ).toBe(
                    "Enter a valid URL starting with http:// or https://."
                );

                expect(tableBody.rows).toHaveLength(0);
            }
        );
    }
);
