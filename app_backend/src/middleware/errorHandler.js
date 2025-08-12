export function errorHandler(err, _req, res, _next) {
  // Default error payload
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  const details = err.details || undefined;

  if (status >= 500) {
    console.error("[errorHandler]", err);
  }

  res.status(status).json({ message, ...(details ? { details } : {}) });
}
