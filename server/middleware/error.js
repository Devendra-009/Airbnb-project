export function notFound(req, res, next) {
  res.status(404);
  next(new Error(`Route not found: ${req.method} ${req.originalUrl}`));
}

export function errorHandler(err, req, res, next) {
  console.error(err);
  const status = err.statusCode || (err.name === "ValidationError" ? 400 : 500);
  const message = err.name === "ValidationError"
    ? Object.values(err.errors).map((e) => e.message).join(", ")
    : err.message || "Internal server error";
  res.status(status).json({ success: false, message });
}
