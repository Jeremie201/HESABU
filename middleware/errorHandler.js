const errorHandler = (err, req, res, next) => {
  console.error(err);

  const statusCode =
    Number.isInteger(err.statusCode) &&
    err.statusCode >= 400 &&
    err.statusCode <= 599
      ? err.statusCode
      : 500;

  res.status(statusCode).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Une erreur interne est survenue."
        : err.message,
  });
};

module.exports = errorHandler;
