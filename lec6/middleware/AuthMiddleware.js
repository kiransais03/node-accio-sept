const jwt = require("jsonwebtoken");

const isAuth = (req, res, next) => {
  const token = req.headers["x-acciojob"];

  const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);

  if (verified) {
    next();
  } else {
    res.status(401).send({
      status: 401,
      message: "User not authenticated! Please login",
    });
  }
};

module.exports = { isAuth };
