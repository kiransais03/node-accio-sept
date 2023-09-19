const LoggerMiddleware = (req, res, next) => {
  console.log(
    `Headers: ${JSON.stringify(req.rawHeaders)} | Body: ${JSON.stringify(
      req.body
    )} | URL: ${req.url} | Method: ${req.method}`
  );

  next();
};

module.exports = { LoggerMiddleware };
