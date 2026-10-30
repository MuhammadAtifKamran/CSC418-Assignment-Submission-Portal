(function initialiseValidation(globalObject) {
    "use strict";

    const REGISTRATION_PATTERN = /^[A-Z]{2}\d{2}-[A-Z]{3}-\d{3}$/;

    function normaliseText(value) {
        return String(value ?? "").trim();
    }

    function normaliseRegistrationNumber(value) {
        return normaliseText(value).toUpperCase();
    }

    function isValidSubmissionUrl(value) {
        const cleanValue = normaliseText(value);

        if (!cleanValue) {
            return false;
        }

        try {
            const parsedUrl = new URL(cleanValue);

            return (
                parsedUrl.protocol === "http:" ||
                parsedUrl.protocol === "https:"
            );
        } catch {
            return false;
        }
    }

    function validateSubmission(submission) {
        const cleanedSubmission = {
            studentName: normaliseText(submission.studentName),
            registrationNumber: normaliseRegistrationNumber(
                submission.registrationNumber
            ),
            assignmentTitle: normaliseText(submission.assignmentTitle),
            submissionUrl: normaliseText(submission.submissionUrl)
        };

        const errors = {};

        if (!cleanedSubmission.studentName) {
            errors.studentName = "Student name is required.";
        }

        if (!cleanedSubmission.registrationNumber) {
            errors.registrationNumber =
                "Registration number is required.";
        } else if (
            !REGISTRATION_PATTERN.test(
                cleanedSubmission.registrationNumber
            )
        ) {
            errors.registrationNumber =
                "Use the format FA23-BSE-039.";
        }

        if (!cleanedSubmission.assignmentTitle) {
            errors.assignmentTitle =
                "Assignment title is required.";
        }

        if (!cleanedSubmission.submissionUrl) {
            errors.submissionUrl =
                "Submission URL is required.";
        } else if (
            !isValidSubmissionUrl(
                cleanedSubmission.submissionUrl
            )
        ) {
            errors.submissionUrl =
                "Enter a valid URL starting with http:// or https://.";
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors,
            cleanedSubmission
        };
    }

    const validationApi = {
        REGISTRATION_PATTERN,
        normaliseText,
        normaliseRegistrationNumber,
        isValidSubmissionUrl,
        validateSubmission
    };

    globalObject.PortalValidation = validationApi;

    if (
        typeof module !== "undefined" &&
        module.exports
    ) {
        module.exports = validationApi;
    }
})(typeof window !== "undefined" ? window : globalThis);
