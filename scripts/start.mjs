import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { extname, relative, resolve } from "node:path";

import handler from "../dist/server/server.js";

const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || "0.0.0.0";
const clientRoot = resolve(fileURLToPath(new URL("../dist/client/", import.meta.url)));

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

async function serveClientFile(request, response) {
  if (request.method !== "GET" && request.method !== "HEAD") return false;

  const pathname = new URL(requestUrl(request), "http://localhost").pathname;
  const filePath = resolve(clientRoot, `.${decodeURIComponent(pathname)}`);
  const relativePath = relative(clientRoot, filePath);
  if (relativePath.startsWith("..") || relativePath.includes("..")) return false;

  try {
    const file = await stat(filePath);
    if (!file.isFile()) return false;
    response.statusCode = 200;
    response.setHeader("content-type", contentTypes[extname(filePath)] ?? "application/octet-stream");
    response.setHeader("content-length", file.size);
    if (request.method === "HEAD") {
      response.end();
    } else {
      response.end(await readFile(filePath));
    }
    return true;
  } catch {
    return false;
  }
}

function requestUrl(request) {
  const forwardedProto = request.headers["x-forwarded-proto"];
  const protocol = typeof forwardedProto === "string" ? forwardedProto.split(",")[0] : "http";
  const hostHeader = request.headers.host || `${host}:${port}`;
  return `${protocol}://${hostHeader}${request.url || "/"}`;
}

const server = createServer(async (request, response) => {
  try {
    if (await serveClientFile(request, response)) return;

    const headers = new Headers();
    for (const [name, value] of Object.entries(request.headers)) {
      if (Array.isArray(value)) {
        headers.set(name, value.join(", "));
      } else if (value !== undefined) {
        headers.set(name, value);
      }
    }

    const body = request.method === "GET" || request.method === "HEAD" ? undefined : request;
    const webRequest = new Request(requestUrl(request), {
      method: request.method,
      headers,
      body,
      duplex: body ? "half" : undefined,
    });
    const webResponse = await handler.fetch(webRequest, process.env, undefined);

    response.statusCode = webResponse.status;
    response.statusMessage = webResponse.statusText;
    webResponse.headers.forEach((value, name) => response.setHeader(name, value));
    if (request.method === "HEAD" || !webResponse.body) {
      response.end();
      return;
    }

    for await (const chunk of webResponse.body) response.write(Buffer.from(chunk));
    response.end();
  } catch (error) {
    console.error(error);
    response.statusCode = 500;
    response.setHeader("content-type", "text/plain; charset=utf-8");
    response.end("Internal Server Error");
  }
});

server.listen(port, host, () => {
  console.log(`LayaGreenEnergy listening on http://${host}:${port}`);
});

function shutdown() {
  server.close(() => process.exit(0));
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);