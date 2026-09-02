type ErrorOptions = {
  mechanism?: "manual" | "onerror" | "unhandledrejection" | "react_error_boundary";
  handled?: boolean;
  severity?: "error" | "warning" | "info";
};

/**
 * Report runtime errors (previously sent to Lovable editor, now just logged).
 * Can be extended to send to external error tracking service (Sentry, etc).
 */
export function reportLovableError(error: unknown, context: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;

  const message =
    error instanceof Response
      ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}`
      : error instanceof Error
        ? error.message
        : String(error);
  const stack = error instanceof Error ? error.stack : undefined;

  // Log to console for development
  console.error("Runtime Error:", {
    message,
    stack,
    pathname: window.location.pathname,
    context,
  });

  // TODO: Connect to external error tracking service
  // e.g., Sentry, LogRocket, or custom backend error endpoint
}
