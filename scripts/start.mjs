import { createServer } from "node:http";

import handler from "../dist/server/server.js";

const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || "0.0.0.0";

function requestUrl(request) {
  const forwardedProto = request.headers["x-forwarded-proto"];
  const protocol = typeof forwardedProto === "string" ? forwardedProto.split(",")[0] : "http";
  const hostHeader = request.headers.host || `${host}:${port}`;
  return `${protocol}://${hostHeader}${request.url || "/"}`;
}

const server = createServer(async (request, response) => {
  try {
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