"use strict";

const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const HOST = "localhost";
const PORT = 3000;
const PUBLIC_DIRECTORY = path.join(__dirname, "public");

const contentTypes = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".svg": "image/svg+xml"
};

function getSafeFilePath(requestUrl) {
    const urlPath =
        requestUrl === "/"
            ? "/index.html"
            : requestUrl.split("?")[0];

    const normalisedPath = path.normalize(urlPath)
        .replace(/^(\.\.[/\\])+/, "");

    const filePath = path.join(
        PUBLIC_DIRECTORY,
        normalisedPath
    );

    if (!filePath.startsWith(PUBLIC_DIRECTORY)) {
        return null;
    }

    return filePath;
}

const server = http.createServer(
    (request, response) => {
        const filePath =
            getSafeFilePath(request.url);

        if (!filePath) {
            response.writeHead(403, {
                "Content-Type":
                    "text/plain; charset=utf-8"
            });

            response.end("Forbidden");
            return;
        }

        fs.readFile(filePath, (error, fileContent) => {
            if (error) {
                response.writeHead(404, {
                    "Content-Type":
                        "text/plain; charset=utf-8"
                });

                response.end("Page not found");
                return;
            }

            const extension =
                path.extname(filePath).toLowerCase();

            const contentType =
                contentTypes[extension] ??
                "application/octet-stream";

            response.writeHead(200, {
                "Content-Type": contentType
            });

            response.end(fileContent);
        });
    }
);

server.listen(PORT, HOST, () => {
    console.log(
        `Assignment Submission Portal is running at http://${HOST}:${PORT}`
    );

    console.log(
        "Press Ctrl+C to stop the server."
    );
});
