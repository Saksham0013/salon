// 

export function notFound(req, _res, next) {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

export function errorHandler(error, _req, res, _next) {
  console.error("========== BACKEND ERROR ==========");
  console.error(error);
  console.error("===================================");

  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    message: error.message,
    stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    details: error.details || undefined,
  });
}