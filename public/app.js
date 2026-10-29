"use strict";

const STORAGE_KEY = "csc418_assignment_submissions";

const submissionForm =
    document.getElementById("submissionForm");

const studentNameInput =
    document.getElementById("studentName");

const registrationNumberInput =
    document.getElementById("registrationNumber");

const assignmentTitleInput =
    document.getElementById("assignmentTitle");

const submissionUrlInput =
    document.getElementById("submissionUrl");

const statusMessage =
    document.getElementById("statusMessage");

const submissionTableBody =
    document.getElementById("submissionTableBody");

const emptyState =
    document.getElementById("emptyState");

const tableContainer =
    document.getElementById("tableContainer");

const submissionCount =
    document.getElementById("submissionCount");

const clearAllButton =
    document.getElementById("clearAllButton");

const resetButton =
    document.getElementById("resetButton");

const fieldElements = {
    studentName: studentNameInput,
    registrationNumber: registrationNumberInput,
    assignmentTitle: assignmentTitleInput,
    submissionUrl: submissionUrlInput
};

function getSubmissions() {
    try {
        const storedValue =
            localStorage.getItem(STORAGE_KEY);

        if (!storedValue) {
            return [];
        }

        const parsedValue = JSON.parse(storedValue);

        return Array.isArray(parsedValue)
            ? parsedValue
            : [];
    } catch {
        return [];
    }
}

function saveSubmissions(submissions) {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(submissions)
    );
}

function generateSubmissionId() {
    if (
        typeof crypto !== "undefined" &&
        typeof crypto.randomUUID === "function"
    ) {
        return crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random()
        .toString(16)
        .slice(2)}`;
}

function formatSubmittedDate(dateValue) {
    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return "Unknown";
    }

    return date.toLocaleString("en-PK", {
        dateStyle: "medium",
        timeStyle: "short"
    });
}

function setStatusMessage(message, type) {
    statusMessage.textContent = message;
    statusMessage.className =
        `status-message ${type}`;
}

function clearStatusMessage() {
    statusMessage.textContent = "";
    statusMessage.className = "status-message";
}

function clearValidationErrors() {
    Object.entries(fieldElements).forEach(
        ([fieldName, inputElement]) => {
            const errorElement = document.getElementById(
                `${fieldName}Error`
            );

            inputElement.classList.remove("input-error");
            inputElement.removeAttribute("aria-invalid");

            if (errorElement) {
                errorElement.textContent = "";
            }
        }
    );
}

function showValidationErrors(errors) {
    Object.entries(errors).forEach(
        ([fieldName, errorMessage]) => {
            const inputElement =
                fieldElements[fieldName];

            const errorElement = document.getElementById(
                `${fieldName}Error`
            );

            if (inputElement) {
                inputElement.classList.add("input-error");
                inputElement.setAttribute(
                    "aria-invalid",
                    "true"
                );
            }

            if (errorElement) {
                errorElement.textContent = errorMessage;
            }
        }
    );

    const firstInvalidFieldName =
        Object.keys(errors)[0];

    if (firstInvalidFieldName) {
        fieldElements[firstInvalidFieldName]?.focus();
    }
}

function createTextCell(value) {
    const cell = document.createElement("td");
    cell.textContent = value;
    return cell;
}

function createLinkCell(url) {
    const cell = document.createElement("td");
    const link = document.createElement("a");

    link.href = url;
    link.textContent = "Open submission";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.className = "submission-link";

    cell.appendChild(link);

    return cell;
}

function createActionCell(submissionId) {
    const cell = document.createElement("td");
    const deleteButton =
        document.createElement("button");

    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete-button";

    deleteButton.addEventListener("click", () => {
        deleteSubmission(submissionId);
    });

    cell.appendChild(deleteButton);

    return cell;
}

function renderSubmissions() {
    const submissions = getSubmissions();

    submissionTableBody.replaceChildren();

    submissionCount.textContent =
        submissions.length === 1
            ? "1 submission"
            : `${submissions.length} submissions`;

    clearAllButton.disabled =
        submissions.length === 0;

    if (submissions.length === 0) {
        emptyState.hidden = false;
        tableContainer.hidden = true;
        return;
    }

    emptyState.hidden = true;
    tableContainer.hidden = false;

    submissions.forEach((submission) => {
        const row = document.createElement("tr");

        row.appendChild(
            createTextCell(submission.studentName)
        );

        row.appendChild(
            createTextCell(
                submission.registrationNumber
            )
        );

        row.appendChild(
            createTextCell(
                submission.assignmentTitle
            )
        );

        row.appendChild(
            createLinkCell(
                submission.submissionUrl
            )
        );

        row.appendChild(
            createTextCell(
                formatSubmittedDate(
                    submission.submittedAt
                )
            )
        );

        row.appendChild(
            createActionCell(submission.id)
        );

        submissionTableBody.appendChild(row);
    });
}

function deleteSubmission(submissionId) {
    const submissions = getSubmissions();

    const updatedSubmissions =
        submissions.filter(
            (submission) =>
                submission.id !== submissionId
        );

    saveSubmissions(updatedSubmissions);
    renderSubmissions();

    setStatusMessage(
        "Submission deleted successfully.",
        "success"
    );
}

function handleSubmission(event) {
    event.preventDefault();

    clearStatusMessage();
    clearValidationErrors();

    const formData = {
        studentName: studentNameInput.value,
        registrationNumber:
            registrationNumberInput.value,
        assignmentTitle:
            assignmentTitleInput.value,
        submissionUrl:
            submissionUrlInput.value
    };

    const validationResult =
        window.PortalValidation.validateSubmission(
            formData
        );

    if (!validationResult.isValid) {
        showValidationErrors(
            validationResult.errors
        );

        setStatusMessage(
            "Submission was not saved. Correct the highlighted fields.",
            "error"
        );

        return;
    }

    const submissions = getSubmissions();

    const newSubmission = {
        id: generateSubmissionId(),
        ...validationResult.cleanedSubmission,
        submittedAt: new Date().toISOString()
    };

    submissions.unshift(newSubmission);
    saveSubmissions(submissions);

    submissionForm.reset();
    clearValidationErrors();
    renderSubmissions();

    setStatusMessage(
        "Assignment submitted and saved successfully.",
        "success"
    );

    studentNameInput.focus();
}

function handleClearAll() {
    const submissions = getSubmissions();

    if (submissions.length === 0) {
        return;
    }

    const confirmed = window.confirm(
        "Are you sure you want to delete all saved submissions?"
    );

    if (!confirmed) {
        return;
    }

    localStorage.removeItem(STORAGE_KEY);
    renderSubmissions();

    setStatusMessage(
        "All submissions were deleted.",
        "success"
    );
}

submissionForm.addEventListener(
    "submit",
    handleSubmission
);

resetButton.addEventListener("click", () => {
    clearValidationErrors();
    clearStatusMessage();
});

clearAllButton.addEventListener(
    "click",
    handleClearAll
);

registrationNumberInput.addEventListener(
    "input",
    () => {
        registrationNumberInput.value =
            registrationNumberInput.value.toUpperCase();
    }
);

Object.values(fieldElements).forEach(
    (inputElement) => {
        inputElement.addEventListener(
            "input",
            () => {
                inputElement.classList.remove(
                    "input-error"
                );

                inputElement.removeAttribute(
                    "aria-invalid"
                );

                const errorElement =
                    document.getElementById(
                        `${inputElement.name}Error`
                    );

                if (errorElement) {
                    errorElement.textContent = "";
                }
            }
        );
    }
);

renderSubmissions();
